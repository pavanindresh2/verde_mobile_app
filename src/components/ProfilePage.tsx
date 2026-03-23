import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Clipboard,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLogout, useUser } from "../lib/auth-config";
import { ColorConstants } from "../AppStyles";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

type ProfilePageProps = {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  profileImage: string | null;
  setProfileImage: (img: string | null) => void;
  onGoBack: () => void;
  setAppState: (v: any) => void;
  navigation: any;
  route: any;
};

export default function ProfilePage({
  profileImage,
  setProfileImage,
  onGoBack,
  setAppState,
  navigation,
}: ProfilePageProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const { mutateAsync: logout } = useLogout();
  const user1 = useUser();
  const initial = user1?.data?.user?.fullName.charAt(0).toUpperCase();

  const user = user1?.data?.user;

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    ImagePicker.requestMediaLibraryPermissionsAsync();

    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const result = (await logout({})) as {
              message: string;
              success: boolean;
            };
            await AsyncStorage.setItem("logoutMessage", result.message);
            setAppState({ user: null, view: "login" });
          } catch (error) {
            console.error("Logout error:", error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const copyID = () => {
    Clipboard.setString(user?._id || "");
    Alert.alert("Copied!", "User ID copied to clipboard");
  };

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    iconColor = "#3B82F6",
    iconBg = "#EEF2FF",
    showArrow = true,
    danger = false,
  }: any) => {
    const pressAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={loading}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={20} color={iconColor} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, danger && { color: "#EF4444" }]}>
              {title}
            </Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
          </View>
          {showArrow && (
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          )}
          {loading && danger && (
            <ActivityIndicator color="#EF4444" size="small" />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const InfoCard = ({
    icon,
    label,
    value,
    onPress,
    iconColor = "#3B82F6",
  }: any) => (
    <TouchableOpacity
      style={styles.infoCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View
        style={[
          styles.infoIconContainer,
          { backgroundColor: iconColor + "15" },
        ]}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
      {onPress && (
        <TouchableOpacity onPress={onPress} style={styles.copyButton}>
          <Ionicons name="copy-outline" size={16} color="#3B82F6" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Back Button */}
      <View style={[styles.fixedBackButton, { top: insets.top + 8 }]}>
        <TouchableOpacity onPress={onGoBack}>
          <View style={styles.backButtonInner}>
            <Ionicons name="arrow-back" size={22} color="#3B82F6" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Scrollable Header */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <LinearGradient
            colors={["#3B82F6", "#2563EB", "#1D4ED8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            {/* Decorative circles */}
            <View style={styles.headerCircle1} />
            <View style={styles.headerCircle2} />

            {/* Header content */}
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>My Profile</Text>
              <Text style={styles.headerSubtitle}>Manage your account</Text>
            </View>
          </LinearGradient>

          {/* Avatar - now part of scroll content */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarShadow}>
              <TouchableOpacity activeOpacity={0.9}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>{initial}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={[
            styles.contentWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* User name */}
          <Text style={styles.userName}>{user?.fullName}</Text>

          {/* Info Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
            <View style={styles.infoCardsContainer}>
              <InfoCard
                icon="mail"
                label="Email Address"
                value={user?.email}
                iconColor="#3B82F6"
              />
              <InfoCard
                icon="finger-print"
                label="User ID"
                value={user?._id}
                onPress={copyID}
                iconColor="#8B5CF6"
              />
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
            <View style={styles.menuContainer}>
              <MenuItem
                icon="notifications"
                title="Notifications"
                subtitle="Manage your notifications"
                onPress={() => navigation.navigate("NotificationsModal")}
                iconColor="#F59E0B"
                iconBg="#FEF3C7"
              />
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            <View style={styles.menuContainer}>
              <MenuItem
                icon="log-out"
                title="Logout"
                subtitle="Sign out of your account"
                onPress={handleLogout}
                iconColor="#EF4444"
                iconBg="#FEE2E2"
                showArrow={false}
                danger
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Version 1.1.0</Text>
        <Text style={styles.appCopyright}>© 2026 VERDE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  fixedBackButton: {
    position: "absolute",
    left: 16,
    zIndex: 1000,
  },
  backButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerGradient: {
    height: 160,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    position: "relative",
  },
  headerCircle1: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: -80,
    right: -60,
  },
  headerCircle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    bottom: -40,
    left: -50,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
    marginTop: 2,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -50,
    marginBottom: 12,
  },
  avatarShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: "700",
    color: "#3B82F6",
  },
  editButton: {
    position: "absolute",
    bottom: 2,
    right: 2,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
  },
  editButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    paddingHorizontal: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  infoCardsContainer: {
    gap: 10,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  appInfo: {
    alignItems: "center",
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  appVersion: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
