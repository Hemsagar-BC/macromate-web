
// constants/index.js

export const featuresData = {
  subtitle: "Powerful tools to track, analyze, and optimize your nutrition",
  points: [
    {
      icon: "🎯",
      title: "Precise BMI Tracking",
      description: "Calculate your Body Mass Index and get personalized health insights"
    },
    {
      icon: "🔥",
      title: "Smart Calorie Planning",
      description: "Get customized calorie goals for weight loss, maintenance, or muscle gain"
    },
    {
      icon: "⚖️",
      title: "Macro Distribution",
      description: "Perfect protein, carbs, and fat ratios tailored to your fitness goals"
    },
    {
      icon: "📱",
      title: "AI Food Recognition",
      description: "Snap a photo of any meal and instantly get detailed nutritional breakdown"
    },
    {
      icon: "🔍",
      title: "Food Database Search",
      description: "Access comprehensive nutrition data of cooked foods, vegetables and fruits"
    },
    {
      icon: "💪",
      title: "Body Fat Predictor",
      description: "Science-based ML model predicts your body fat percentage with high accuracy"
    }
  ]
};

export const discoverData = {
  subtitle: "Learn the fundamentals of healthy eating and nutrition science",
  sections: [
    {
      id: "calories",
      title: "What are Calories?",
      content: "Calories are like tiny bits of energy your body gets from food to help you run, play, and grow strong! 🌟",
      icon: "🔥",
      details: [
        "1 calorie = 4.184 joules of energy",
        "Your body burns calories even at rest (BMR)",
        "Different activities burn different amounts of calories",
        "Weight management = Calories in vs Calories out"
      ]
    },
    {
      id: "macros",
      title: "Understanding Macronutrients",
      content: "Macros are the three main nutrients your body needs in large amounts: proteins, carbohydrates, and fats.",
      icon: "⚖️",
      details: [
        "Proteins: 4 calories per gram - builds and repairs tissues",
        "Carbohydrates: 4 calories per gram - primary energy source",
        "Fats: 9 calories per gram - essential for hormone production",
        "Each macro plays a unique role in your health"
      ]
    },
    {
      id: "bmi",
      title: "Body Mass Index (BMI)",
      content: "BMI is a screening tool that indicates whether you're at a healthy weight for your height.",
      icon: "📊",
      details: [
        "BMI = weight(kg) / height(m)²",
        "Underweight: BMI < 18.5",
        "Normal weight: BMI 18.5-24.9",
        "Overweight: BMI 25-29.9",
        "Obesity: BMI ≥ 30"
      ]
    },
    {
      id: "tdee",
      title: "Total Daily Energy Expenditure",
      content: "TDEE is the total number of calories you burn in a day, including exercise and daily activities.",
      icon: "⚡",
      details: [
        "BMR: Calories burned at rest",
        "TEF: Thermic effect of food",
        "NEAT: Non-exercise activity thermogenesis",
        "EAT: Exercise activity thermogenesis"
      ]
    }
  ]
};

// Navigation items
export const navItems = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "Discover", href: "#discover" }
];

// Calculate page cards
export const calculateCards = [
  {
    id: "bmi",
    title: "Progress Dashboard",
    description: "Track your weight, body fat percentage, and view your progress over time with interactive charts",
    icon: "📊",
    color: "from-orange-400 to-orange-600",
    features: [  // Change these
    'Weight & Body Fat Tracking',
    'Interactive Progress Charts',
    'Quick Stats Overview'
  ]
  },
  {
    id: "calories",
    title: "Calorie Calculator",
    description: "Get personalized daily calorie goals for your fitness journey",
    icon: "🔥",
    color: "from-orange-500 to-red-500",
    features: ["TDEE Calculation", "Goal-based Planning", "Macro Breakdown"]
  },
  {
    id: "bodyfat",  // CHANGED FROM "macros"
    title: "Body Fat Predictor",  // CHANGED
    description: "Predict your body fat percentage using AI-powered analysis",  // CHANGED
    icon: "💪",  // CHANGED
    color: "from-orange-300 to-orange-500",
    features: ["AI Prediction Model", "Body Composition", "Health Assessment"]  // CHANGED
  
  }
];

// Food page cards
export const foodCards = [
  {
    id: "search",
    title: "Food Search",
    description: "Search our extensive database for nutrition information",
    icon: "🔍",
    color: "from-orange-400 to-orange-600",
    features: ["10,000+ Foods", "Detailed Macros", "Portion Control"]
  },
  {
    id: "upload",
    title: "Photo Analysis",
    description: "Upload food photos and get instant nutritional analysis",
    icon: "📱",
    color: "from-orange-500 to-red-500",
    features: ["AI Recognition", "Instant Results", "Portion Estimation"]
  },
  {
    id: "foodlog",
    title: "Daily Food Log",
    description: "Track your daily meals and monitor your nutrition goals with our comprehensive food logging system",
    icon: "📝",
    color: "from-orange-300 to-orange-500",
    features: ["Track all meals & snacks",
      "Real-time macro tracking",
      "Daily nutrition summary",
  ]
    
  }
];

export default {
  featuresData,
  discoverData,
  navItems,
  calculateCards,
  foodCards
};