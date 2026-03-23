// components/NotificationsPage.tsx
import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles, ColorConstants } from "../AppStyles";
import { RootStackScreenProps } from "../navigation/types";

type NotificationsPageNavigationProps =
  RootStackScreenProps<"NotificationsModal">;

interface NotificationsPageProps extends NotificationsPageNavigationProps {
  onGoBack: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onGoBack }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[{ paddingTop: insets.top }, styles.profileSafeArea]}>
      <StatusBar barStyle="light-content " />
      <View style={styles.profileHeader}>
        <Text style={styles.profileTitle}>Notifications</Text>
        <TouchableOpacity onPress={onGoBack}>
          <Ionicons name="close" size={24} color={ColorConstants.darkText} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContent}>
        <Ionicons
          name="notifications-outline"
          size={100}
          color={ColorConstants.faintText}
          style={{ opacity: 0.5 }}
        />
        <Text style={styles.noNotificationsText}>No new notifications.</Text>
      </View>
    </View>
  );
};

export default NotificationsPage;
