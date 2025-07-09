import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
//firebase 1: spq-smartgrow-mock
// const firebaseConfig = {
//   apiKey: "AIzaSyDX-gNchplUV1oC2W9AEb1D0A3TDbkNrCU",
//   authDomain: "spq-smartgrow-mock.firebaseapp.com",
//   projectId: "spq-smartgrow-mock",
//   storageBucket: "spq-smartgrow-mock.firebasestorage.app",
//   messagingSenderId: "784340191510",
//   appId: "1:784340191510:web:12af7b1a229b09b5922837",
//   measurementId: "G-QZBY48BJ63",
// };


//firebase 2: spq-smartgrow-mock-v2
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
