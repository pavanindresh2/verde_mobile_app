import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../stores/auth-context";
import AuthStackNavigator from "./AuthStack";
import RootNavigator from "./RootNavigator";
import type { Task, AppState } from "../App";
import { log } from "../config/logger-config";
import { useUser } from "../lib/auth-config";

interface Props {
  tasks: Task[];
  appState: AppState & {
    setProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  };
  setAppState: React.Dispatch<
    React.SetStateAction<{ user: any; view: "login" | "tasks" }>
  >;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  profileImage: string | null;
  setProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const AppNavigator: React.FC<Props> = (props) => {
  const { data: user } = useUser();

  return (
    <NavigationContainer>
      {user?.user ? (
        <RootNavigator
          tasks={props.tasks}
          appState={props.appState}
          setAppState={props.setAppState}
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          profileImage={props.profileImage}
          setProfileImage={props.setProfileImage}
          setActiveSection={props.setActiveSection}
        />
      ) : (
        <AuthStackNavigator setAppState={props.setAppState} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
