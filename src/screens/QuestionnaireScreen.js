import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { questionnaire } from "../data/products";
import { saveUserAnswers } from "../utils/storage";

export default function QuestionnaireScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [progress] = useState(new Animated.Value(0));

  const currentQuestion = questionnaire[currentStep];
  const isLastStep = currentStep === questionnaire.length - 1;
  const canProceed = answers[currentQuestion.id] !== undefined;

  const handleSelectOption = (value) => {
    const questionId = currentQuestion.id;

    if (currentQuestion.type === "multiple") {
      const currentAnswers = answers[questionId] || [];
      const maxSelections = currentQuestion.maxSelections || 999;

      if (currentAnswers.includes(value)) {
        // Désélectionner
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter((v) => v !== value),
        });
      } else if (currentAnswers.length < maxSelections) {
        // Sélectionner
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, value],
        });
      }
    } else {
      // Single selection
      setAnswers({
        ...answers,
        [questionId]: value,
      });
    }
  };

  const isSelected = (value) => {
    const questionId = currentQuestion.id;
    if (currentQuestion.type === "multiple") {
      return (answers[questionId] || []).includes(value);
    }
    return answers[questionId] === value;
  };

  const handleNext = () => {
    if (!canProceed) return;

    if (isLastStep) {
      // Sauvegarder et naviguer vers les recommandations
      saveUserAnswers(answers);
      navigation.navigate("ProductMatching", { answers });
    } else {
      setCurrentStep(currentStep + 1);
      Animated.timing(progress, {
        toValue: ((currentStep + 1) / questionnaire.length) * 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      Animated.timing(progress, {
        toValue: ((currentStep - 1) / questionnaire.length) * 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      navigation.goBack();
    }
  };

  const progressPercent = ((currentStep + 1) / questionnaire.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header avec progression */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} / {questionnaire.length}
          </Text>
        </View>
      </View>

      {/* Contenu de la question */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {currentQuestion.subtitle && (
          <Text style={styles.subtitle}>{currentQuestion.subtitle}</Text>
        )}

        {currentQuestion.type === "multiple" &&
          currentQuestion.maxSelections && (
            <Text style={styles.hint}>
              Sélectionnez jusqu'à {currentQuestion.maxSelections} options
            </Text>
          )}

        <View style={styles.options}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected(option.value) && styles.optionButtonSelected,
              ]}
              onPress={() => handleSelectOption(option.value)}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected(option.value) && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {option.description && (
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.checkbox,
                  isSelected(option.value) && styles.checkboxSelected,
                ]}
              >
                {isSelected(option.value) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bouton suivant */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed}
        >
          <Text style={styles.nextButtonText}>
            {isLastStep ? "Voir mes recommandations" : "Suivant"}
          </Text>
          <Text style={styles.nextButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#1c355b",
  },
  backButton: {
    padding: 10,
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 28,
    color: "#1c355b",
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1c355b",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  content: {
    flex: 1,
    ...(Platform.OS === "web" && {
      height: "calc(100vh - 120px)", // Full height minus header
      overflow: "auto",
    }),
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100, // Extra padding at bottom
    ...(Platform.OS === "web" && {
      minHeight: "calc(100vh - 120px)",
    }),
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 10,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  hint: {
    fontSize: 14,
    color: "#1c355b",
    marginBottom: 20,
    fontStyle: "italic",
  },
  options: {
    marginTop: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionButtonSelected: {
    // A smooth linear-gradient effect between two close #1c355b variations for visual depth.
    // React Native StyleSheet doesn't natively support gradients, but we can indicate the gradient intent here.
    // Actual gradient must be implemented with a LinearGradient component for full effect!
    backgroundColor: "transparent", // fallback for non-gradient environments
    borderColor: "#1c355b",
    // For demonstration, here's how you might indicate the gradient in StyleSheet:
    // Use react-native-linear-gradient in the component render for real effect.
    // Example usage (in component):
    // <LinearGradient
    //   colors={["#243e6b", "#1c355b"]}
    //   start={{ x: 0, y: 0 }}
    //   end={{ x: 1, y: 1 }}
    //   style={styles.optionButton}
    // >
    //   ...contents...
    // </LinearGradient>
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  optionLabelSelected: {
    color: "#1c355b",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#1c355b",
    borderColor: "#1c355b",
  },
  checkmark: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  nextButton: {
    backgroundColor: "#1c355b",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
  },
  nextButtonDisabled: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  nextButtonIcon: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
