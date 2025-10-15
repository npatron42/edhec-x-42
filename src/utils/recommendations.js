import { doveProducts } from '../data/products';

// Algorithme de recommandation basé sur les réponses du questionnaire
export const getRecommendedProducts = (answers) => {
  if (!answers || Object.keys(answers).length === 0) {
    return doveProducts;
  }

  const skinType = answers.step1;
  const environment = answers.step2;
  const preferredCategories = answers.step3 || [];
  const needs = answers.step4 || [];

  // Calculer un score de correspondance pour chaque produit
  const scoredProducts = doveProducts.map(product => {
    let score = 0;

    // Correspondance avec le type de peau (poids: 40%)
    if (product.skinTypes.includes(skinType)) {
      score += 40;
    }

    // Correspondance avec l'environnement (poids: 20%)
    if (product.environment.includes(environment)) {
      score += 20;
    }

    // Correspondance avec les catégories préférées (poids: 20%)
    if (preferredCategories.includes(product.category)) {
      score += 20;
    }

    // Correspondance avec les besoins (poids: 20%)
    const matchingNeeds = product.benefits.filter(benefit =>
      needs.some(need => benefit.toLowerCase().includes(need))
    );
    score += (matchingNeeds.length / Math.max(needs.length, 1)) * 20;

    return {
      ...product,
      matchScore: score,
    };
  });

  // Trier par score décroissant
  const sortedProducts = scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

  return sortedProducts;
};

// Générer des données pour le QR code
export const generateQRData = (userAnswers, selectedProducts) => {
  const data = {
    userId: generateUserId(),
    timestamp: new Date().toISOString(),
    profile: {
      skinType: userAnswers.step1,
      environment: userAnswers.step2,
      preferences: userAnswers.step3,
      needs: userAnswers.step4,
      frequency: userAnswers.step5,
    },
    products: selectedProducts.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
    })),
  };

  return JSON.stringify(data);
};

// Générer un ID utilisateur unique
const generateUserId = () => {
  return 'ECO-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Calculer l'impact environnemental d'une sélection de produits
export const calculateImpact = (products, frequency = 'monthly') => {
  const multipliers = {
    weekly: 4,
    biweekly: 2,
    monthly: 1,
  };

  const multiplier = multipliers[frequency] || 1;

  const totalCO2 = products.reduce((sum, product) => sum + (product.co2Saved || 0), 0) * multiplier;
  const totalPlastic = products.reduce((sum, product) => sum + (product.plasticSaved || 0), 0) * multiplier;
  const bottlesSaved = Math.floor(totalPlastic / 50); // 1 bouteille ≈ 50g

  return {
    co2SavedPerMonth: totalCO2,
    plasticSavedPerMonth: totalPlastic,
    bottlesSavedPerMonth: bottlesSaved,
    co2SavedPerYear: totalCO2 * 12,
    plasticSavedPerYear: totalPlastic * 12,
    bottlesSavedPerYear: bottlesSaved * 12,
  };
};

// Obtenir un message de match personnalisé
export const getMatchMessage = (matchScore) => {
  if (matchScore >= 80) {
    return {
      title: '🎉 Match Parfait !',
      message: 'Ce produit est idéal pour vos besoins',
      color: '#4CAF50',
    };
  } else if (matchScore >= 60) {
    return {
      title: '✨ Excellent Match',
      message: 'Ce produit correspond bien à votre profil',
      color: '#2196F3',
    };
  } else if (matchScore >= 40) {
    return {
      title: '👍 Bon Match',
      message: 'Ce produit pourrait vous convenir',
      color: '#FF9800',
    };
  } else {
    return {
      title: '🤔 À Essayer',
      message: 'Découvrez ce produit',
      color: '#9E9E9E',
    };
  }
};

// Formater les statistiques pour l'affichage
export const formatImpactStats = (stats) => {
  return {
    co2: {
      value: stats.co2Saved.toFixed(2),
      unit: 'kg',
      label: 'CO₂ évité',
      icon: '🌱',
      equivalence: `${(stats.co2Saved * 4).toFixed(0)} km en voiture`,
    },
    plastic: {
      value: (stats.plasticSaved / 1000).toFixed(2),
      unit: 'kg',
      label: 'Plastique économisé',
      icon: '♻️',
      equivalence: `${stats.bottlesSaved} bouteilles`,
    },
    refills: {
      value: stats.totalRefills,
      unit: '',
      label: 'Recharges effectuées',
      icon: '🔄',
      equivalence: '',
    },
  };
};
