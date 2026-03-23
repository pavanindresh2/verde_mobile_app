import { configureAuth } from "react-query-auth";
import authService, {
  LoginCredentials,
  LoginResponse,
  UserData,
} from "../services/authService";

export interface UserResponse {
  user: UserData | null;
  token: string | null;
  error: Error | null;
  message?: string; // ADD THIS
}

const authConfig = {
  userFn: async (): Promise<UserResponse> => {
    try {
      const { user, token } = await authService.getUserData();

      return {
        user,
        token,
        error: null,
      };
    } catch (error: any) {
      return {
        user: null,
        token: null,
        error,
      };
    }
  },

  loginFn: async (credentials: LoginCredentials): Promise<UserResponse> => {
    try {
      const response: LoginResponse = await authService.login(credentials);
      const { user, token, message } = response;

      return { user, token, error: null, message };
    } catch (error: any) {
      // ✅ THROW the error instead of returning it
      // This makes react-query treat it as a failure
      throw error;
    }
  },

  registerFn: async (credentials: any): Promise<UserResponse> => {
    try {
      const response = await authService.login(credentials);
      return { user: response.user, token: response.token, error: null };
    } catch (error: any) {
      return { user: null, token: null, error };
    }
  },

  logoutFn: async () => {
    try {
      const rep = await authService.logout();
      return rep;
    } catch (err) {
      return err;
    }
  },
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);
