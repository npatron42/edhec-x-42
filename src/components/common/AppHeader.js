import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../styles/theme';
import AppButton from './AppButton';

export default function AppHeader({
    title,
    subtitle,
    onBack,
    rightComponent,
    containerStyle,
    titleStyle,
    subtitleStyle,
}) {
    return (
        <View style={[styles.container, containerStyle]}>
            {onBack ? (
                <AppButton
                    variant="subtle"
                    icon={{ name: 'arrow-back', provider: 'Ionicons', size: 20 }}
                    onPress={onBack}
                    label=""
                    style={styles.backButton}
                />
            ) : (
                <View style={styles.placeholder} />
            )}

            <View style={styles.textWrapper}>
                {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
                {subtitle && (
                    <Text style={[styles.subtitle, subtitleStyle]}>
                        {subtitle}
                    </Text>
                )}
            </View>

            {rightComponent ? (
                <View style={styles.right}>{rightComponent}</View>
            ) : (
                <View style={styles.placeholder} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceAlt,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: radius.lg,
        paddingHorizontal: 0,
    },
    textWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: spacing.xs,
        textAlign: 'center',
    },
    right: {
        minWidth: 44,
        minHeight: 44,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    placeholder: {
        width: 44,
        height: 44,
    },
});
