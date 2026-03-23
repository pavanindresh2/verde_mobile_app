// services/upload-photo.ts
import api from "./api";

export async function uploadPhoto(fileUri: string): Promise<string> {
  const formData = new FormData();

  formData.append("updatedPO", {
    uri: fileUri,
    type: "image/jpeg",
    name: `task_photo_${Date.now()}.jpg`,
  } as any);

  const response = await api.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.imageUrl;
}
