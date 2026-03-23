// services/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { log } from "../config/logger-config";
import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ??
  "http://default-fallback-url.com";

export const debugAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);

    if (stores.length === 0) log.debug("🫙 Storage is empty");

    stores.forEach(([key, value]) => {
      try {
        const parsedValue = JSON.parse(value ?? "");
        log.debug(`🔹 ${key}:`, parsedValue);
      } catch {
        log.debug(`🔹 ${key}:`, value);
      }
    });
  } catch (error) {
    log.error("❌ Error retrieving AsyncStorage:", error);
  }
};

/* Axios Client */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {},
});

/* Request Interceptor - Attach Token */
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    log.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/* Response Interceptor - Auto Logout on 401 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      log.warn("⚠ 401 Unauthorized - Clearing auth data");

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");

      debugAsyncStorage();
    }

    log.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
