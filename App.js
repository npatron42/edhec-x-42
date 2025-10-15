import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import QuestionnaireScreen from './src/screens/QuestionnaireScreen';
import ProductMatchingScreen from './src/screens/ProductMatchingScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import RefillMapScreen from './src/screens/RefillMapScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
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

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
        initialRouteName="Auth"
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
        <Stack.Screen name="ProductMatching" component={ProductMatchingScreen} />
        <Stack.Screen name="RefillMap" component={RefillMapScreen} />
        <Stack.Screen name="QRCode" component={QRCodeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
