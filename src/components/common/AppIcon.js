import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const iconSets = {
    Ionicons,
    MaterialCommunityIcons,
    Feather,
    Entypo,
    MaterialIcons,
};

export function AppIcon({ name, provider = 'Ionicons', size = 24, color = '#1C355B', style }) {
    const IconComponent = iconSets[provider];
    if (!IconComponent || !name) {
        return null;
    }
    return <IconComponent name={name} size={size} color={color} style={style} />;
}

export default AppIcon;
