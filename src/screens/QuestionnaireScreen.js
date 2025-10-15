import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { questionnaire } from '../data/products';
import { saveUserAnswers } from '../utils/storage';
import { colors, spacing, radius } from '../styles/theme';
import { AppButton, AppHeader, AppIcon } from '../components/common';
import ProgressBar from '../components/ProgressBar';

export default function QuestionnaireScreen({ navigation }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});

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

    return (
        <View style={styles.container}>
            <AppHeader
                title="Questionnaire"
                subtitle={`${currentStep + 1} / ${questionnaire.length}`}
                onBack={handleBack}
                containerStyle={styles.header}
            />

            <View style={styles.progressWrapper}>
                <ProgressBar
                    current={currentStep + 1}
                    total={questionnaire.length}
                />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator
            >
                <Text style={styles.question}>{currentQuestion.question}</Text>
                {currentQuestion.subtitle ? (
                    <Text style={styles.subtitle}>{currentQuestion.subtitle}</Text>
                ) : null}

                {currentQuestion.type === 'multiple' &&
                currentQuestion.maxSelections ? (
                    <Text style={styles.hint}>
                        Sélectionnez jusqu'à {currentQuestion.maxSelections} options
                    </Text>
                ) : null}

                <View style={styles.options}>
                    {currentQuestion.options.map((option) => {
                        const selected = isSelected(option.value);
                        const iconTint = selected ? colors.background : colors.primaryMuted;
                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionButton,
                                    selected ? styles.optionButtonSelected : null,
                                ]}
                                onPress={() => handleSelectOption(option.value)}
                                activeOpacity={0.8}
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
                                        size={28}
                                        color={iconTint}
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
                                        <Text style={styles.optionDescription}>
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
                                            size={16}
                                            color={colors.background}
                                        />
                                    ) : null}
                                </View>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: spacing.xxl,
        paddingBottom: spacing.lg,
    },
    progressWrapper: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceAlt,
    },
    content: {
        flex: 1,
        ...(Platform.OS === 'web' && {
            height: 'calc(100vh - 160px)',
            overflow: 'auto',
        }),
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl * 2,
        paddingTop: spacing.xl,
        ...(Platform.OS === 'web' && {
            minHeight: 'calc(100vh - 160px)',
        }),
    },
    question: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        marginBottom: spacing.md,
    },
    hint: {
        fontSize: 14,
        color: colors.primary,
        marginBottom: spacing.lg,
        fontStyle: 'italic',
    },
    options: {
        marginTop: spacing.sm,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionButtonSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    optionIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
    },
    optionIconSelected: {
        backgroundColor: colors.primaryDark,
    },
    optionContent: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    optionLabelSelected: {
        color: colors.background,
    },
    optionDescription: {
        fontSize: 14,
        color: colors.primaryPale,
        marginTop: spacing.xs,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    checkboxSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.background,
    },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceAlt,
        backgroundColor: colors.background,
    },
    nextButton: {
        borderColor: 'transparent',
    },
    nextButtonDisabled: {
        backgroundColor: colors.surfaceAlt,
    },
});
