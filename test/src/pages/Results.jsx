import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const location = useLocation();
  const state = location.state;

  // Handle both {bmi,...} and {result:{...}}
  const data = state?.result ? state.result : state;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-900 text-white">
        <h2 className="text-xl">No results found. Please calculate first.</h2>
        <Link
          to="/calculator"
          className="mt-4 px-6 py-2 bg-purple-600 rounded-md hover:bg-purple-700"
        >
          Go Back
        </Link>
      </div>
    );
  }

  const { bmi, category, calories } = data;

  // BMI Progress Bar
  const bmiPercent = Math.min(bmi / 40, 1);
  const getBMIColor = () => {
    if (bmi < 18.5) return "#facc15"; // yellow
    if (bmi < 25) return "#22c55e"; // green
    if (bmi < 30) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  // Macro calculation
  const calculateMacros = (calories) => {
    return {
      carbs: Math.round((calories * 0.5) / 4), // 50% carbs
      protein: Math.round((calories * 0.3) / 4), // 30% protein
      fats: Math.round((calories * 0.2) / 9), // 20% fats
    };
  };

  // Recommendation + Goal
  let recommendation = "";
  let goal = "maintain"; // "loss" | "gain" | "maintain"

  if (bmi < 18.5) {
    recommendation = "You are underweight. Focus on gaining weight.";
    goal = "gain";
  } else if (bmi >= 25) {
    recommendation = "You are overweight. Focus on losing weight.";
    goal = "loss";
  } else {
    recommendation = "You are in a healthy range. Maintain your weight.";
    goal = "maintain";
  }

  // Calories for options
  const lossOptions = {
    mild: Math.round(calories.maintenance * 0.89),
    moderate: Math.round(calories.maintenance * 0.78),
    extreme: Math.round(calories.maintenance * 0.55),
  };

  const gainOptions = {
    mild: Math.round(calories.maintenance * 1.11),
    moderate: Math.round(calories.maintenance * 1.22),
    fast: Math.round(calories.maintenance * 1.45),
  };

  // Selected calorie target for macros
  const [selectedCalories, setSelectedCalories] = useState(calories.maintenance);

  const macros = calculateMacros(selectedCalories);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 my-7">
      <h1 className="text-4xl font-bold mb-6">
        Your <span className="text-yellow-400">Calorie</span> Results
      </h1>

      {/* BMI Gauge */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-lg text-center mb-8">
        <h2 className="text-xl font-semibold mb-4">BMI Analysis</h2>
        <Doughnut
          data={{
            datasets: [
              {
                data: [bmiPercent * 100, 100 - bmiPercent * 100],
                backgroundColor: [getBMIColor(), "#1f2937"],
                borderWidth: 0,
                circumference: 180,
                rotation: -90,
              },
            ],
          }}
          options={{
            cutout: "70%",
            plugins: { tooltip: { enabled: false }, legend: { display: false } },
          }}
        />
        <p className="mt-4 text-lg">
          BMI: <span className="text-yellow-400">{bmi}</span> ({category})
        </p>
        <p className="mt-2 text-md text-gray-300">{recommendation}</p>
      </div>

      {/* Maintenance Section */}
      <div className="bg-green-900/40 backdrop-blur-lg border border-green-400/30 rounded-xl p-6 w-full max-w-lg mb-6">
        <h2 className="text-2xl font-semibold text-green-400 mb-4">Maintenance</h2>
        <p className="flex justify-between">
          Maintain Weight <span className="font-bold">{calories.maintenance} cal/day</span>
        </p>
      </div>

      {/* Weight Loss Section (only if goal = loss) */}
      {goal === "loss" && (
        <div className="bg-red-900/40 backdrop-blur-lg border border-red-400/30 rounded-xl p-6 w-full max-w-lg mb-6">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Weight Loss Options</h2>
          <ul className="space-y-2">
            <li onClick={() => setSelectedCalories(lossOptions.mild)} className="flex justify-between cursor-pointer hover:text-red-200">
              Mild Loss (0.25kg/week) <span className="font-bold">{lossOptions.mild} cal/day</span>
            </li>
            <li onClick={() => setSelectedCalories(lossOptions.moderate)} className="flex justify-between cursor-pointer hover:text-red-200">
              Moderate Loss (0.5kg/week) <span className="font-bold">{lossOptions.moderate} cal/day</span>
            </li>
            <li onClick={() => setSelectedCalories(lossOptions.extreme)} className="flex justify-between cursor-pointer hover:text-red-200">
              Extreme Loss (1kg/week) <span className="font-bold">{lossOptions.extreme} cal/day</span>
            </li>
          </ul>
        </div>
      )}

      {/* Weight Gain Section (only if goal = gain) */}
      {goal === "gain" && (
        <div className="bg-blue-900/40 backdrop-blur-lg border border-blue-400/30 rounded-xl p-6 w-full max-w-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Weight Gain Options</h2>
          <ul className="space-y-2">
            <li onClick={() => setSelectedCalories(gainOptions.mild)} className="flex justify-between cursor-pointer hover:text-blue-200">
              Mild Gain (0.25kg/week) <span className="font-bold">{gainOptions.mild} cal/day</span>
            </li>
            <li onClick={() => setSelectedCalories(gainOptions.moderate)} className="flex justify-between cursor-pointer hover:text-blue-200">
              Moderate Gain (0.5kg/week) <span className="font-bold">{gainOptions.moderate} cal/day</span>
            </li>
            <li onClick={() => setSelectedCalories(gainOptions.fast)} className="flex justify-between cursor-pointer hover:text-blue-200">
              Fast Gain (1kg/week) <span className="font-bold">{gainOptions.fast} cal/day</span>
            </li>
          </ul>
        </div>
      )}

      {/* Macro Recommendation */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-lg mb-8">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4 text-center">
          Suggested Macros for Your Goal
        </h2>
        <p className="text-center text-sm text-gray-300 mb-3">
          Based on: <span className="text-white font-bold">{selectedCalories} cal/day</span>
        </p>
        <div className="space-y-2">
          <p className="flex justify-between">
            Carbs (50%) <span className="font-bold text-blue-300">{macros.carbs} g/day</span>
          </p>
          <p className="flex justify-between">
            Protein (30%) <span className="font-bold text-green-300">{macros.protein} g/day</span>
          </p>
          <p className="flex justify-between">
            Fats (20%) <span className="font-bold text-red-300">{macros.fats} g/day</span>
          </p>
        </div>
      </div>

      <Link
        to="/calculator"
        className="mt-6 px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700"
      >
        Back to Calculator
      </Link>
    </div>
  );
};

export default Results;
