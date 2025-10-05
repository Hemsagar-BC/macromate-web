"""
Simple Fitness Chatbot - NO AI MODEL REQUIRED
Uses pre-defined responses + CSV search only
Fast, reliable, and easy to maintain
"""

import pandas as pd
import os
import time
from typing import Dict, List, Optional


class SimpleFitnessChatbot:
    """
    Lightweight fitness chatbot using pre-defined responses and CSV lookups
    No AI model needed - runs instantly!
    """
    
    def __init__(self, csv_files_path: List[str]):
        print("Initializing Simple Fitness Chatbot...")
        
        # Load CSV data
        self.csv_data = self._load_csv_data(csv_files_path)
        print(f"Loaded {len(self.csv_data)} CSV files")
        
        # Load pre-defined Q&A knowledge base
        self.qa_database = self._build_qa_database()
        print(f"Loaded {len(self.qa_database)} pre-defined topics")
        
        # Simple cache for repeated queries
        self.cache = {}
        
        print("Chatbot initialized successfully!")
    
    def _load_csv_data(self, csv_files: List[str]) -> Dict[str, pd.DataFrame]:
        """Load CSV files into pandas DataFrames"""
        data = {}
        for file_path in csv_files:
            if not os.path.exists(file_path):
                print(f"Warning: {file_path} not found, skipping...")
                continue
            
            try:
                df = pd.read_csv(file_path)
                # Extract filename without extension
                file_name = os.path.basename(file_path).replace('.csv', '')
                data[file_name] = df
                print(f"  ✓ Loaded {file_name}: {len(df)} rows")
            except Exception as e:
                print(f"  ✗ Error loading {file_path}: {e}")
        
        return data
    
    def _build_qa_database(self) -> Dict:
        """
        Pre-defined Q&A database covering common fitness topics
        This is your main speed advantage - instant responses!
        """
        return {
            'beginner_workout': {
                'triggers': ['beginner', 'start workout', 'new to gym', 'first time', 'starting fitness', 'workout plan beginner'],
                'response': """🏋️ **Beginner Full Body Workout (3 days/week)**

**Monday - Full Body:**
• Bodyweight Squats: 3 sets × 15 reps
• Push-ups (or knee push-ups): 3 sets × 10 reps
• Dumbbell Rows: 3 sets × 12 reps
• Plank: 3 sets × 30 seconds
• Walking Lunges: 3 sets × 10 reps/leg

**Wednesday - Active Recovery:**
• 20-30 min walk or light yoga

**Friday - Full Body:**
• Goblet Squats: 3 sets × 12 reps
• Shoulder Press: 3 sets × 10 reps
• Lat Pulldown: 3 sets × 12 reps
• Bicycle Crunches: 3 sets × 15 reps
• Glute Bridges: 3 sets × 15 reps

**Important Tips:**
✓ Start with light weights - focus on FORM
✓ Rest 60-90 seconds between sets
✓ Increase weight when exercises feel easy
✓ Stay hydrated (2-3 liters water/day)
✓ Sleep 7-9 hours for recovery

**Progress timeline:** See strength gains in 2-3 weeks!""",
                'confidence': 0.95
            },
            
            'weight_loss': {
                'triggers': ['lose weight', 'fat loss', 'weight loss', 'burn fat', 'reduce weight', 'slim down', 'get lean'],
                'response': """🔥 **Effective Weight Loss Plan**

**Nutrition (70% of results):**
• Calorie deficit: Eat 300-500 calories below maintenance
• Protein: 1.6-2g per kg bodyweight (chicken, fish, eggs, tofu)
• Vegetables: Unlimited! Fill half your plate
• Water: 3-4 liters daily (helps hunger control)
• Avoid: Sugary drinks, excessive processed foods

**Sample Daily Menu (1800 calories):**
Breakfast: Oatmeal + 2 eggs + banana (450 cal)
Lunch: Grilled chicken + brown rice + veggies (600 cal)
Snack: Greek yogurt + berries (200 cal)
Dinner: Salmon + sweet potato + salad (550 cal)

**Exercise (30% of results):**
• 3-4 cardio sessions/week (30-45 min)
  → Running, cycling, swimming, jump rope
• 2-3 strength training/week (maintains muscle)
• Daily steps: Aim for 8,000-10,000

**Realistic Timeline:**
Week 1-2: 2-3 kg (mostly water weight)
Week 3+: 0.5-1 kg per week (sustainable fat loss)

**Key:** Consistency beats perfection. One bad meal won't ruin progress!""",
                'confidence': 0.95
            },
            
            'muscle_gain': {
                'triggers': ['build muscle', 'gain muscle', 'get bigger', 'bulk up', 'muscle building', 'hypertrophy', 'mass gain'],
                'response': """💪 **Muscle Building Guide**

**Nutrition (Critical!):**
• Calorie surplus: +300-500 calories above maintenance
• Protein: 1.8-2.2g per kg bodyweight
  → Chicken, beef, fish, eggs, dairy, protein powder
• Carbs: 3-4g per kg (fuel for workouts)
  → Rice, oats, pasta, potatoes, bread
• Healthy fats: 0.8-1g per kg
  → Nuts, avocado, olive oil, fatty fish

**Sample Daily Menu (2500 calories):**
Breakfast: 4 eggs + oats + banana + milk (700 cal)
Snack: Protein shake + peanut butter (350 cal)
Lunch: Chicken breast + rice + veggies (700 cal)
Snack: Greek yogurt + almonds (300 cal)
Dinner: Beef + pasta + cheese (450 cal)

**Training (Progressive Overload!):**
• 4-5 workout days/week
• 8-12 reps per set (hypertrophy range)
• 3-4 sets per exercise
• Must increase weight every 2-3 weeks!

**Sample 4-Day Split:**
Day 1: Chest + Triceps
Day 2: Back + Biceps
Day 3: Rest
Day 4: Shoulders + Abs
Day 5: Legs
Day 6-7: Rest

**Recovery:**
• Sleep 8-9 hours (muscle grows during sleep!)
• Rest days are essential
• Stay hydrated

**Realistic Gains:**
Beginners: 1-2 kg muscle per month
Intermediate: 0.5-1 kg per month""",
                'confidence': 0.95
            },
            
            'protein_foods': {
                'triggers': ['protein', 'high protein', 'protein foods', 'protein rich', 'protein sources', 'foods with protein'],
                'response': """🍗 **Top High-Protein Foods**

**Animal Sources (Complete Proteins):**
1. Chicken Breast: 31g protein per 100g (165 cal)
2. Turkey Breast: 30g protein per 100g (135 cal)
3. Salmon: 22g protein per 100g (206 cal)
4. Tuna (canned): 26g protein per 100g (116 cal)
5. Eggs: 13g protein per 2 large eggs (143 cal)
6. Greek Yogurt: 10g protein per cup (100 cal)
7. Cottage Cheese: 28g protein per cup (206 cal)
8. Whey Protein: 24g protein per scoop (120 cal)

**Plant Sources:**
1. Lentils: 18g protein per cooked cup (230 cal)
2. Chickpeas: 15g protein per cooked cup (269 cal)
3. Tofu: 8g protein per 100g (76 cal)
4. Edamame: 17g protein per cup (189 cal)
5. Quinoa: 8g protein per cooked cup (222 cal)
6. Peanut Butter: 8g protein per 2 tbsp (188 cal)

**Quick Protein Snacks:**
• Hard-boiled eggs (6g protein each)
• Protein shake (20-30g)
• Handful of almonds (6g per 28g)
• Beef jerky (9g per 28g)
• Tuna packet (17g per packet)

**Daily Target:**
• Sedentary: 0.8g per kg bodyweight
• Active/Athlete: 1.6-2.2g per kg bodyweight
• Building muscle: 2g per kg bodyweight

Example: 70kg person building muscle needs 140g protein/day""",
                'confidence': 0.95
            },
            
            'cardio_exercises': {
                'triggers': ['cardio', 'cardio exercises', 'aerobic', 'cardiovascular', 'best cardio', 'heart rate'],
                'response': """❤️ **Best Cardio Exercises (Ranked by Calorie Burn)**

**High Intensity (400+ cal/30min):**
1. **Running (10 km/h)**: 400 cal
   → Great for: Fat loss, endurance
   → Equipment: Just shoes!

2. **Jump Rope**: 450 cal
   → Great for: Full body, coordination
   → Equipment: $10 rope

3. **Burpees**: 400 cal
   → Great for: Fat loss, strength
   → Equipment: None!

4. **Swimming (Fast)**: 420 cal
   → Great for: Low impact, full body
   → Equipment: Pool access

**Moderate Intensity (250-350 cal/30min):**
5. **Cycling (Fast)**: 350 cal
6. **Rowing Machine**: 300 cal
7. **Boxing/Kickboxing**: 350 cal
8. **Stair Climbing**: 320 cal

**Low Intensity (150-250 cal/30min):**
9. **Brisk Walking**: 150 cal
10. **Cycling (Leisure)**: 200 cal
11. **Dancing**: 220 cal
12. **Elliptical**: 250 cal

**Recommendations by Goal:**

**Fat Loss:**
• HIIT: 20-30 min, 3-4x/week
• Example: 30 sec sprint + 30 sec walk × 10 rounds

**Heart Health:**
• Moderate cardio: 30-45 min, 5x/week
• Example: Brisk walking, cycling

**Endurance:**
• Long steady cardio: 45-60 min, 3-4x/week
• Example: Running, swimming

**Beginner-Friendly:**
• Walking: 30-45 min daily
• Swimming: Low impact, easy on joints
• Cycling: Fun and effective

**Pro Tip:** Mix it up! Variety prevents boredom and overuse injuries.""",
                'confidence': 0.95
            },
            
            'home_workout': {
                'triggers': ['home workout', 'no equipment', 'bodyweight', 'workout at home', 'no gym', 'home exercises'],
                'response': """🏠 **Effective Home Workout (No Equipment!)**

**Full Body Circuit (Repeat 3-4 rounds):**

**Warm-up (5 min):**
• Jumping Jacks: 30 sec
• Arm Circles: 30 sec
• Leg Swings: 30 sec forward/back
• High Knees: 30 sec
• Butt Kicks: 30 sec

**Main Workout:**
1. **Push-ups**: 15 reps
   (Knees down if needed)

2. **Bodyweight Squats**: 20 reps
   (Go as deep as comfortable)

3. **Plank**: 45 seconds
   (On elbows or hands)

4. **Walking Lunges**: 12 reps per leg
   (Or stationary lunges)

5. **Mountain Climbers**: 20 reps total
   (Slow and controlled)

6. **Glute Bridges**: 15 reps
   (Squeeze at top)

7. **Bicycle Crunches**: 20 reps total
   (Opposite elbow to knee)

8. **Burpees**: 10 reps
   (Skip jump if too intense)

**Rest**: 60-90 seconds between rounds

**Cool Down (5 min):**
• Child's pose: 30 sec
• Hamstring stretch: 30 sec each leg
• Quad stretch: 30 sec each leg
• Chest stretch: 30 sec
• Shoulder stretch: 30 sec each arm

**Schedule:**
• Beginners: 3x per week (Mon, Wed, Fri)
• Intermediate: 4-5x per week
• Duration: 30-40 minutes

**Progression:**
Week 1-2: Complete the workout
Week 3-4: Add 5 reps to each exercise
Week 5-6: Add 4th round
Week 7-8: Reduce rest to 45 seconds

**Equipment (Optional but Cheap):**
• Resistance bands: $15
• Yoga mat: $20
• Dumbbells: $30

No excuses - your body is the gym!""",
                'confidence': 0.95
            },
            
            'meal_plan': {
                'triggers': ['meal plan', 'diet plan', 'what to eat', 'food plan', 'eating plan', 'daily meals'],
                'response': """🍽️ **Balanced Meal Plan (2000 calories)**

**Monday - Friday (Weekday Plan):**

**Breakfast (500 cal) - 7:30 AM:**
• Oatmeal: 1 cup cooked
• Banana: 1 medium
• Eggs: 2 scrambled
• Milk: 1 cup
**Protein: 20g | Carbs: 70g | Fat: 15g**

**Mid-Morning Snack (200 cal) - 10:30 AM:**
• Apple: 1 medium
• Peanut Butter: 1 tbsp
**Protein: 4g | Carbs: 30g | Fat: 8g**

**Lunch (600 cal) - 1:00 PM:**
• Grilled Chicken: 150g
• Brown Rice: 1 cup cooked
• Mixed Vegetables: 2 cups
• Olive Oil: 1 tbsp for cooking
**Protein: 45g | Carbs: 60g | Fat: 18g**

**Afternoon Snack (200 cal) - 4:00 PM:**
• Greek Yogurt: 1 cup
• Berries: 1/2 cup
**Protein: 15g | Carbs: 25g | Fat: 3g**

**Dinner (500 cal) - 7:30 PM:**
• Salmon or Tofu: 120g
• Sweet Potato: 1 medium
• Broccoli: 2 cups
• Avocado: 1/4
**Protein: 30g | Carbs: 45g | Fat: 20g**

**Daily Totals:**
• Calories: 2000
• Protein: 114g (23%)
• Carbs: 230g (46%)
• Fat: 64g (29%)

**Meal Prep Tips:**
• Sunday: Cook chicken, rice, chop vegetables
• Prep 3-4 days at once
• Use Tupperware containers
• Freeze extra portions

**Customize Based on Goals:**
• **Weight Loss**: Reduce to 1500-1700 cal
• **Muscle Gain**: Increase to 2300-2500 cal
• **Maintenance**: Keep at 2000 cal

**Vegetarian?** Replace:
• Chicken → Tofu, tempeh, lentils
• Fish → Chickpeas, beans
• Easy swap!

**Budget-Friendly?**
• Eggs instead of meat
• Canned tuna
• Frozen vegetables
• Bulk rice and oats""",
                'confidence': 0.95
            },
            
            'water_intake': {
                'triggers': ['water', 'hydration', 'drink water', 'how much water', 'daily water'],
                'response': """💧 **Daily Water Intake Guide**

**General Recommendations:**
• **Men**: 3.7 liters (15 cups) per day
• **Women**: 2.7 liters (11 cups) per day

**Factors Increasing Your Needs:**

**Exercise:**
• Light workout: +500ml
• Moderate workout: +750ml
• Intense workout: +1,000ml per hour

**Weather:**
• Hot/Humid: +500-1,000ml
• Normal: Standard amount
• Cold: Slightly less

**Special Conditions:**
• Pregnancy: +300ml daily
• Breastfeeding: +700-1,000ml daily
• Illness/Fever: +500ml daily
• High altitude: +500ml daily

**Signs of Proper Hydration:**
✓ Urine is light yellow (pale lemonade color)
✓ Rarely feel thirsty
✓ Good energy levels
✓ No headaches

**Signs of Dehydration:**
✗ Dark yellow urine
✗ Dry mouth and lips
✗ Fatigue and dizziness
✗ Headaches
✗ Constipation

**Hydration Schedule:**
**7:00 AM**: 500ml (wake up)
**9:00 AM**: 250ml (mid-morning)
**12:00 PM**: 500ml (lunch)
**3:00 PM**: 250ml (afternoon)
**6:00 PM**: 500ml (dinner)
**9:00 PM**: 250ml (before bed)
**Total: 2.25 liters base + exercise/weather**

**Pro Tips:**
1. **Carry a water bottle** everywhere
2. **Drink before you're thirsty**
3. **Set phone reminders** every 2 hours
4. **Eat water-rich foods**: cucumber, watermelon, oranges
5. **Herbal tea counts** as hydration

**Bottom Line:** Check your urine color - it's the best indicator!""",
                'confidence': 0.95
            },
            



            
            'supplements': {
                'triggers': ['supplement', 'protein powder', 'creatine', 'vitamins', 'pre workout', 'supplements'],
                'response': """💊 **Essential Fitness Supplements**

**Recommended (Evidence-Based):**

1. **Whey Protein Powder**
   - When: Post-workout or any meal
   - Dose: 20-30g per serving
   - Benefit: Convenient protein source, muscle recovery
   - Cost: $30-50/month

2. **Creatine Monohydrate**
   - When: Anytime (daily)
   - Dose: 5g daily
   - Benefit: Increased strength & power output
   - Cost: $10-15/month
   - Most researched supplement!

3. **Omega-3 (Fish Oil)**
   - When: With meals
   - Dose: 1-2g EPA+DHA daily
   - Benefit: Heart health, reduced inflammation, recovery
   - Cost: $15-20/month

4. **Vitamin D3**
   - When: Morning with food
   - Dose: 1000-2000 IU (or more if deficient)
   - Benefit: Bone health, immunity, mood
   - Cost: $10/month

5. **Multivitamin** (Optional)
   - When: With breakfast
   - Benefit: Fill nutritional gaps
   - Cost: $15-20/month

**Optional (Situational):**
• Pre-workout (caffeine): Energy boost for workouts
• BCAAs: Only useful if training fasted
• Beta-Alanine: Slight endurance boost
• Magnesium: If deficient, helps sleep

**CRITICAL REMINDERS:**
⚠️ Supplements are NOT magic pills
⚠️ Fix your diet FIRST before buying supplements
⚠️ You can build muscle without any supplements
⚠️ Whole foods > supplements always

**Priority Order:**
1. Proper diet (80% of results)
2. Consistent training (15% of results)
3. Supplements (5% of results)

**Safety:**
✓ Consult doctor before starting (especially if on medication)
✓ Buy from reputable brands (check for third-party testing)
✓ Don't exceed recommended doses""",
                'confidence': 0.90
            },
            
            'rest_recovery': {
                'triggers': ['rest day', 'recovery', 'how many rest days', 'overtraining', 'rest between workouts', 'speed recovery','from muscle soreness'],
                'response': """😴 **Rest & Recovery Guide**

**Why Rest Days Matter:**
• Muscles grow during REST, not during workouts
• Prevents overtraining and injury
• Allows nervous system recovery
• Improves performance
• Prevents burnout

**How Many Rest Days:**
• **Beginners**: 3-4 rest days/week
• **Intermediate**: 2-3 rest days/week
• **Advanced**: 1-2 rest days/week (or active recovery)

**Active Recovery Ideas:**
• Light 20-30 min walk
• Stretching or yoga (30 min)
• Swimming (easy pace, 20 min)
• Foam rolling (15 min)
• Cycling (leisure pace, 30 min)

**Signs You NEED Rest:**
⚠️ Constant fatigue
⚠️ Decreased performance (weaker in gym)
⚠️ Persistent muscle soreness (3+ days)
⚠️ Poor sleep quality
⚠️ Loss of motivation
⚠️ Irritability
⚠️ Elevated resting heart rate
⚠️ Getting sick frequently

**Sleep Recommendations:**
• **Beginners/General**: 7-9 hours
• **Athletes/Hard training**: 8-10 hours
• **Sleep quality matters** more than quantity

**Tips for Better Recovery:**
1. **Sleep**: Aim for 8 hours minimum
2. **Nutrition**: Eat enough protein (1.6-2.2g/kg)
3. **Hydration**: 3-4 liters water daily
4. **Stress management**: Meditation, deep breathing
5. **Foam rolling**: 10-15 min post-workout
6. **Ice baths** (optional): 10-15 min after intense workouts

**Rest Day ≠ Zero Activity:**
• Light movement is beneficial
• Go for a walk
• Do gentle stretching
• Stay active but low intensity

**Remember:** More training ≠ Better results. Recovery is when you actually get stronger!""",
                'confidence': 0.95
            },
            
            'motivation': {
                'triggers': ['motivation', 'stay motivated', 'give up', 'consistent', 'discipline', 'stay on track'],
                'response': """🔥 **Staying Motivated on Your Fitness Journey**

**1. Set SMART Goals:**
• **Specific**: "Lose 5kg" not "get fit"
• **Measurable**: Track weekly
• **Achievable**: Realistic for your lifestyle
• **Relevant**: Matters to YOU
• **Time-bound**: "in 3 months"

**2. Track Progress (Multiple Ways):**
• Take photos: Front, side, back (weekly)
• Measurements: Waist, arms, legs (bi-weekly)
• Performance: Weight lifted, reps, time
• How you feel: Energy, confidence, mood
• Celebrate small wins!

**3. Find Your WHY:**
• Health? Energy? Confidence? Strength?
• Write it down
• Read it every morning
• Visualize your goal daily

**4. Make It Enjoyable:**
• Choose activities you actually like
• Workout with friends/community
• Great music or podcasts
• Try new things
• Don't force yourself into activities you hate

**5. Build Systems, Not Just Motivation:**
• Same workout time daily (build habit)
• Prepare gym bag night before
• Meal prep on Sundays
• Track workouts in app/journal
• **Discipline > Motivation** (motivation fades, discipline stays)

**6. Handle Setbacks:**
• Missed a workout? Do 10 push-ups at home
• Bad eating day? Next meal is a new chance
• One bad day ≠ Failure
• Progress isn't linear
• 2 steps forward, 1 step back is still progress

**7. Accountability:**
• Workout partner
• Join online community
• Post progress on social media
• Hire a coach (if budget allows)
• Tell friends/family your goals

**8. Reward Yourself:**
• Hit a milestone? Buy new workout clothes
• Lost 5kg? Take yourself out (non-food reward)
• PR on bench press? New shoes!

**Remember:**
✓ Progress over perfection
✓ Consistency beats intensity
✓ Bad days happen to everyone
✓ Focus on what you CAN control
✓ Compare yourself to past you, not others

**Powerful Quote:**
"The only bad workout is the one that didn't happen."

**You've got this!** 💪""",
                'confidence': 0.95
            }
        }
    
    def chat(self, query: str) -> Dict:
        """
        Main chat function with 3-tier system:
        1. Check cache
        2. Check pre-defined Q&A
        3. Search CSV data
        4. Fallback message
        """
        start_time = time.time()
        
        # Input validation
        if not query or len(query.strip()) == 0:
            return {
                'response': "Please ask me a fitness-related question!",
                'type': 'error',
                'sources': 'none',
                'processing_time_ms': 0
            }
        
        query_clean = query.strip().lower()
        
        # TIER 1: Check cache
        if query_clean in self.cache:
            response = self.cache[query_clean].copy()
            response['processing_time_ms'] = (time.time() - start_time) * 1000
            response['cached'] = True
            return response
        
        # TIER 2: Check pre-defined Q&A
        for topic, data in self.qa_database.items():
            for trigger in data['triggers']:
                if trigger in query_clean:
                    response = {
                        'response': data['response'],
                        'type': 'predefined',
                        'sources': 'Built-in knowledge base',
                        'processing_time_ms': (time.time() - start_time) * 1000,
                        'confidence': data['confidence'],
                        'matched_topic': topic
                    }
                    # Cache it
                    self.cache[query_clean] = response
                    return response
        
        # TIER 3: Search CSV data
        csv_result = self._search_csv(query_clean)
        if csv_result:
            response = {
                'response': csv_result['answer'],
                'type': 'csv_lookup',
                'sources': ', '.join(csv_result['sources']),
                'processing_time_ms': (time.time() - start_time) * 1000,
                'confidence': 0.80
            }
            return response
        
        # TIER 4: Fallback
        response = {
            'response': self._get_fallback_message(),
            'type': 'fallback',
            'sources': 'none',
            'processing_time_ms': (time.time() - start_time) * 1000,
            'confidence': 0.0
        }
        return response
    
    def _search_csv(self, query: str) -> Optional[Dict]:
        """
        Search CSV files for specific information
        Returns formatted response if found
        """
        
        # Search exercises.csv
        if 'exercises' in self.csv_data:
            df = self.csv_data['exercises']
            # Search in name, category, description columns
            mask = (
                df['name'].str.lower().str.contains(query, na=False) |
                df['category'].str.lower().str.contains(query, na=False) |
                df['description'].str.lower().str.contains(query, na=False)
            )
            matches = df[mask]
            
            if not matches.empty:
                row = matches.iloc[0]
                answer = f"""**{row['name']}**

**Category:** {row['category']}
**Difficulty:** {row['difficulty']}
**Equipment Needed:** {row['equipment']}

**Description:**
{row['description']}

**Primary Muscles Worked:** {row['primary_muscles']}
**Calories Burned (30 min):** {row['calories_per_30min']} calories

**Want to learn more?** Ask about workout plans or other exercises!"""
                
                return {
                    'answer': answer,
                    'sources': ['exercises.csv']
                }
        
        # Search nutrition.csv
        if 'nutrition' in self.csv_data:
            df = self.csv_data['nutrition']
            mask = (
                df['food_name'].str.lower().str.contains(query, na=False) |
                df['category'].str.lower().str.contains(query, na=False)
            )
            matches = df[mask]
            
            if not matches.empty:
                row = matches.iloc[0]
                answer = f"""**{row['food_name']}** - Nutritional Information

**Serving Size:** {row['serving_size']}
**Calories:** {row['calories']} kcal

**Macronutrients:**
• Protein: {row['protein_g']}g
• Carbohydrates: {row['carbs_g']}g
• Fat: {row['fat_g']}g
• Fiber: {row['fiber_g']}g

**Benefits:**
{row['benefits']}

**Want meal planning help?** Ask me for a meal plan or high protein foods!"""
                
                return {
                    'answer': answer,
                    'sources': ['nutrition.csv']
                }
        
        # Search workout_plans.csv
        if 'workout_plans' in self.csv_data:
            df = self.csv_data['workout_plans']
            mask = (
                df['plan_name'].str.lower().str.contains(query, na=False) |
                df['goal'].str.lower().str.contains(query, na=False) |
                df['level'].str.lower().str.contains(query, na=False)
            )
            matches = df[mask]
            
            if not matches.empty:
                row = matches.iloc[0]
                answer = f"""**{row['plan_name']}**

**Level:** {row['level']}
**Days Per Week:** {row['days_per_week']}
**Duration:** {row['duration_weeks']} weeks
**Goal:** {row['goal']}

**Workout Structure:**
{row['workout_structure']}

**Equipment Needed:** {row['equipment_needed']}
**Average Workout Time:** {row['avg_workout_time_min']} minutes

**Description:**
{row['description']}

**Ready to start?** Ask me for beginner workout tips or nutrition advice!"""
                
                return {
                    'answer': answer,
                    'sources': ['workout_plans.csv']
                }
        
        return None
    
    def _get_fallback_message(self) -> str:
        """Helpful fallback when no match found"""
        return """I don’t have a specific answer to that question yet, but I’m trained to provide information on the following topics:

Workouts:
• Beginner workout plans
• Home workouts (no equipment)
• Muscle building programs

Nutrition:
• High protein foods
• Meal planning
• Weight loss diet tips

Cardio:
• Best cardio exercises
• Fat loss strategies

General Fitness:
• Water intake guidelines
• Rest and recovery
• Supplements guide

Try asking: "Give me a beginner workout plan" or "What foods are high in protein?"
"""
    
    def get_statistics(self) -> Dict:
        """Get chatbot statistics for monitoring"""
        return {
            'total_topics': len(self.qa_database),
            'csv_files_loaded': len(self.csv_data),
            'cache_size': len(self.cache),
            'topics_covered': list(self.qa_database.keys())
        }


