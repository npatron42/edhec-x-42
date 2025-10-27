#!/bin/bash

echo "📍 Configuration GPS de l'émulateur Android"
echo "==========================================="
echo ""

# Vérifier si adb est disponible
if ! command -v adb &> /dev/null; then
    echo "❌ Erreur : adb n'est pas installé ou pas dans le PATH"
    echo "   Installez Android SDK Platform Tools"
    exit 1
fi

# Vérifier si un émulateur est connecté
DEVICES=$(adb devices | grep -v "List" | grep "device$" | wc -l)
if [ "$DEVICES" -eq 0 ]; then
    echo "❌ Aucun émulateur Android détecté"
    echo "   Lancez d'abord l'émulateur avec : npm run android"
    exit 1
fi

echo "✅ Émulateur Android détecté"
echo ""

# Menu de sélection de ville
echo "Sélectionnez une position GPS :"
echo "1) Nice, France (Côte d'Azur) - Par défaut"
echo "2) Paris, France (Tour Eiffel)"
echo "3) Marseille, France (Vieux Port)"
echo "4) Lyon, France (Place Bellecour)"
echo "5) Position personnalisée"
echo ""
read -p "Votre choix [1-5] (défaut: 1) : " choice

case $choice in
    2)
        CITY="Paris"
        LAT=48.8584
        LON=2.2945
        ;;
    3)
        CITY="Marseille"
        LAT=43.2965
        LON=5.3698
        ;;
    4)
        CITY="Lyon"
        LAT=45.7578
        LON=4.8320
        ;;
    5)
        echo ""
        read -p "Latitude (ex: 43.7102) : " LAT
        read -p "Longitude (ex: 7.2620) : " LON
        CITY="Position personnalisée"
        ;;
    *)
        CITY="Nice"
        LAT=43.7102
        LON=7.2620
        ;;
esac

echo ""
echo "📍 Configuration GPS : $CITY"
echo "   Latitude  : $LAT"
echo "   Longitude : $LON"
echo ""

# Envoyer la commande GPS à l'émulateur
adb emu geo fix $LON $LAT

if [ $? -eq 0 ]; then
    echo "✅ Position GPS définie avec succès !"
    echo ""
    echo "🎯 Prochaines étapes :"
    echo "   1. Ouvrez l'app Vaseline Smart Refill"
    echo "   2. Allez sur l'écran 'Bornes de Recharge'"
    echo "   3. Autorisez l'accès à la localisation"
    echo "   4. La carte devrait se centrer sur $CITY"
    echo ""
else
    echo "❌ Erreur lors de la configuration GPS"
    echo "   Vérifiez que l'émulateur est bien lancé"
fi
