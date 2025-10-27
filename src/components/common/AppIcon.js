import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../../styles/ThemeProvider';

const iconSets = {
    Ionicons,
    MaterialCommunityIcons,
    Feather,
    Entypo,
    MaterialIcons,
};

export function AppIcon({ name, provider = 'Ionicons', size = 24, color, style }) {
    const { colors } = useTheme();
    const IconComponent = iconSets[provider];
    if (!IconComponent || !name) {
        return null;
    }
    return <IconComponent name={name} size={size} color={color || colors.textPrimary} style={style} />;
}

export default AppIcon;
