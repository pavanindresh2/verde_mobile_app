// navigation/MainTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ColorConstants } from "../AppStyles";
import TaskStackNavigator from "./TaskStack";
import { MainTabsParamList } from "./types";
import { Task, AppState, User } from "../App";
import { ViewStyle } from "react-native";

const Tab = createBottomTabNavigator<MainTabsParamList>();

type CustomSetAppState = (newState: {
  user: User | null;
  view: "login" | "tasks";
}) => void;

interface MainTabsProps {
  tasks: Task[];
  appState: AppState & {
    setProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  };
  setAppState: CustomSetAppState;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  profileImage: string | null;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const MainTabsNavigator: React.FC<MainTabsProps> = (props) => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none",
          backgroundColor: ColorConstants.surface,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 60,
          paddingBottom: 5,
        } as ViewStyle,
        tabBarActiveTintColor: ColorConstants.primaryAccent,
        tabBarInactiveTintColor: ColorConstants.mediumText,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" color={color} size={size} />
          ),
        }}
      >
        {() => <TaskStackNavigator {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;
