import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import FooterNavigation from "./src/components/FooterNavigation";

// Screens
import AuthScreen from "./src/screens/AuthScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import ProductMatchingScreen from "./src/screens/ProductMatchingScreen";
import QRCodeScreen from "./src/screens/QRCodeScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import RefillMapScreen from "./src/screens/RefillMapScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SkinSummaryScreen from "./src/screens/SkinSummaryScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import { ThemeProvider, useTheme } from "./src/styles/ThemeProvider";

const Stack = createStackNavigator();
const navigationRef = createNavigationContainerRef();

// Charge un écran spécifique au web pour éviter l'import d'expo-camera côté web
const CameraCaptureScreen = Platform.select({
  web: require("./src/screens/CameraCaptureScreen.web").default,
  default: require("./src/screens/CameraCaptureScreen").default,
});

function AppInner() {
  const [currentRoute, setCurrentRoute] = useState("Dashboard");
  const { isDark, colors } = useTheme();

  useEffect(() => {
    if (Platform.OS === "web") {
      const html = document.documentElement;
      const body = document.body;
      const root = document.getElementById("root");

      const prev = {
        htmlHeight: html.style.height,
        bodyHeight: body.style.height,
        bodyOverflowY: body.style.overflowY,
        rootHeight: root?.style.height,
        rootOverflow: root?.style.overflowY,
      };

      html.style.height = "100%";
      body.style.height = "100%";
      body.style.overflowY = "auto";
      if (root) {
        root.style.height = "100%";
        root.style.overflowY = "auto";
      }

      return () => {
        html.style.height = prev.htmlHeight;
        body.style.height = prev.bodyHeight;
        body.style.overflowY = prev.bodyOverflowY || "";
        if (root) {
          root.style.height = prev.rootHeight || "";
          root.style.overflowY = prev.rootOverflow || "";
        }
      };
    }
  }, []);

  const showDock = !["RefillMap", "CameraCapture", "ProductMatching"].includes(
    currentRoute
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          const name = navigationRef.getCurrentRoute()?.name;
          if (name) setCurrentRoute(name);
        }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
          initialRouteName="Dashboard"
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen
            name="ProductMatching"
            component={ProductMatchingScreen}
          />
          <Stack.Screen name="RefillMap" component={RefillMapScreen} />
          <Stack.Screen name="QRCode" component={QRCodeScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="SkinSummary" component={SkinSummaryScreen} />
          <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Products" component={ProductsScreen} />
        </Stack.Navigator>

        <FooterNavigation
          navigationRef={navigationRef}
          currentRoute={currentRoute}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
