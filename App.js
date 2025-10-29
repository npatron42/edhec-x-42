import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Platform, Easing } from "react-native";
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
import BeautyAnalysisScreen from "./src/screens/BeautyAnalysisScreen";

const Stack = createStackNavigator();
const navigationRef = createNavigationContainerRef();

// Charge un écran spécifique au web pour éviter l'import d'expo-camera côté web
const CameraCaptureScreen = Platform.select({
  web: require("./src/screens/CameraCaptureScreen.web").default,
  default: require("./src/screens/CameraCaptureScreen").default,
});

const FOOTER_ROUTES = ["Dashboard", "QRCode", "RefillMap", "Profile"];

const transitionOpenSpec = {
  animation: "timing",
  config: {
    duration: 260,
    easing: Easing.out(Easing.cubic),
  },
};

const transitionCloseSpec = {
  animation: "timing",
  config: {
    duration: 220,
    easing: Easing.out(Easing.cubic),
  },
};

const createDirectionalInterpolator = (direction) => ({
  current,
  layouts,
}) => {
  const width = layouts.screen.width;
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: direction === "right" ? [width, 0] : [-width, 0],
  });

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.05],
  });

  return {
    cardStyle: {
      transform: [{ translateX }],
    },
    overlayStyle: {
      opacity: overlayOpacity,
    },
  };
};

const stackScreenOptions = ({ route }) => {
  const direction = route.params?.transitionDirection;
  if (direction && FOOTER_ROUTES.includes(route.name)) {
    return {
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: "horizontal",
      cardStyleInterpolator: createDirectionalInterpolator(direction),
      transitionSpec: {
        open: transitionOpenSpec,
        close: transitionCloseSpec,
      },
    };
  }

  return {
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: "horizontal",
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  };
};

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

  const showDock = !["CameraCapture", "ProductMatching", "BeautyAnalysis"].includes(
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
          screenOptions={stackScreenOptions}
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
          <Stack.Screen name="BeautyAnalysis" component={BeautyAnalysisScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Products" component={ProductsScreen} />
        </Stack.Navigator>

        {showDock && (
          <FooterNavigation
            navigationRef={navigationRef}
            currentRoute={currentRoute}
          />
        )}
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
