// services/update-task-status.ts
import api from "./api";
import { log } from "../config/logger-config";
import { LocationData } from "../App";

export interface UpdateTaskPayload {
  status?: "Pending" | "Completed" | "Accepted" | "Rejected";
  remarks?: string;
  rejectionReason?: string;
  progressStatus?: string;
  address?: {
    latitude: number;
    longitude: number;
    fullAddress: string;
  };
  pictures?: Array<{
    url: string;
    caption?: string;
    uploadedAt?: Date;
  }>;
}

/**
 * Updates task status and metadata
 */
export const updateTaskStatus = async (
  taskId: string,
  payload: UpdateTaskPayload
): Promise<any> => {
  try {
    const response = await api.put(`/task/update/${taskId}`, payload);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Task update failed");
    }
  } catch (error: any) {
    log.error("❌ Update task error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Uploads audit images to the task
 */
export const uploadTaskPictures = async (
  taskId: string,
  imageUris: string[]
): Promise<string[]> => {
  try {
    if (!imageUris || imageUris.length === 0) {
      log.warn("⚠️ No images to upload");
      return [];
    }

    const formData = new FormData();

    // Convert each image URI to a file blob and append to FormData
    for (let i = 0; i < imageUris.length; i++) {
      const uri = imageUris[i];

      // Extract filename from URI or generate one
      const filename =
        uri.split("/").pop() || `audit-image-${Date.now()}-${i}.jpg`;

      // Create file object for React Native
      const file: any = {
        uri: uri,
        type: "image/jpeg", // Adjust if you support other formats
        name: filename,
      };

      formData.append("auditImage", file);
    }

    const response = await api.post(
      `/task/uploadPictures/${taskId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds for image uploads
      }
    );

    if (response.data.success) {
      // Extract URLs from response
      const uploadedUrls = response.data.data.map((pic: any) => pic.url);
      return uploadedUrls;
    } else {
      throw new Error(response.data.message || "Image upload failed");
    }
  } catch (error: any) {
    log.error(
      "❌ Upload pictures error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Uploads multiple audit PDFs to the task
 */
export const uploadTaskPdfs = async (
  taskId: string,
  pdfFiles: Array<{ uri: string; name: string }>
): Promise<string[]> => {
  try {
    if (!pdfFiles || pdfFiles.length === 0) {
      log.warn("⚠️ No PDFs to upload");
      return [];
    }

    const formData = new FormData();

    for (const pdf of pdfFiles) {
      const file: any = {
        uri: pdf.uri,
        type: "application/pdf",
        name: pdf.name,
      };
      formData.append("auditPdf", file);
    }

    const response = await api.post(
      `/task/uploadPdfs/${taskId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      }
    );

    if (response.data.success) {
      return response.data.data.map((pdf: any) => pdf.url);
    } else {
      throw new Error(response.data.message || "PDF upload failed");
    }
  } catch (error: any) {
    log.error("❌ Upload PDFs error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Complete workflow: Upload images + PDFs, then update task
 */
export const submitTaskWithImagesAndLocation = async (
  taskId: string,
  imageUris: string[],
  remarks: string,
  location: LocationData,
  p0: string,
  progressStatus: string | undefined,
  status: "Completed" | "Rejected" = "Completed",
  pdfFiles?: Array<{ uri: string; name: string }> // ADD
): Promise<any> => {
  try {
    let uploadedPictureUrls: string[] = [];

    if (imageUris.length > 0) {
      uploadedPictureUrls = await uploadTaskPictures(taskId, imageUris);
    } else {
      log.warn("⚠️ No images to upload");
    }

    // Upload PDFs if provided
    if (pdfFiles && pdfFiles.length > 0) {
      await uploadTaskPdfs(taskId, pdfFiles);
    }

    const updatePayload: UpdateTaskPayload = {
      status: status,
      remarks: remarks || "Task submitted",
      progressStatus: progressStatus,
      address: {
        latitude: location.latitude,
        longitude: location.longitude,
        fullAddress: location.address,
      },
      pictures: uploadedPictureUrls.map((url) => ({
        url,
        caption: "",
        uploadedAt: new Date(),
      })),
    };

    const updatedTask = await updateTaskStatus(taskId, updatePayload);

    return {
      success: true,
      task: updatedTask,
      uploadedImages: uploadedPictureUrls.length,
    };
  } catch (error: any) {
    log.error("❌ Task submission failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Submit task rejection with reason
 */
export const rejectTask = async (
  taskId: string,
  rejectionReason: string,
  location: LocationData
): Promise<any> => {
  try {
    const payload: UpdateTaskPayload = {
      status: "Rejected",
      rejectionReason: rejectionReason || "Task rejected by auditor",
      remarks: rejectionReason || "Task rejected by auditor",
      address: {
        latitude: location.latitude,
        longitude: location.longitude,
        fullAddress: location.address,
      },
    };

    const updatedTask = await updateTaskStatus(taskId, payload);

    return {
      success: true,
      task: updatedTask,
    };
  } catch (error: any) {
    log.error(
      "❌ Task rejection failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

