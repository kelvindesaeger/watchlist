import { ToastAndroid } from "react-native";

export const toastSuccess = (message: any) => {
  ToastAndroid.show(`✅ ${message}`, ToastAndroid.SHORT);
};

export const toastError = (message: any) => {
  ToastAndroid.show(`❌ ${message}`, ToastAndroid.LONG);
};

export const toastWarning = (message: any) => {
  ToastAndroid.show(`⚠️ ${message}`, ToastAndroid.LONG);
};
