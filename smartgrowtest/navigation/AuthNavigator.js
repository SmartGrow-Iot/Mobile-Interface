import { createStackNavigator } from "@react-navigation/stack"
import SignInScreen from "../screens/auth/SignInScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"
import GoogleLoginScreen from "../screens/auth/GoogleLoginScreen"

const AuthStack = createStackNavigator()

export default function AuthNavigator({ onAuthSuccess }) {
  return (
    <AuthStack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#ffffff" },
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress,
          },
        }),
      }}
    >
      <AuthStack.Screen name="SignIn">
        {(props) => <SignInScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="SignUp">
        {(props) => <SignUpScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="GoogleLogin">
        {(props) => <GoogleLoginScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  )
}
