import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "../components/LoginPage";
import ForgotPasswordPage from "../components/ForgotPassword";
import { AuthStackParamList } from "./types";
import { AppState, User } from "../App";

const AuthStack = createStackNavigator<AuthStackParamList>();

interface AuthStackProps {
  setAppState: (newState: {
    user: User | null;
    view: "login" | "tasks";
  }) => void;
}

const AuthStackNavigator: React.FC<AuthStackProps> = ({ setAppState }) => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login">
        {(props) => <LoginPage {...props} setAppState={setAppState} />}
      </AuthStack.Screen>

      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
