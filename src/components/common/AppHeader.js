import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, radius, shadow } from '../../styles/theme';
import AppButton from './AppButton';
import { useTheme } from '../../styles/ThemeProvider';

export default function AppHeader({
    title,
    subtitle,
    onBack,
    rightComponent,
    containerStyle,
    titleStyle,
    subtitleStyle,
    // New: force compact header regardless of subtitle
    compact: forceCompact,
}) {
    const { colors } = useTheme();
    const autoCompact = !subtitle;
    const compact = forceCompact ?? autoCompact;
    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
                paddingVertical: compact ? spacing.sm : spacing.md,
                paddingHorizontal: spacing.lg,
            },
            shadow.soft,
            containerStyle,
        ]}>
            <View style={styles.titleRow}>
                {onBack ? (
                    <AppButton
                        variant="subtle"
                        icon={{ name: 'arrow-left', provider: 'MaterialCommunityIcons', size: 18 }}
                        onPress={onBack}
                        label=""
                        style={styles.backButtonCompact}
                    />
                ) : null}
                <View style={styles.texts}>
                    {title ? (
                        <Text style={[styles.title, { color: colors.textPrimary }, titleStyle]} numberOfLines={1}>
                            {title}
                        </Text>
                    ) : null}
                    {subtitle ? (
                        <Text style={[styles.subtitle, { color: colors.textMuted }, subtitleStyle]} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
            </View>

            {rightComponent ? <View style={styles.right}>{rightComponent}</View> : <View style={styles.right} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingHorizontal moved inline to allow compact tuning
        borderBottomWidth: 1,
    },
    titleRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
    },
    backButtonCompact: {
        width: 36,
        height: 36,
        borderRadius: radius.lg,
        paddingHorizontal: 0,
        marginRight: spacing.sm,
    },
    texts: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 12,
        marginTop: spacing.xs,
    },
    right: {
        minWidth: 32,
        minHeight: 32,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginLeft: spacing.md,
    },
});
