export const colors = {
    // Light theme (Vaseline brand)
    primary: '#0B1D4D',        // Deep Navy (header Vaseline)
    primaryDark: '#00153D',    // Darker Navy
    primaryLight: '#2C5FB8',   // Royal Blue
    primarySoft: 'rgba(11,29,77,0.12)',

    // Accent: bleu clair du dégradé
    accent: '#2C5FB8',
    accentDark: '#1E56A0',
    accentLight: '#A9C5FF',

    // Doré (barres/accents)
    brandGold: '#E6C067',
    brandGoldDark: '#C89A2B',
    brandGoldSoft: 'rgba(230,192,103,0.20)',

    background: '#F7FAFF',
    backgroundAlt: '#EFF4FF',
    // Glass surfaces
    surface: 'rgba(255,255,255,0.70)',
    surfaceElevated: 'rgba(255,255,255,0.82)',
    surfaceAlt: 'rgba(255,255,255,0.65)',
    border: 'rgba(15,23,42,0.08)',
    borderLight: 'rgba(255,255,255,0.85)',
    // Text on vibrant/primary backgrounds (gradients, badges)
    onPrimaryText: '#FFFFFF',
    onPrimaryTextSoft: 'rgba(255,255,255,0.9)',

    textPrimary: '#0F172A',
    textSecondary: 'rgba(15,23,42,0.65)',
    textMuted: 'rgba(15,23,42,0.45)',
    textInverse: '#0B1220',

    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',

    // Dégradé Vaseline
    gradientStart: '#0B1D4D',
    gradientEnd: '#2C5FB8',
};

export const darkColors = {
    // Dark theme (Vaseline) + glass
    primary: '#2C5FB8',
    primaryDark: '#1E56A0',
    primaryLight: '#5F8FE0',
    primarySoft: 'rgba(44,95,184,0.12)',

    accent: '#82A6FF',
    accentDark: '#5E86FF',
    accentLight: '#BBD0FF',

    // Doré en sombre
    brandGold: '#F0D27A',
    brandGoldDark: '#D1AA3A',
    brandGoldSoft: 'rgba(240,210,122,0.22)',

    background: '#0E1526',
    backgroundAlt: '#121B33',
    // Glass surfaces
    surface: 'rgba(255,255,255,0.06)',
    surfaceElevated: 'rgba(255,255,255,0.10)',
    surfaceAlt: 'rgba(255,255,255,0.12)',
    border: 'rgba(255,255,255,0.12)',
    borderLight: 'rgba(255,255,255,0.08)',
    // Text on vibrant/primary backgrounds (gradients, badges)
    onPrimaryText: '#FFFFFF',
    onPrimaryTextSoft: 'rgba(255,255,255,0.92)',

    textPrimary: '#E5E7EB',
    textSecondary: 'rgba(229,231,235,0.7)',
    textMuted: 'rgba(229,231,235,0.5)',
    textInverse: '#0B1220',

    success: '#10B981',
    warning: '#F59E0B',
    danger: '#F87171',
    info: '#60A5FA',

    gradientStart: '#00153D',
    gradientEnd: '#2C5FB8',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
};

export const radius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
};

export const typography = {
    // Headings
    h1: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 36,
        letterSpacing: -0.3,
    },
    h3: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 32,
    },
    h4: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
    },
    // Body
    bodyLarge: {
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },
    // Labels
    label: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
    },
    labelSmall: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
        letterSpacing: 0.5,
    },
    // Caption
    caption: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
    },
};

// Convertit des valeurs d'ombres RN en boxShadow Web
const toBoxShadow = (color, offset, radius, elevation = 0) => {
    const { width, height } = offset || { width: 0, height: 0 };
    const blur = Math.max(1, Math.floor(radius));
    const spread = Math.max(0, Math.floor(elevation / 2));
    return `${width}px ${height}px ${blur}px ${spread}px ${color}`;
};

export const shadow = {
    card: {
        shadowColor: '#00000040',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 8,
    },
    soft: {
        // Subtle brand-colored glow (blue)
        shadowColor: '#2C5FB880',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 6,
    },
    strong: {
        // Mélange léger bleu/doré
        shadowColor: '#E6C06766',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
        elevation: 12,
    },
};

export const withTheme = (isDark) => (isDark ? darkColors : colors);