# Example usage and testing
if __name__ == "__main__":
    print("="*70)
    print("SIMPLE FITNESS CHATBOT - NO AI MODEL")
    print("="*70)
    
    # Initialize chatbot
    csv_files = [
        "data/exercises.csv",
        "data/nutrition.csv",
        "data/workout_plans.csv"
    ]
    
    try:
        chatbot = SimpleFitnessChatbot(csv_files)
    except Exception as e:
        print(f"Error initializing chatbot: {e}")
        print("Creating demo chatbot without CSV files...")
        chatbot = SimpleFitnessChatbot([])
    
    print("\n" + "="*70)
    print("TESTING CHATBOT")
    print("="*70)
    
    # Test queries
    test_queries = [
        "How do I lose weight?",
        "Give me beginner workout plan",
        "What foods are high in protein?",
        "Best cardio for fat loss?",
        "How much water should I drink?",
        "I want to build muscle",
        "Home workout no equipment",
        "What are the calories in chicken breast?",  # CSV lookup
        "Tell me about push-ups"  # CSV lookup
    ]
    
    for query in test_queries:
        print(f"\n{'='*70}")
        print(f"User: {query}")
        print(f"{'='*70}")
        
        result = chatbot.chat(query)
        
        print(f"Type: {result['type']} | Time: {result['processing_time_ms']:.2f}ms")
        print(f"Confidence: {result.get('confidence', 'N/A')}")
        print(f"Sources: {result['sources']}")
        print(f"\nBot Response:")
        print(result['response'][:400] + "..." if len(result['response']) > 400 else result['response'])
    
    # Show statistics
    print(f"\n{'='*70}")
    print("CHATBOT STATISTICS")
    print(f"{'='*70}")
    stats = chatbot.get_statistics()
    for key, value in stats.items():
        if key == 'topics_covered':
            print(f"{key}: {len(value)} topics")
        else:
            print(f"{key}: {value}")