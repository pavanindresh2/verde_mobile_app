import { Task, User } from "../App";
import { StackScreenProps } from "@react-navigation/stack";

// --- 1. Auth Stack ---
export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

// --- 2. Task Stack (Nested within MainTabs) ---
export type TaskStackParamList = {
  TasksList: undefined;
  TaskDetail: { task: Task };
};

// --- 3. Main Tabs ---
export type MainTabsParamList = {
  HomeTab: undefined;
};

// --- 4. Root Stack (Handles Tabs and Modals) ---
export type RootStackParamList = {
  MainTabs: undefined;
  ProfileModal: { user: User; profileImage: string | null };
  NotificationsModal: undefined;
};

// --- Utility Types ---
// Exported for use in components/screens
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type TaskStackScreenProps<T extends keyof TaskStackParamList> =
  StackScreenProps<TaskStackParamList, T>;
