import Toast from 'react-native-toast-message';

export const showSuccessToast = (message: string, title: string = 'Success') => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position: 'bottom',
    visibilityTime: 3000,
    topOffset: 30,
  });
};

export const showErrorToast = (message: string, title: string = 'Error') => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'bottom',
    visibilityTime: 4000,
    bottomOffset: 30,
  });
};

export const showInfoToast = (message: string, title: string = 'Info') => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    position: 'bottom',
    visibilityTime: 3000,
    topOffset: 30,
  });
};