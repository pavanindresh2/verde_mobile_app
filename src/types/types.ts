import { Task, User } from "../App";
import { StackScreenProps } from "@react-navigation/stack";

// 1️⃣ Auth Stack
export type AuthStackParamList = {
  Login: undefined;
};

// 2️⃣ Task Stack
export type TaskStackParamList = {
  TasksList: { autoSelectTab?: string } | undefined; // Allow tab param
  TaskDetail: { task: Task };
};

// 3️⃣ Main Tabs
export type MainTabsParamList = {
  HomeTab: {
    screen?: keyof TaskStackParamList;
    params?: TaskStackParamList["TasksList"];
  } | undefined;
};

// 4️⃣ Root Stack
export type RootStackParamList = {
  MainTabs: {
    screen?: keyof MainTabsParamList;
    params?: MainTabsParamList[keyof MainTabsParamList];
  } | undefined;
  ProfileModal: { user: User; profileImage: string | null };
  NotificationsModal: undefined;
};

// Utility Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
export type TaskStackScreenProps<T extends keyof TaskStackParamList> =
  StackScreenProps<TaskStackParamList, T>;
