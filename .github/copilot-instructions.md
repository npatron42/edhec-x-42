# Copilot Instructions - Eco-Refill AI Station

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React Native (Expo) application for Dove's Eco-Refill AI Station. The app helps users:
- Complete a personalized skin analysis questionnaire
- Receive AI-powered product recommendations (gamified Tinder-style matching)
- Generate QR codes for use at refill stations
- Track environmental impact (plastic bottles saved, CO₂ avoided)

## Tech Stack
- React Native with Expo
- React Navigation for routing
- AsyncStorage for local data persistence
- QR Code generation with react-native-qrcode-svg
- French language interface

## Key Features to Implement
1. **Questionnaire Flow**: Multi-step form collecting user data (skin type, environment, needs)
2. **Product Matching**: Swipe-based recommendation system with gamification
3. **QR Code Generation**: Unique code encoding user preferences and product selection
4. **Impact Dashboard**: Display plastic saved, CO₂ avoided, refill history
5. **User Profile**: Store preferences and usage statistics

## Coding Guidelines
- Use functional components with React Hooks
- Follow React Native best practices
- Use French for all UI text
- Implement responsive design for various screen sizes
- Use mock data for AI recommendations
- Focus on UX/UI with smooth animations
