// // utils/transformations/task-transform.ts
// import { Task, SubmissionData } from "../../App";

// export function mapApiItemToTask(item: any): Task {
// return {
//   _id: item._id ?? "",
//   id: item._id ?? "",

//   orderId:
//     item.orderStageTrackingObjId?.orderVariantObjId?.orderObjId?.modelId ??
//     "N/A",
//   orderStageId: item.orderStageTrackingObjId?._id ?? "",
//   taskId: item.orderTaskId ?? "",
//   factory: item.orderStageTrackingObjId?.factoryOrgId?.name ?? "N/A",

//   product:
//     (
//       `${item.orderStageTrackingObjId?.orderVariantObjId?.orderObjId?.productType ?? ""} ` +
//       `${item.orderStageTrackingObjId?.orderVariantObjId?.orderObjId?.productClass ?? ""} ` +
//       `${item.orderStageTrackingObjId?.orderVariantObjId?.orderObjId?.productSubclass ?? ""}`
//     ).trim() || "N/A",

//   stage: item.orderStageTrackingObjId?.stageName ?? "",
//   stageStatus: item.orderStageTrackingObjId?.stageStatus ?? "pending",

//   taskType: item.taskType ?? "",
//   status: item.status ?? "Pending",
//   priority: item.priority ?? "",

//   dueDate: item.dueDate ?? null,
//   completedOn: item.completedOn ?? null,

//   address: item.address ?? null,
//   remarks: item.remarks ?? null,
//   rejectionReason: item.rejectionReason ?? null,

//   photos: item.pictures?.map((p: any) => p.url) ?? [],
//   comments: item.remarks ?? "",

//   isOverdue: !!item.dueDate && new Date(item.dueDate) < new Date(),
//   isSubmitted: item.status === "Accepted",
//   isCompleted: item.status === "Completed",
//   isRejected: item.status === "Rejected",

//   // 🆕 REQUIRED NEW FIELD
//   submissionData: item.submissionData ?? {
//     images: [],
//     comment: "",
//     location: null,
//   },
// };

// };

// export const mapApiResponseToTasks = (apiData: any[]): Task[] =>
//   apiData.map(mapApiItemToTask);

// utils/transformations/task-transform.ts
import { Task } from "../../App";

/**
 * Helper to safely get nested stage tracking data
 * Handles all 3 module types: order, preProduction, production
 */
const getStageTrackingData = (item: any) => {
  // Try Order module first
  if (item.orderStageTrackingObjId) {
    return {
      stageTracking: item.orderStageTrackingObjId,
      variant: item.orderStageTrackingObjId.orderVariantObjId,
      order: item.orderStageTrackingObjId.orderVariantObjId?.orderObjId,
      factory: item.orderStageTrackingObjId.factoryOrgId,
    };
  }

  // Try PreProduction module
  if (item.preProductionOrderStageTrackingObjId) {
    return {
      stageTracking: item.preProductionOrderStageTrackingObjId,
      variant:
        item.preProductionOrderStageTrackingObjId
          .preProductionOrderVariantObjId,
      order:
        item.preProductionOrderStageTrackingObjId.preProductionOrderVariantObjId
          ?.preProductionOrderObjId,
      factory: item.preProductionOrderStageTrackingObjId.factoryOrgId,
    };
  }

  // Try Production module
  if (item.productionOrderStageTrackingObjId) {
    return {
      stageTracking: item.productionOrderStageTrackingObjId,
      variant:
        item.productionOrderStageTrackingObjId.productionOrderVariantObjId,
      order:
        item.productionOrderStageTrackingObjId.productionOrderVariantObjId
          ?.productionOrderObjId,
      factory: item.productionOrderStageTrackingObjId.factoryOrgId,
    };
  }

  // Fallback - no stage tracking found
  return {
    stageTracking: null,
    variant: null,
    order: null,
    factory: null,
  };
};

/**
 * Get the correct task ID based on module type
 */
const getTaskId = (item: any): string => {
  return (
    item.orderTaskId ||
    item.preProductionOrderTaskId ||
    item.productionOrderTaskId ||
    item._id ||
    "N/A"
  );
};

/**
 * Get the correct order stage ID based on module type
 */
const getOrderStageId = (stageTracking: any): string => {
  return stageTracking?._id || "";
};

/**
 * Maps API response item to frontend Task interface
 */
export function mapApiItemToTask(item: any): Task {
  // Extract data using helper
  const { stageTracking, variant, order, factory } = getStageTrackingData(item);

  // Build product string
  const productType = order?.productType || "";
  const productClass = order?.productClass || "";
  const productSubclass = order?.productSubclass || "";
  const product =
    `${productType} ${productClass} ${productSubclass}`.trim() || "N/A";

  return {
    _id: item._id ?? "",
    id: item._id ?? "",

    // Order and Stage IDs
    orderId: order?.modelId || order?.VIMSid || "N/A",
    orderStageId: getOrderStageId(stageTracking),
    taskId: getTaskId(item),

    // Factory
    factory: factory?.name ?? "N/A",

    // Product information
    product: product,

    // Stage information
    stage: stageTracking?.stageName ?? "N/A",
    stageStatus: stageTracking?.stageStatus ?? "pending",

    // Task details
    taskType: item.taskType ?? "",
    status: item.status ?? "Pending",
    priority: item.priority ?? "Medium",
    progressStatus: item.progressStatus ?? "-",
    // Dates
    dueDate: item.dueDate ?? null,
    completedOn: item.completedOn ?? null,

    // Location and feedback
    address: item.address ?? null,
    remarks: item.remarks ?? null,
    rejectionReason: item.rejectionReason ?? null,

    // Photos and comments
    photos: item.pictures?.map((p: any) => p.url) ?? [],
    comments: item.remarks ?? "",
    pdfs: item.pdfs ?? [], 

    // Status flags
    isOverdue: !!item.dueDate && new Date(item.dueDate) < new Date(),
    isSubmitted: item.status === "Accepted",
    isCompleted: item.status === "Completed",
    isRejected: item.status === "Rejected",

    // Module type for reference
    moduleType: item.moduleType,

    // Store the entire stage tracking object for accessing nested data
    // This is used in TaskDetailPage for product details
    orderStageTrackingObjId: stageTracking,
    preProductionOrderStageTrackingObjId:
      item.preProductionOrderStageTrackingObjId,
    productionOrderStageTrackingObjId: item.productionOrderStageTrackingObjId,

    // Submission data
    submissionData: item.submissionData ?? {
      images: [],
      comment: "",
      location: null,
    },

    // Additional fields that might be needed
    taskDescription: item.taskDescription,
    scheduledDate: item.scheduledDate,
    userObjId: item.userObjId,
    createdBy: item.createdBy,
    updatedBy: item.updatedBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  } as Task;
}

/**
 * Maps array of API response items to Task array
 */
export const mapApiResponseToTasks = (apiData: any[]): Task[] => {
  if (!Array.isArray(apiData)) {
    console.warn("mapApiResponseToTasks received non-array data:", apiData);
    return [];
  }

  return apiData.map(mapApiItemToTask);
};
