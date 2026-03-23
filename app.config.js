import "dotenv/config";

export default {
  expo: {
    name: "VIMS",
    slug: "testing-app",
    version: "1.0.0",
    owner: "pavanindresh",
    orientation: "portrait",

    // ✅ MAIN ICON (from src)
    icon: "./src/assets/waving.jpg",

    userInterfaceStyle: "light",
    newArchEnabled: true,

    splash: {
      image: "./src/assets/waving.jpg",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
    },

    // ✅ ANDROID APK ICON FIX
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/waving.jpg",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.testingapp",
    },
    
    web: {
      favicon: "./src/assets/waving.jpg",
    },
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
      eas: {
        projectId: "b5b14f36-4b2a-4626-aed4-8f9c23a9cc68",
      },
    },
  },
};
