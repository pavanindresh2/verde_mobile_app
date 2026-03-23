// services/authService.ts
import { log } from "../config/logger-config";
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debugAsyncStorage } from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profilePhoto?: string;
  organisation: string;
}

export interface LoginResponse {
  message: string;
  user: UserData;
  success: boolean;
  token: string;
}

export interface LogoutResponse {
  message: string;
  success: boolean;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      log.info("▶ Login Request Fired");

      const response = await api.post<LoginResponse>(
        "/user/login",
        credentials
      );
      const { success, user, token, message } = response.data;

      if (!success || !user || !token) {
        throw new Error(message || "Login failed");
      }

      // ✅ Check if user role is "Auditor"
      if (user.role !== "Auditor") {
        throw new Error(
          "Access Denied: Only Auditors can access this application"
        );
      }

      // ✅ Store user data and token in AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);

      log.info("✅ Login successful - Token and user data stored");

      debugAsyncStorage();

      return response.data;
    } catch (error: any) {
      log.error(
        "❌ Login Error:",
        error.response?.data?.message || error.message
      );

      // Clean up storage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");
      await debugAsyncStorage();

      // Extract error message from backend or use default
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Network error. Try again.";

      // ✅ THROW the error so it can be caught in auth-config
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<LogoutResponse> {
    try {
      log.info("▶ Logout Request Fired");

      const response = await api.get<LogoutResponse>("/user/logout");
      log.info("✅ Logout API call successful");

      // 👇 Extract actual data safely
      const result = response.data;

      // Clear local storage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");

      log.info("✅ Local storage cleared");
      debugAsyncStorage();

      // 👇 Return API's own message
      return result;
    } catch (error) {
      log.warn("⚠ Logout request failed, but continuing cleanup...");

      // Still clear storage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");

      log.info("✅ Local storage cleared");
      debugAsyncStorage();

      // 👇 On error, return consistent structure
      return { success: false, message: "Logout failed" };
    }
  }

  async getUserData(): Promise<{
    user: UserData | null;
    token: string | null;
  }> {
    try {
      const userData = await AsyncStorage.getItem("userData");
      const token = await AsyncStorage.getItem("token");

      if (userData && token) {
        const user: UserData = JSON.parse(userData);

        // ✅ Verify the stored user is still an Auditor
        if (user.role !== "Auditor") {
          log.warn("⚠ Stored user is not an Auditor - clearing data");
          await this.logout();
          return { user: null, token: null };
        }

        return { user, token };
      }

      return { user: null, token: null };
    } catch (error) {
      log.error("❌ Error getting user data:", error);
      // Clear corrupted data
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");
      return { user: null, token: null };
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const { token, user } = await this.getUserData();
    return !!token && !!user && user.role === "Auditor";
  }
}

export default new AuthService();
