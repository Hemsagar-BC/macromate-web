import pandas as pd
import os

def create_sample_data():
    """Create sample CSV files for the fitness chatbot"""
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # 1. EXERCISES.CSV
    exercises_data = {
        'name': [
            'Push-ups', 'Squats', 'Lunges', 'Plank', 'Burpees',
            'Pull-ups', 'Deadlift', 'Bench Press', 'Barbell Row', 'Shoulder Press',
            'Bicycle Crunches', 'Mountain Climbers', 'Jumping Jacks', 'Russian Twists', 'Leg Raises',
            'Dumbbell Curls', 'Tricep Dips', 'Lat Pulldown', 'Leg Press', 'Calf Raises',
            'Box Jumps', 'Kettlebell Swings', 'Battle Ropes', 'Wall Sits', 'Farmer Walks'
        ],
        'category': [
            'Chest', 'Legs', 'Legs', 'Core', 'Full Body',
            'Back', 'Legs', 'Chest', 'Back', 'Shoulders',
            'Core', 'Core', 'Cardio', 'Core', 'Core',
            'Arms', 'Arms', 'Back', 'Legs', 'Legs',
            'Legs', 'Full Body', 'Cardio', 'Legs', 'Full Body'
        ],
        'difficulty': [
            'Beginner', 'Beginner', 'Beginner', 'Beginner', 'Intermediate',
            'Advanced', 'Intermediate', 'Intermediate', 'Intermediate', 'Intermediate',
            'Beginner', 'Intermediate', 'Beginner', 'Intermediate', 'Intermediate',
            'Beginner', 'Beginner', 'Intermediate', 'Beginner', 'Beginner',
            'Intermediate', 'Intermediate', 'Advanced', 'Beginner', 'Intermediate'
        ],
        'equipment': [
            'None', 'None', 'None', 'None', 'None',
            'Pull-up Bar', 'Barbell', 'Barbell', 'Barbell', 'Barbell',
            'None', 'None', 'None', 'None', 'None',
            'Dumbbells', 'Bench', 'Cable Machine', 'Leg Press Machine', 'None',
            'Box', 'Kettlebell', 'Battle Ropes', 'None', 'Dumbbells'
        ],
        'description': [
            'Classic bodyweight exercise for chest, shoulders, and triceps',
            'Compound leg exercise targeting quads, glutes, and hamstrings',
            'Single-leg exercise for leg strength and balance',
            'Isometric core exercise for abs and lower back',
            'Full body cardio exercise combining squat, push-up, and jump',
            'Upper body pulling exercise for back and biceps',
            'Compound exercise for posterior chain - glutes, hamstrings, back',
            'Primary chest building exercise with barbell',
            'Back thickness exercise targeting lats and rhomboids',
            'Overhead pressing for shoulder development',
            'Core exercise targeting obliques and abs',
            'Dynamic core and cardio exercise',
            'Simple cardio warm-up exercise',
            'Rotational core exercise for obliques',
            'Lower ab targeting exercise',
            'Isolation exercise for bicep development',
            'Bodyweight tricep exercise',
            'Back width exercise using cable machine',
            'Machine-based leg builder',
            'Calf muscle isolation exercise',
            'Explosive leg power exercise',
            'Dynamic full body power exercise',
            'High intensity cardio and shoulder workout',
            'Isometric quad builder',
            'Grip and full body strength exercise'
        ],
        'calories_per_30min': [
            135, 180, 165, 90, 300,
            210, 225, 195, 180, 165,
            150, 240, 165, 135, 120,
            90, 105, 150, 195, 75,
            270, 300, 315, 120, 180
        ],
        'primary_muscles': [
            'Chest, Triceps', 'Quadriceps, Glutes', 'Quadriceps, Glutes', 'Core', 'Full Body',
            'Lats, Biceps', 'Hamstrings, Glutes, Lower Back', 'Chest, Triceps', 'Lats, Rhomboids', 'Shoulders',
            'Abs, Obliques', 'Core, Shoulders', 'Full Body', 'Obliques', 'Lower Abs',
            'Biceps', 'Triceps', 'Lats', 'Quadriceps', 'Calves',
            'Quadriceps, Glutes', 'Glutes, Hamstrings', 'Shoulders, Core', 'Quadriceps', 'Forearms, Traps'
        ]
    }
    
    exercises_df = pd.DataFrame(exercises_data)
    exercises_df.to_csv('data/exercises.csv', index=False)
    print(f"✓ Created data/exercises.csv with {len(exercises_df)} exercises")
    
    # 2. NUTRITION.CSV
    nutrition_data = {
        'food_name': [
            'Chicken Breast', 'Salmon', 'Eggs', 'Greek Yogurt', 'Whey Protein',
            'Brown Rice', 'Quinoa', 'Oatmeal', 'Sweet Potato', 'Whole Wheat Bread',
            'Almonds', 'Avocado', 'Olive Oil', 'Peanut Butter', 'Chia Seeds',
            'Broccoli', 'Spinach', 'Banana', 'Apple', 'Blueberries',
            'Milk', 'Cottage Cheese', 'Tuna', 'Turkey Breast', 'Lentils',
            'Chickpeas', 'Tofu', 'Edamame', 'Walnuts', 'Cashews'
        ],
        'category': [
            'Protein', 'Protein', 'Protein', 'Protein', 'Protein',
            'Carbs', 'Carbs', 'Carbs', 'Carbs', 'Carbs',
            'Fats', 'Fats', 'Fats', 'Fats', 'Fats',
            'Vegetables', 'Vegetables', 'Fruits', 'Fruits', 'Fruits',
            'Dairy', 'Dairy', 'Protein', 'Protein', 'Legumes',
            'Legumes', 'Protein', 'Protein', 'Fats', 'Fats'
        ],
        'serving_size': [
            '100g', '100g', '2 large', '1 cup', '1 scoop (30g)',
            '1 cup cooked', '1 cup cooked', '1 cup cooked', '1 medium', '2 slices',
            '28g (1 oz)', '1/2 medium', '1 tbsp', '2 tbsp', '2 tbsp',
            '1 cup', '1 cup', '1 medium', '1 medium', '1 cup',
            '1 cup', '1 cup', '100g', '100g', '1 cup cooked',
            '1 cup cooked', '100g', '1 cup', '28g (1 oz)', '28g (1 oz)'
        ],
        'calories': [
            165, 206, 143, 100, 120,
            218, 222, 154, 112, 160,
            164, 120, 119, 188, 138,
            55, 7, 105, 95, 84,
            149, 206, 116, 135, 230,
            269, 76, 189, 185, 157
        ],
        'protein_g': [
            31, 22, 13, 10, 24,
            5, 8, 6, 2, 8,
            6, 1.5, 0, 8, 5,
            4, 1, 1.3, 0.5, 1,
            8, 28, 26, 30, 18,
            15, 8, 17, 4, 5
        ],
        'carbs_g': [
            0, 0, 1, 6, 3,
            46, 39, 27, 26, 28,
            6, 6, 0, 7, 12,
            11, 1, 27, 25, 21,
            12, 8, 0, 0, 40,
            45, 2, 16, 4, 9
        ],
        'fat_g': [
            3.6, 13, 10, 0.4, 1.5,
            2, 4, 3, 0.2, 3,
            14, 11, 14, 16, 9,
            0.5, 0, 0.4, 0.3, 0.5,
            8, 9, 1, 1.5, 1,
            4, 5, 8, 18, 12
        ],
        'fiber_g': [
            0, 0, 0, 0, 0,
            3.5, 5, 4, 4, 4,
            3.5, 7, 0, 2, 10,
            5, 1, 3, 4, 4,
            0, 0, 0, 0, 16,
            12, 1, 8, 2, 1
        ],
        'benefits': [
            'Lean protein for muscle building', 'Omega-3 fatty acids for heart health', 'Complete protein with all amino acids',
            'High protein, probiotic benefits', 'Quick protein absorption post-workout',
            'Complex carbs, sustained energy', 'Complete protein grain, high fiber', 'Slow-digesting carbs, heart-healthy',
            'Vitamin A, complex carbs', 'Whole grain energy source',
            'Healthy fats, vitamin E', 'Heart-healthy monounsaturated fats', 'Anti-inflammatory, heart-healthy',
            'Protein and healthy fats', 'Omega-3, high fiber',
            'Vitamins C and K, fiber', 'Iron, vitamins A and K', 'Quick energy, potassium',
            'Fiber, vitamin C', 'Antioxidants, low calorie',
            'Calcium, vitamin D', 'High protein, low fat', 'Lean protein, omega-3',
            'Low fat protein source', 'Plant protein, high fiber',
            'Protein, fiber, iron', 'Plant protein, low calorie', 'Complete plant protein',
            'Omega-3, brain health', 'Magnesium, healthy fats'
        ]
    }
    
    nutrition_df = pd.DataFrame(nutrition_data)
    nutrition_df.to_csv('data/nutrition.csv', index=False)
    print(f"✓ Created data/nutrition.csv with {len(nutrition_df)} foods")
    
    # 3. WORKOUT_PLANS.CSV
    workout_plans_data = {
        'plan_name': [
            'Beginner Full Body 3-Day', 'Intermediate Push/Pull/Legs', 'Advanced 5-Day Split',
            'Home Workout No Equipment', 'Weight Loss Circuit', 'Muscle Building 4-Day',
            'Strength Training 3-Day', 'HIIT Fat Burning', 'Upper/Lower 4-Day Split',
            'Powerlifting Program'
        ],
        'level': [
            'Beginner', 'Intermediate', 'Advanced',
            'Beginner', 'All Levels', 'Intermediate',
            'Intermediate', 'Intermediate', 'Advanced',
            'Advanced'
        ],
        'days_per_week': [
            3, 6, 5,
            5, 4, 4,
            3, 3, 4,
            4
        ],
        'duration_weeks': [
            8, 12, 16,
            12, 8, 12,
            12, 6, 12,
            16
        ],
        'goal': [
            'Build foundation, learn form', 'Balanced muscle development', 'Advanced muscle building',
            'General fitness at home', 'Fat loss and conditioning', 'Muscle hypertrophy',
            'Increase strength', 'Fat loss, cardiovascular fitness', 'Balanced upper/lower development',
            'Maximal strength on big 3 lifts'
        ],
        'workout_structure': [
            'Day 1: Full Body A | Day 2: Full Body B | Day 3: Full Body C',
            'Day 1: Push | Day 2: Pull | Day 3: Legs | Repeat',
            'Day 1: Chest | Day 2: Back | Day 3: Shoulders | Day 4: Arms | Day 5: Legs',
            'Day 1: Upper Body | Day 2: Lower Body | Day 3: Core & Cardio | Day 4: Full Body | Day 5: HIIT',
            'Day 1: Upper Circuit | Day 2: Lower Circuit | Day 3: Full Body Circuit | Day 4: Cardio & Core',
            'Day 1: Chest & Triceps | Day 2: Back & Biceps | Day 3: Shoulders | Day 4: Legs',
            'Day 1: Squat Focus | Day 2: Bench Press Focus | Day 3: Deadlift Focus',
            'Day 1: Full Body HIIT | Day 2: Cardio Intervals | Day 3: Metabolic Circuit',
            'Day 1: Upper Power | Day 2: Lower Power | Day 3: Upper Hypertrophy | Day 4: Lower Hypertrophy',
            'Day 1: Squat Heavy | Day 2: Bench Heavy | Day 3: Deadlift Heavy | Day 4: Accessories'
        ],
        'equipment_needed': [
            'Dumbbells, Bench', 'Full gym access', 'Full gym access',
            'None (bodyweight)', 'Minimal - dumbbells optional', 'Barbells, dumbbells, machines',
            'Barbell, rack, plates', 'Minimal equipment', 'Full gym access',
            'Barbell, rack, heavy plates'
        ],
        'avg_workout_time_min': [
            45, 60, 75,
            30, 40, 60,
            90, 30, 70,
            120
        ],
        'description': [
            'Perfect for beginners. Focuses on compound movements and building a foundation of strength.',
            'Classic bodybuilding split for balanced development. Great for muscle building.',
            'High volume split for advanced lifters focusing on specific muscle groups each day.',
            'No equipment needed. Perfect for home workouts using bodyweight exercises.',
            'Circuit style training to maximize calorie burn and fat loss.',
            'Hypertrophy focused program for muscle growth with adequate volume and intensity.',
            'Low rep, high intensity strength building on the big compound lifts.',
            'High intensity interval training for fat loss and improved conditioning.',
            'Combines power and hypertrophy training for strength and size.',
            'Periodized powerlifting program focused on squat, bench press, and deadlift.'
        ]
    }
    
    workout_plans_df = pd.DataFrame(workout_plans_data)
    workout_plans_df.to_csv('data/workout_plans.csv', index=False)
    print(f"✓ Created data/workout_plans.csv with {len(workout_plans_df)} plans")
    
    print("\n" + "="*60)
    print("✓ All sample data files created successfully!")
    print("="*60)
    print("\nFiles created in 'data/' directory:")
    print("  - exercises.csv (25 exercises)")
    print("  - nutrition.csv (30 foods)")
    print("  - workout_plans.csv (10 workout plans)")
    print("\nYou can now restart your Flask server!")

if __name__ == "__main__":
    create_sample_data()