import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../styles/theme';

export default function ProgressBar({ current, total, color = colors.primary }) {
    const percentage = total ? (current / total) * 100 : 0;

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <View
                    style={[
                        styles.fill,
                        {
                            width: `${Math.min(100, Math.max(0, percentage))}%`,
                            backgroundColor: color,
                        },
                    ]}
                />
            </View>
            <Text style={styles.text}>
                {current} / {total}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    bar: {
        height: 6,
        backgroundColor: colors.surfaceAlt,
        borderRadius: radius.sm,
        marginBottom: spacing.xs,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: radius.sm,
    },
    text: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'right',
    },
});
