#!/bin/bash

# Script pour démarrer l'émulateur Android avec la webcam du Mac
# Challenge Unilever 2025 - Vaseline Smart Refill Station

echo "🚀 Démarrage de l'émulateur Android avec webcam Mac..."
echo ""

# Nom de l'AVD (à adapter si besoin)
AVD_NAME="eco-refill-api34-arm64"

# Démarrer l'émulateur avec la webcam
# -camera-back webcam0 : Utilise la webcam pour la caméra arrière
# -camera-front webcam0 : Utilise la webcam pour la caméra frontale (selfie)
emulator -avd $AVD_NAME -camera-front webcam0 -camera-back webcam0 &

echo "✅ Émulateur démarré avec webcam Mac activée"
echo ""
echo "📱 L'émulateur va s'ouvrir dans quelques secondes..."
echo "📷 La caméra frontale utilisera votre webcam Mac"
echo ""
echo "💡 Conseils :"
echo "   - Autorisez l'accès à la caméra si demandé"
echo "   - Positionnez-vous face à la webcam pour le selfie"
echo "   - Bon éclairage recommandé pour l'analyse IA"
echo ""
