// navigation/RootNavigator.tsx
import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import MainTabsNavigator from "./MainTabs";
import ProfilePage from "../components/ProfilePage";
import NotificationsPage from "../components/NotificationsPage";
import { RootStackParamList } from "./types";
import { Task, AppState, User } from "../App";

const RootStack = createStackNavigator<RootStackParamList>();

type CustomSetAppState = (newState: {
  user: User | null;
  view: "login" | "tasks";
}) => void;

interface RootNavigatorProps {
  tasks: Task[];
  appState: AppState & {
    setProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  };
  setAppState: CustomSetAppState;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  profileImage: string | null;
  setProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const RootNavigator: React.FC<RootNavigatorProps> = (props) => {
  return (
    <RootStack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <RootStack.Screen name="MainTabs">
        {() => <MainTabsNavigator {...props} />}
      </RootStack.Screen>

      <RootStack.Screen
        name="ProfileModal"
        options={{
          presentation: "modal",
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      >
        {({ route, navigation }) => {
          const { user, profileImage } = route.params;
          return (
            <ProfilePage
              user={user}
              profileImage={profileImage}
              setProfileImage={props.setProfileImage}
              onGoBack={() => navigation.goBack()}
              setAppState={props.setAppState}
              navigation={navigation as any}
              route={route as any}
            />
          );
        }}
      </RootStack.Screen>

      <RootStack.Screen
        name="NotificationsModal"
        options={{
          presentation: "modal",
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      >
        {({ navigation, route }) => (
          <NotificationsPage
            onGoBack={() => navigation.goBack()}
            navigation={navigation as any}
            route={route as any}
          />
        )}
      </RootStack.Screen>
    </RootStack.Navigator>
  );
};

export default RootNavigator;
