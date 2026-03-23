// navigation/TaskStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Alert } from "react-native";
import TasksPage from "../components/tasks/TasksPage";
import TaskDetailPage from "../components/tasks/TaskDetailPage";
import { Task, AppState, User, LocationData } from "../App";
import { TaskStackParamList } from "./types";
import {
  submitTaskWithImagesAndLocation,
  rejectTask,
} from "../services/update-task-status";
import { log } from "../config/logger-config";

const Stack = createStackNavigator<TaskStackParamList>();

type CustomSetAppState = (newState: {
  user: User | null;
  view: "login" | "tasks";
}) => void;

interface TaskStackProps {
  tasks: Task[];
  appState: AppState;
  setAppState: CustomSetAppState;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  profileImage: string | null;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const TaskStackNavigator: React.FC<TaskStackProps> = (props) => {

  const onTaskUpdate = async (
    taskId: string,
    status: Task["status"],
    images: string[],
    comment: string,
    location?: LocationData,
    progressStatus?: string,
    pdfFiles?: Array<{ uri: string; name: string }> // ADD
  ) => {
    if (!location) {
      throw new Error("Location is required for task submission");
    }

    try {
      if (status === "Rejected") {
        await rejectTask(taskId, comment || "Task rejected by auditor", location);
        return;
      }

      if (status === "Completed") {
        await submitTaskWithImagesAndLocation(
          taskId,
          images,
          comment,
          location,
          "Completed",
          progressStatus,
          "Completed",
          pdfFiles  // ADD
        );
        return;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit task. Please try again.";
      throw new Error(errorMessage);
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="TasksList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TasksList">
        {() => (
          <TasksPage {...props} setActiveSection={props.setActiveSection} />
        )}
      </Stack.Screen>

      <Stack.Screen name="TaskDetail">
        {({ route, navigation }) => {
          const { task } = route.params;
          return (
            <TaskDetailPage
              task={task}
              onGoBack={() => navigation.goBack()}
              onTaskUpdate={onTaskUpdate}
              images={props.appState.images}
              setImages={props.appState.setImages}
              comment={props.appState.comment}
              setComment={props.appState.setComment}
              pdfFiles={props.appState.pdfFiles}
              setPdfFiles={props.appState.setPdfFiles}
              navigation={navigation as any}
              route={route as any}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default TaskStackNavigator;
