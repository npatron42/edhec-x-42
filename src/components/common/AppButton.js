import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { spacing, radius, shadow } from '../../styles/theme';
import AppIcon from './AppIcon';
import { useTheme } from '../../styles/ThemeProvider';

export default function AppButton({
    label,
    onPress,
    icon,
    iconProvider = 'Ionicons',
    variant = 'primary',
    disabled = false,
    style,
    contentStyle,
    textStyle,
}) {
    const { colors } = useTheme();

    const VARIANT_STYLES = {
        primary: {
            container: {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
            },
            text: {
                color: colors.background,
            },
            iconColor: colors.background,
        },
        outline: {
            container: {
                backgroundColor: 'transparent',
                borderColor: colors.primary,
            },
            text: {
                color: colors.primary,
            },
            iconColor: colors.primary,
        },
        subtle: {
            container: {
                backgroundColor: colors.surface,
                borderColor: colors.border,
            },
            text: {
                color: colors.textPrimary,
            },
            iconColor: colors.primary,
        },
    };

    const variantStyles = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
    const showIcon = Boolean(icon?.name);
    const iconColor = icon?.color || variantStyles.iconColor;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.base,
                variantStyles.container,
                shadow.soft,
                { opacity: pressed && !disabled ? 0.9 : 1 },
                disabled && styles.disabled,
                style,
            ]}
        >
            <View style={[styles.content, contentStyle]}>
                {showIcon && (
                    <AppIcon
                        name={icon.name}
                        provider={icon.provider || iconProvider}
                        size={icon.size || 20}
                        color={iconColor}
                        style={label ? styles.icon : styles.iconOnly}
                    />
                )}
                {label ? (
                    <Text
                        style={[
                            styles.label,
                            variantStyles.text,
                            showIcon ? styles.labelWithIcon : null,
                            textStyle,
                        ]}
                    >
                        {label}
                    </Text>
                ) : null}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        borderWidth: 1,
        borderRadius: radius.lg,
        paddingVertical: spacing.md + spacing.xs,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    icon: {
        marginRight: spacing.xs,
    },
    iconOnly: {
        marginRight: 0,
    },
    labelWithIcon: {
        marginLeft: spacing.xs,
    },
    disabled: {
        opacity: 0.45,
    },
});
