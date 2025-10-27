import React, { useEffect, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ProductMatchingScreen from './src/screens/ProductMatchingScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import RefillMapScreen from './src/screens/RefillMapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SkinSummaryScreen from './src/screens/SkinSummaryScreen';
import BeautyAnalysisScreen from './src/screens/BeautyAnalysisScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import { AppIcon } from './src/components/common';
import { withTheme, spacing, radius, shadow } from './src/styles/theme';
import { ThemeProvider, useTheme } from './src/styles/ThemeProvider';

const Stack = createStackNavigator();
const navigationRef = createNavigationContainerRef();

// Charge un écran spécifique au web pour éviter l'import d'expo-camera côté web
const CameraCaptureScreen = Platform.select({
  web: require('./src/screens/CameraCaptureScreen.web').default,
  default: require('./src/screens/CameraCaptureScreen').default,
});

function AppInner() {
  const [currentRoute, setCurrentRoute] = useState('Dashboard');
  const { isDark, colors } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const html = document.documentElement;
      const body = document.body;
      const root = document.getElementById('root');

      const prev = {
        htmlHeight: html.style.height,
        bodyHeight: body.style.height,
        bodyOverflowY: body.style.overflowY,
        rootHeight: root?.style.height,
        rootOverflow: root?.style.overflowY,
      };

      html.style.height = '100%';
      body.style.height = '100%';
      body.style.overflowY = 'auto';
      if (root) {
        root.style.height = '100%';
        root.style.overflowY = 'auto';
      }

      return () => {
        html.style.height = prev.htmlHeight;
        body.style.height = prev.bodyHeight;
        body.style.overflowY = prev.bodyOverflowY || '';
        if (root) {
          root.style.height = prev.rootHeight || '';
          root.style.overflowY = prev.rootOverflow || '';
        }
      };
    }
  }, []);

  const showDock = !['RefillMap', 'CameraCapture', 'ProductMatching'].includes(currentRoute);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          const name = navigationRef.getCurrentRoute()?.name;
          if (name) setCurrentRoute(name);
        }}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
          initialRouteName="Dashboard"
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="BeautyAnalysis" component={BeautyAnalysisScreen} />
          <Stack.Screen name="ProductMatching" component={ProductMatchingScreen} />
          <Stack.Screen name="RefillMap" component={RefillMapScreen} />
          <Stack.Screen name="QRCode" component={QRCodeScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="SkinSummary" component={SkinSummaryScreen} />
          <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Products" component={ProductsScreen} />
        </Stack.Navigator>

        {showDock ? (
          <View pointerEvents="box-none" style={stylesDock.wrap}>
            <BlurView intensity={isDark ? 28 : 20} tint={isDark ? 'dark' : 'light'} style={[stylesDock.dock, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
              <View style={[stylesDock.neon, { shadowColor: isDark ? '#22D3EE66' : '#4F9CF966' }]} />
              <DockButton colors={colors} icon={{ provider: 'Ionicons', name: 'home' }} label="Accueil" onPress={() => navigationRef.navigate('Dashboard')} />
              <DockButton colors={colors} icon={{ provider: 'Ionicons', name: 'qr-code' }} label="Mon QR" onPress={() => navigationRef.navigate('QRCode', { answers: {}, selectedProducts: [] })} />
              <DockButton colors={colors} icon={{ provider: 'MaterialCommunityIcons', name: 'map-marker-radius' }} label="Bornes" onPress={() => navigationRef.navigate('RefillMap')} />
              <DockButton colors={colors} icon={{ provider: 'Ionicons', name: 'cube-outline' }} label="Produits" onPress={() => navigationRef.navigate('Products')} />
              <DockButton colors={colors} icon={{ provider: 'MaterialCommunityIcons', name: 'history' }} label="Historique" onPress={() => navigationRef.navigate('History')} />
            </BlurView>
          </View>
        ) : null}
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

function DockButton({ colors, icon, label, onPress }){
  return (
    <TouchableOpacity onPress={onPress} style={stylesDock.item} accessibilityRole="button" accessibilityLabel={label}>
      <AppIcon name={icon.name} provider={icon.provider} size={20} color={colors.textPrimary} />
      <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>{label}</Text>
    </TouchableOpacity>
  );
}

const stylesDock = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingBottom: spacing.md, pointerEvents: 'box-none' },
  dock: { position: 'relative', width: '92%', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.full, borderWidth: 1, ...shadow.soft },
  neon: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: radius.full, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 18 },
  item: { alignItems: 'center', justifyContent: 'center' },
});