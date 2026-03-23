import React, { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const SlideInWrapper = ({ children }: any) => {
  const slideAnim = useRef(new Animated.Value(400)).current; // off screen right

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
        width: '100%',
      }}
    >
      {children}
    </Animated.View>
  );
};

export const toastConfig = {
  success: (props: any) => (
    <SlideInWrapper>
      <BaseToast {...props} />
    </SlideInWrapper>
  ),
  error: (props: any) => (
    <SlideInWrapper>
      <ErrorToast {...props} />
    </SlideInWrapper>
  ),
  info: (props: any) => (
    <SlideInWrapper>
      <BaseToast {...props} />
    </SlideInWrapper>
  ),
};
