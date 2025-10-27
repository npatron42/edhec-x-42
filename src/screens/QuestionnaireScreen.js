import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActionSheetIOS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { questionnaire } from '../data/products';
import { saveUserAnswers } from '../utils/storage';
import { spacing, radius, typography, shadow } from '../styles/theme';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import ProgressBar from '../components/ProgressBar';
import { analyzeFaceFromBase64 } from '../utils/faceAnalysis';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../styles/ThemeProvider';

export default function QuestionnaireScreen({ navigation, route }) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [busy, setBusy] = useState(false);

    // Bannière: ce questionnaire va être remplacé par l'analyse photo
    const DeprecatedBanner = () => (
      <View style={styles.deprecatedBanner}>
        <AppIcon provider="Feather" name="camera" size={18} color={colors.primary} />
        <Text style={styles.deprecatedText}>Nouveau: utilisez l'analyse photo IA pour des recommandations instantanées.</Text>
        <AppButton label="Analyser ma photo" variant="outline" onPress={() => navigation.replace('CameraCapture')} style={{ marginLeft: 'auto' }} />
      </View>
    );

    // Si on revient de la caméra avec une image capturée, lancer l'analyse existante -> SkinSummary
    useEffect(() => {
        const base64 = route?.params?.capturedBase64;
        if (!base64) return;
        let cancelled = false;
        (async () => {
            try {
                const analysis = await analyzeFaceFromBase64(base64);
                if (cancelled) return;
                const autoAnswers = {
                    step1: analysis.skinType,
                    step2: 'moyenne',
                    step3: ['shampoing', 'gel-douche'],
                    step4: analysis.needs,
                    step5: 'monthly',
                };
                await saveUserAnswers(autoAnswers);
                navigation.navigate('SkinSummary', { analysis, answers: autoAnswers, photoBase64: base64 });
            } catch (e) {
                // noop
            }
        })();
        return () => { cancelled = true; };
    }, [route?.params?.capturedBase64]);

    const currentQuestion = questionnaire[currentStep];
    const isLastStep = currentStep === questionnaire.length - 1;
    const canProceed = useMemo(() => {
        return answers[currentQuestion.id] !== undefined;
    }, [answers, currentQuestion.id]);

    const handleSelectOption = (value) => {
        const questionId = currentQuestion.id;
        if (currentQuestion.type === 'multiple') {
            const currentAnswers = answers[questionId] || [];
            const maxSelections = currentQuestion.maxSelections || 999;
            if (currentAnswers.includes(value)) {
                setAnswers({
                    ...answers,
                    [questionId]: currentAnswers.filter((item) => item !== value),
                });
            } else if (currentAnswers.length < maxSelections) {
                setAnswers({
                    ...answers,
                    [questionId]: [...currentAnswers, value],
                });
            }
        } else {
            setAnswers({
                ...answers,
                [questionId]: value,
            });
        }
    };

    const isSelected = (value) => {
        const questionId = currentQuestion.id;
        if (currentQuestion.type === 'multiple') {
            return (answers[questionId] || []).includes(value);
        }
        return answers[questionId] === value;
    };

    const handleNext = () => {
        if (!canProceed) {
            return;
        }
        if (isLastStep) {
            saveUserAnswers(answers);
            navigation.navigate('ProductMatching', { answers });
            return;
        }
        setCurrentStep((prev) => Math.min(questionnaire.length - 1, prev + 1));
    };

    const handleBack = () => {
        if (currentStep === 0) {
            navigation.goBack();
            return;
        }
        setCurrentStep((prev) => Math.max(0, prev - 1));
    };

    const handleAutoAnalyze = async () => {
        try {
            setBusy(true);
            const pickFromLibrary = async () => {
                const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (libPerm.status !== 'granted') return;
                const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true, quality: 0.7 });
                if (res.canceled) return;
                const base64 = res.assets?.[0]?.base64;
                if (!base64) return;
                navigation.replace('BeautyAnalysis', { base64 });
            };
            if (Platform.OS === 'ios') {
                await new Promise((resolve) => {
                    ActionSheetIOS.showActionSheetWithOptions(
                        {
                            options: ['Annuler', 'Prendre une photo', 'Choisir dans la galerie'],
                            cancelButtonIndex: 0,
                            userInterfaceStyle: 'light',
                        },
                        async (buttonIndex) => {
                            if (buttonIndex === 1) navigation.replace('CameraCapture');
                            if (buttonIndex === 2) await pickFromLibrary();
                            resolve();
                        }
                    );
                });
            } else {
                navigation.replace('CameraCapture');
            }
        } catch (e) {
            // noop
        } finally {
            setBusy(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <AppHeader
                    title="Questionnaire (bientôt remplacé)"
                    subtitle={`${currentStep + 1} / ${questionnaire.length}`}
                    onBack={handleBack}
                    containerStyle={styles.header}
                    compact
                />

            <DeprecatedBanner />

            <View style={styles.progressWrapper}>
                <ProgressBar
                    current={currentStep + 1}
                    total={questionnaire.length}
                />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* AI Analysis Card */}
                <View style={styles.aiCard}>
                    <LinearGradient
                        colors={[colors.primaryLight, colors.accentLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.aiGradient}
                    >
                        <View style={styles.aiHeader}>
                            <View style={styles.aiIconWrapper}>
                                <AppIcon
                                    name="sparkles"
                                    provider="Ionicons"
                                    size={20}
                                    color={colors.primary}
                                />
                            </View>
                            <Text style={styles.aiTitle}>Analyse IA Express</Text>
                        </View>
                        <Text style={styles.aiDescription}>
                            Scannez votre visage pour une analyse instantanée et des réponses pré-remplies
                        </Text>
                        <AppButton
                            label={busy ? 'Analyse en cours...' : 'Lancer l\'analyse'}
                            onPress={handleAutoAnalyze}
                            disabled={busy}
                            style={styles.aiButton}
                            icon={{ name: 'camera', provider: 'Ionicons', size: 18 }}
                            variant="outline"
                        />
                    </LinearGradient>
                </View>

                {/* Question Section */}
                <View style={styles.questionSection}>
                    <Text style={styles.question}>{currentQuestion.question}</Text>
                    {currentQuestion.subtitle ? (
                        <Text style={styles.subtitle}>{currentQuestion.subtitle}</Text>
                    ) : null}
                    
                    {currentQuestion.type === 'multiple' &&
                    currentQuestion.maxSelections ? (
                        <View style={styles.hintBadge}>
                            <AppIcon
                                name="information-circle"
                                provider="Ionicons"
                                size={16}
                                color={colors.primary}
                            />
                            <Text style={styles.hint}>
                                Sélectionnez jusqu'à {currentQuestion.maxSelections} options
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* Options */}
                <View style={styles.options}>
                    {currentQuestion.options.map((option) => {
                        const selected = isSelected(option.value);
                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionButton,
                                    selected ? styles.optionButtonSelected : null,
                                ]}
                                onPress={() => handleSelectOption(option.value)}
                                activeOpacity={0.7}
                            >
                                <LinearGradient
                                    colors={
                                        selected
                                            ? [colors.primary, colors.primaryLight]
                                            : [colors.surface, colors.surface]
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.optionGradient}
                                >
                                    <View
                                        style={[
                                            styles.optionIcon,
                                            selected ? styles.optionIconSelected : null,
                                        ]}
                                    >
                                        <AppIcon
                                            name={option.icon?.name}
                                            provider={option.icon?.provider}
                                            size={26}
                                            color={selected ? colors.background : colors.primary}
                                        />
                                    </View>
                                    <View style={styles.optionContent}>
                                        <Text
                                            style={[
                                                styles.optionLabel,
                                                selected ? styles.optionLabelSelected : null,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                        {option.description ? (
                                            <Text
                                                style={[
                                                    styles.optionDescription,
                                                    selected ? styles.optionDescriptionSelected : null,
                                                ]}
                                            >
                                                {option.description}
                                            </Text>
                                        ) : null}
                                    </View>
                                    <View
                                        style={[
                                            styles.checkbox,
                                            selected ? styles.checkboxSelected : null,
                                        ]}
                                    >
                                        {selected ? (
                                            <AppIcon
                                                name="checkmark"
                                                provider="Ionicons"
                                                size={18}
                                                color={colors.background}
                                            />
                                        ) : null}
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <AppButton
                    onPress={handleNext}
                    label={isLastStep ? 'Voir mes recommandations' : 'Suivant'}
                    icon={{ name: 'arrow-forward', provider: 'Ionicons', size: 20 }}
                    disabled={!canProceed}
                    style={[
                        styles.nextButton,
                        !canProceed ? styles.nextButtonDisabled : null,
                    ]}
                />
            </View>
        </View>
        </SafeAreaView>
    );
}

const getStyles = (c) => StyleSheet.create({
    deprecatedBanner: {
        marginHorizontal: spacing.xl,
        marginBottom: spacing.md,
        padding: spacing.md,
        backgroundColor: c.background,
        borderRadius: radius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        ...shadow.sm,
    },
    deprecatedText: { ...typography.caption, color: c.textSecondary, flex: 1 },
    safeArea: {
        flex: 1,
        backgroundColor: c.background,
    },
    container: {
        flex: 1,
        backgroundColor: c.background,
    },
    header: {
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    progressWrapper: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: c.background,
        borderBottomWidth: 1,
        borderBottomColor: c.surfaceAlt,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl * 2,
        paddingTop: spacing.xl,
    },
    aiCard: {
        marginBottom: spacing.xl,
        borderRadius: radius.xl,
        overflow: 'hidden',
        ...shadow.md,
    },
    aiGradient: { padding: spacing.lg },
    aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
    aiIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: radius.full,
        backgroundColor: c.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
        ...shadow.sm,
    },
    aiTitle: { ...typography.h4, color: c.textPrimary },
    aiDescription: { ...typography.body, color: c.textSecondary, marginBottom: spacing.md, lineHeight: 20 },
    aiButton: { alignSelf: 'flex-start', backgroundColor: c.background },
    questionSection: { marginBottom: spacing.lg },
    question: { ...typography.h2, color: c.textPrimary, marginBottom: spacing.sm, lineHeight: 32 },
    subtitle: { ...typography.body, color: c.textSecondary, marginBottom: spacing.md },
    hintBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: c.primaryLight,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        alignSelf: 'flex-start',
        gap: spacing.xs,
    },
    hint: { ...typography.caption, color: c.primary, fontWeight: '600' },
    options: { marginTop: spacing.sm },
    optionButton: { marginBottom: spacing.md, borderRadius: radius.xl, overflow: 'hidden', ...shadow.sm },
    optionGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
    optionButtonSelected: { ...shadow.md },
    optionIcon: {
        width: 52,
        height: 52,
        borderRadius: radius.lg,
        backgroundColor: c.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    optionIconSelected: { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
    optionContent: { flex: 1 },
    optionLabel: { ...typography.h4, color: c.textPrimary },
    optionLabelSelected: { color: c.background },
    optionDescription: { ...typography.body, color: c.textSecondary, marginTop: spacing.xs },
    optionDescriptionSelected: { color: c.background, opacity: 0.9 },
    checkbox: {
        width: 32,
        height: 32,
        borderRadius: radius.full,
        borderWidth: 2,
        borderColor: c.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.background,
    },
    checkboxSelected: { backgroundColor: 'rgba(255, 255, 255, 0.3)', borderColor: c.background },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: c.surfaceAlt,
        backgroundColor: c.background,
    },
    nextButton: { ...shadow.md },
    nextButtonDisabled: { backgroundColor: c.surfaceAlt },
});
