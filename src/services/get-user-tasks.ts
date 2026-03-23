import api from "./api";

export type FetchUserTasksProps = {
  userObjId: string | null | undefined;
  status?: string;
};

//TODO: Change the arg type of below function to fetchUserTasksProps later
export async function fetchUserTasks({
  userObjId,
  status,
}: FetchUserTasksProps) {
  try {
    const response = await api.get("/task/getAll", {
      params: { userObjId, status },
    });

    return response.data;
  } catch (error) {
    console.error("ERROR FETCHING TASKS:", error);
    throw error;
  }
}