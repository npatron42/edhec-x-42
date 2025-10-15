export const colors = {
    primary: '#1C355B',
    primaryDark: '#0F2036',
    primaryMuted: '#3C5272',
    primarySoft: '#5D6F8A',
    primaryPale: '#7D8CA1',
    background: '#FFFFFF',
    surface: '#F4F6FA',
    surfaceAlt: '#E7ECF4',
    border: '#D3DAE6',
    textPrimary: '#1A1A1A',
    textSecondary: '#475569',
    textMuted: '#7D8CA1',
    success: '#2E7D32',
    warning: '#F59E0B',
    danger: '#D14343',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
};

export const radius = {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
};

export const shadow = {
    card: {
        shadowColor: '#0F203610',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    soft: {
        shadowColor: '#0F203608',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
};

export const typography = {
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.textSecondary,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    body: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.textSecondary,
    },
};
