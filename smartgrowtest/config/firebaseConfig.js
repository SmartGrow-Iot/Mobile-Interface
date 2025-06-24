import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNyaFsF2INFppfVr2jqCobOKe_tNlN1YM",
  authDomain: "spq-smartgrow-mock-v2.firebaseapp.com",
  projectId: "spq-smartgrow-mock-v2",
  storageBucket: "spq-smartgrow-mock-v2.firebasestorage.app",
  messagingSenderId: "870376323231",
  appId: "1:870376323231:web:c16b34f7cee4f73cf28aaa",
  measurementId: "G-QZBY48BJ63",
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;
