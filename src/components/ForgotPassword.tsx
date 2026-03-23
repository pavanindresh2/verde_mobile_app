import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { showSuccessToast, showErrorToast } from '../lib/toast-config';
import axios from 'axios';
import Constants from "expo-constants";


const CustomColorConstants = {
  primaryAccent: "#2155e5",
  danger: "#FF3B30",
  mediumText: "#6C7A89",
  faintText: "#A8B2BD",
  darkText: "#1C2833",
  surface: "#FFFFFF",
  backgroundLight: "#F8F9FB",
  inputBorder: "#E1E8ED",
  shadow: "#000000",
};

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ??
  "http://default-fallback-url.com";

const logoSource = require("../assets/thumbnail_image005.png");

type ForgotPasswordPageNavigationProps = StackScreenProps<
  AuthStackParamList,
  "ForgotPassword"
>;

const ForgotPasswordPage: React.FC<ForgotPasswordPageNavigationProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();

  const scrollViewRef = useRef<ScrollView>(null);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }

    setEmailError(undefined);
    return true;
  };

  const onSubmitPress = async () => {
    if (!validateEmail()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/forgotPassword`,
        { email }
      );

      const successMessage = response.data?.message || "Password reset link sent to your email!";
      showSuccessToast(successMessage, 'Success');
      
      // Navigate back to login after success
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        "Failed to send reset link. Please try again.";
      showErrorToast(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = () => {
    const hasValue = email.length > 0;
    const shouldFloat = isEmailFocused || hasValue;

    const onFocus = () => {
      setIsEmailFocused(true);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    const onBlur = () => {
      setIsEmailFocused(false);
    };

    return (
      <View style={styles.inputGroupContainer}>
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: emailError
                ? CustomColorConstants.danger
                : isEmailFocused
                ? CustomColorConstants.primaryAccent
                : CustomColorConstants.inputBorder,
              borderWidth: isEmailFocused ? 2 : 1,
              backgroundColor: isEmailFocused
                ? "#F8FAFF"
                : CustomColorConstants.surface,
            },
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={18}
            color={
              emailError
                ? CustomColorConstants.danger
                : isEmailFocused
                ? CustomColorConstants.primaryAccent
                : CustomColorConstants.mediumText
            }
            style={styles.inputIcon}
          />

          <View style={styles.inputContent}>
            {shouldFloat && (
              <Text
                style={[
                  styles.floatingLabel,
                  {
                    color: emailError
                      ? CustomColorConstants.danger
                      : isEmailFocused
                      ? CustomColorConstants.primaryAccent
                      : CustomColorConstants.faintText,
                  },
                ]}
              >
                Email Address
              </Text>
            )}

            <TextInput
              style={[
                styles.textInput,
                !shouldFloat && styles.textInputPlaceholder,
              ]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) {
                  setEmailError(undefined);
                }
              }}
              placeholder={!shouldFloat ? "Email Address" : ""}
              onFocus={onFocus}
              onBlur={onBlur}
              autoCapitalize="none"
              editable={!loading}
              keyboardType="email-address"
              placeholderTextColor={CustomColorConstants.faintText}
            />
          </View>
        </View>

        {emailError && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle"
              size={11}
              color={CustomColorConstants.danger}
            />
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundDecoration}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
        >
          <View style={styles.card}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={CustomColorConstants.darkText}
              />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View style={styles.logoBg}>
                <Image source={logoSource} style={styles.logoImage} />
              </View>
            </View>

            <Text style={styles.titleText}>Forgot Password?</Text>
            <Text style={styles.descriptionText}>
              Enter your email address and we'll send you a link to reset your
              password
            </Text>

            <View style={styles.formContainer}>
              {renderInput()}

              <TouchableOpacity
                onPress={onSubmitPress}
                style={[styles.submitButton, loading && styles.disabledButton]}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loadingText}>Sending...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Send Reset Link</Text>
                    <Ionicons
                      name="send"
                      size={16}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CustomColorConstants.backgroundLight,
  },
  backgroundDecoration: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: CustomColorConstants.primaryAccent,
    opacity: 0.06,
  },
  circle1: {
    width: 350,
    height: 350,
    top: -120,
    right: -100,
  },
  circle2: {
    width: 250,
    height: 250,
    bottom: -80,
    left: -80,
  },
  circle3: {
    width: 180,
    height: 180,
    top: "40%",
    right: -70,
    opacity: 0.04,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: CustomColorConstants.surface,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 26,
    shadowColor: CustomColorConstants.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(33, 85, 229, 0.08)",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 14,
    marginTop: 20,
  },
  logoBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: CustomColorConstants.primaryAccent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  logoImage: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
  titleText: {
    fontSize: 23,
    fontWeight: "700",
    textAlign: "center",
    color: CustomColorConstants.darkText,
    letterSpacing: -0.4,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 13,
    color: CustomColorConstants.mediumText,
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 19,
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  formContainer: {
    width: "100%",
  },
  inputGroupContainer: {
    width: "100%",
    marginBottom: 18,
  },
  inputWrapper: {
    flexDirection: "row",
    borderRadius: 11,
    minHeight: 48,
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 9,
  },
  inputContent: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 4,
  },
  floatingLabel: {
    fontWeight: "600",
    fontSize: 10,
    marginBottom: 2,
  },
  textInput: {
    fontSize: 14,
    color: CustomColorConstants.darkText,
    fontWeight: "500",
    padding: 0,
    margin: 0,
    height: 22,
  },
  textInputPlaceholder: {
    fontSize: 14,
    height: 36,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 4,
  },
  errorText: {
    color: CustomColorConstants.danger,
    fontSize: 11,
    marginLeft: 4,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: CustomColorConstants.primaryAccent,
    height: 46,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: CustomColorConstants.primaryAccent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
  buttonIcon: {
    marginLeft: 7,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginLeft: 9,
    fontSize: 14,
    fontWeight: "600",
  },
  backToLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  backToLoginIcon: {
    marginRight: 6,
  },
  backToLoginText: {
    fontWeight: "600",
    color: CustomColorConstants.primaryAccent,
    fontSize: 14,
  },
});