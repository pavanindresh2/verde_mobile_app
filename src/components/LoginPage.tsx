import React, { useState, useRef, useEffect } from "react";
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
import { useLogin } from "../lib/auth-config";
import { showSuccessToast, showErrorToast, showInfoToast } from '../lib/toast-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const logoSource = require("../assets/thumbnail_image005.png");

type LoginPageNavigationProps = StackScreenProps<AuthStackParamList, "Login">;

interface User {
  name: string;
  email: string;
  _id?: string;
  role?: string;
  profilePhoto?: string;
  organisation?: string;
}

interface LoginPageProps extends LoginPageNavigationProps {
  setAppState: (newState: {
    user: User | null;
    view: "login" | "tasks";
  }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setAppState, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const { mutateAsync: login } = useLogin();

  useEffect(() => {
    const checkLogoutMessage = async () => {
      const message = await AsyncStorage.getItem('logoutMessage');
      if (message) {
        showInfoToast(message, 'Logged Out');
        await AsyncStorage.removeItem('logoutMessage');
      }
    };

    checkLogoutMessage();
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onLoginPress = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await login({ email, password });

      if (result.user) {
        const appUser: User = {
          name: result.user.fullName,
          email: result.user.email,
          _id: result.user._id,
          role: result.user.role,
          profilePhoto: result.user.profilePhoto,
          organisation: result.user.organisation,
        };

        const successMessage = result.message || "Login successful!";
        await AsyncStorage.setItem('loginSuccessMessage', successMessage);

        setAppState({ view: "tasks", user: appUser });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Incorrect email or password";
      showErrorToast(errorMessage, 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    setValue: any,
    isFocused: boolean,
    setFocused: any,
    isPassword?: boolean,
    errorMessage?: string,
    icon?: string
  ) => {
    const hasValue = value.length > 0;
    const shouldFloat = isFocused || hasValue;

    const onFocus = () => {
      setFocused(true);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    const onBlur = () => {
      setFocused(false);
    };

    return (
      <View style={styles.inputGroupContainer}>
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: errorMessage
                ? CustomColorConstants.danger
                : isFocused
                  ? CustomColorConstants.primaryAccent
                  : CustomColorConstants.inputBorder,
              borderWidth: isFocused ? 2 : 1,
              backgroundColor: isFocused ? "#F8FAFF" : CustomColorConstants.surface,
            },
          ]}
        >
          {icon && (
            <Ionicons
              name={icon as any}
              size={18}
              color={
                errorMessage
                  ? CustomColorConstants.danger
                  : isFocused
                    ? CustomColorConstants.primaryAccent
                    : CustomColorConstants.mediumText
              }
              style={styles.inputIcon}
            />
          )}

          <View style={styles.inputContent}>
            {shouldFloat && (
              <Text
                style={[
                  styles.floatingLabel,
                  {
                    color: errorMessage
                      ? CustomColorConstants.danger
                      : isFocused
                        ? CustomColorConstants.primaryAccent
                        : CustomColorConstants.faintText,
                  },
                ]}
              >
                {label}
              </Text>
            )}

            <TextInput
              style={[
                styles.textInput,
                !shouldFloat && styles.textInputPlaceholder,
              ]}
              value={value}
              onChangeText={(text) => {
                setValue(text);
                if (errors.email || errors.password) {
                  setErrors({});
                }
              }}
              placeholder={!shouldFloat ? label : ""}
              secureTextEntry={isPassword && !isPasswordVisible}
              onFocus={onFocus}
              onBlur={onBlur}
              autoCapitalize="none"
              editable={!loading}
              keyboardType={isPassword ? "default" : "email-address"}
              placeholderTextColor={CustomColorConstants.faintText}
            />
          </View>

          {isPassword && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible((p) => !p)}
              style={styles.passwordToggle}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={18}
                color={CustomColorConstants.mediumText}
              />
            </TouchableOpacity>
          )}
        </View>

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle"
              size={11}
              color={CustomColorConstants.danger}
            />
            <Text style={styles.errorText}>{errorMessage}</Text>
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
          <View style={styles.loginCard}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBg}>
                <Image source={logoSource} style={styles.logoImage} />
              </View>
            </View>

            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.signInText}>
              Sign in to continue to your account
            </Text>

            <View style={styles.formContainer}>
              {renderInput(
                "Email Address",
                email,
                setEmail,
                emailFocused,
                setEmailFocused,
                false,
                errors.email,
                "mail-outline"
              )}
              {renderInput(
                "Password",
                password,
                setPassword,
                passwordFocused,
                setPasswordFocused,
                true,
                errors.password,
                "lock-closed-outline"
              )}

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onLoginPress}
                style={[styles.loginButton, loading && styles.disabledButton]}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loadingText}>Signing in...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                    <Ionicons
                      name="arrow-forward"
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

export default LoginPage;

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
  loginCard: {
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 14,
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
  welcomeText: {
    fontSize: 23,
    fontWeight: "700",
    textAlign: "center",
    color: CustomColorConstants.darkText,
    letterSpacing: -0.4,
    marginBottom: 5,
  },
  signInText: {
    fontSize: 13,
    color: CustomColorConstants.mediumText,
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 19,
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
  },
  inputGroupContainer: {
    width: "100%",
    marginBottom: 14,
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
  passwordToggle: {
    padding: 7,
    marginLeft: 4,
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
    marginTop: 2,
  },
  forgotPasswordText: {
    fontWeight: "600",
    color: CustomColorConstants.primaryAccent,
    fontSize: 13,
  },
  loginButton: {
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
  },
  loginButtonText: {
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
});