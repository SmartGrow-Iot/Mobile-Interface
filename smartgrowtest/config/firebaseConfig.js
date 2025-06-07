import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDX-gNchplUV1oC2W9AEb1D0A3TDbkNrCU",
  authDomain: "spq-smartgrow-mock.firebaseapp.com",
  projectId: "spq-smartgrow-mock",
  storageBucket: "spq-smartgrow-mock.firebasestorage.app",
  messagingSenderId: "784340191510",
  appId: "1:784340191510:web:12af7b1a229b09b5922837",
  measurementId: "G-QZBY48BJ63",
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;
