"""
Flask Backend for MacroMate Fitness App
Updated to use SimpleFitnessChatbot (no AI model required)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from chatbot_simple import SimpleFitnessChatbot

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize chatbot (do this once when server starts)
print("Initializing Fitness Chatbot...")
try:
    # Update these paths to where your CSV files are located
    CSV_FILES = [
        "data/exercises.csv",
        "data/nutrition.csv", 
        "data/workout_plans.csv"
    ]
    chatbot = SimpleFitnessChatbot(CSV_FILES)
    print("✓ Chatbot initialized successfully!")
except Exception as e:
    print(f"Warning: Chatbot initialization failed: {e}")
    chatbot = None

# ============================================
# CHATBOT ENDPOINT
# ============================================

@app.route('/api/chatbot', methods=['POST'])
def chat():
    """
    Chatbot endpoint - handles fitness questions
    Now uses SimpleFitnessChatbot (fast, no AI model needed)
    """
    try:
        if chatbot is None:
            return jsonify({
                'success': False,
                'error': 'Chatbot is not initialized. Please check server logs.'
            }), 503
        
        data = request.json
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({
                'success': False,
                'error': 'Query cannot be empty'
            }), 400
        
        # Get response from chatbot (instant!)
        result = chatbot.chat(query)
        
        return jsonify({
            'success': True,
            'data': {
                'query': query,
                'response': result['response'],
                'type': result['type'],
                'sources': result['sources'],
                'processing_time_ms': result['processing_time_ms'],
                'confidence': result.get('confidence', 0.0),
                'timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================
# HEALTH CHECK ENDPOINT
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    chatbot_stats = {}
    if chatbot:
        try:
            chatbot_stats = chatbot.get_statistics()
        except:
            pass
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0',
        'chatbot_available': chatbot is not None,
        'chatbot_stats': chatbot_stats
    })


# ============================================
# BMI CALCULATOR ENDPOINT
# ============================================

@app.route('/api/calculate/bmi', methods=['POST'])
def calculate_bmi():
    """BMI Calculator endpoint"""
    try:
        data = request.json
        height = float(data.get('height'))  # in cm
        weight = float(data.get('weight'))  # in kg
        unit = data.get('unit', 'metric')   # metric or imperial
        
        # Convert to metric if needed
        if unit == 'imperial':
            height = height * 2.54  # inches to cm
            weight = weight * 0.453592  # pounds to kg
        
        # Convert height to meters
        height_m = height / 100
        
        # Calculate BMI: weight(kg) / height(m)²
        bmi = weight / (height_m ** 2)
        
        # Determine category and health information
        if bmi < 16.0:
            category = 'Severely Underweight'
            category_color = 'text-red-600 bg-red-100'
            health_status = 'critical'
            recommendation = 'You probably need to gain weight! Please consult with a healthcare provider immediately.'
        elif 16.0 <= bmi < 18.5:
            category = 'Underweight'
            category_color = 'text-blue-600 bg-blue-100'
            health_status = 'underweight'
            recommendation = 'You probably need to gain weight! Consider consulting with a nutritionist for a healthy weight gain plan.'
        elif 18.5 <= bmi < 25.0:
            category = 'Normal'
            category_color = 'text-green-600 bg-green-100'
            health_status = 'normal'
            recommendation = 'Great! Your weight is in the healthy range. Maintain your current lifestyle.'
        elif 25.0 <= bmi < 30.0:
            category = 'Overweight'
            category_color = 'text-yellow-600 bg-yellow-100'
            health_status = 'overweight'
            recommendation = 'You probably need to lose weight. Consider a balanced diet and regular exercise.'
        elif 30.0 <= bmi < 35.0:
            category = 'Moderately Obese'
            category_color = 'text-orange-600 bg-orange-100'
            health_status = 'obese1'
            recommendation = 'You probably need to lose weight. Please consider consulting with a healthcare provider for a personalized plan.'
        elif 35.0 <= bmi < 40.0:
            category = 'Severely Obese'
            category_color = 'text-red-600 bg-red-100'
            health_status = 'obese2'
            recommendation = 'You probably need to lose weight urgently. Please consult with a healthcare provider immediately.'
        else:
            category = 'Morbidly Obese'
            category_color = 'text-red-700 bg-red-200'
            health_status = 'obese3'
            recommendation = 'You probably need to lose weight urgently. Please seek immediate medical attention.'
        
        # Calculate ideal weight range (BMI 18.5-24.9)
        ideal_min_weight = 18.5 * (height_m ** 2)
        ideal_max_weight = 24.9 * (height_m ** 2)
        
        # Calculate weight to lose/gain
        if health_status == 'normal':
            weight_adjustment = 0
        elif health_status in ['underweight', 'critical']:
            weight_adjustment = ideal_min_weight - weight
        else:
            weight_adjustment = weight - ideal_max_weight
        
        # Health risks based on category
        risk_factors = []
        if health_status in ['overweight', 'obese1', 'obese2', 'obese3']:
            risk_factors = [
                'Type 2 diabetes',
                'Heart disease', 
                'High blood pressure',
                'Sleep apnea',
                'Certain cancers'
            ]
            if health_status in ['obese2', 'obese3']:
                risk_factors.extend(['Stroke', 'Fatty liver disease'])
        elif health_status in ['underweight', 'critical']:
            risk_factors = [
                'Weakened immune system',
                'Osteoporosis',
                'Fertility issues',
                'Delayed wound healing'
            ]
        
        result = {
            'bmi': round(bmi, 1),
            'category': category,
            'category_color': category_color,
            'health_status': health_status,
            'recommendation': recommendation,
            'current_weight': round(weight, 1),
            'ideal_weight_range': {
                'min': round(ideal_min_weight, 1),
                'max': round(ideal_max_weight, 1)
            },
            'weight_adjustment': round(abs(weight_adjustment), 1) if weight_adjustment != 0 else 0,
            'adjustment_type': 'gain' if health_status in ['underweight', 'critical'] else 'lose' if weight_adjustment != 0 else 'maintain',
            'risk_factors': risk_factors,
            'calculation_date': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


# ============================================
# CALORIE CALCULATOR ENDPOINT
# ============================================

@app.route('/api/calculate/calories', methods=['POST'])
def calculate_calories():
    """Calorie Calculator endpoint - Science-based calculations"""
    try:
        data = request.json
        height = float(data.get('height'))  # in cm
        weight = float(data.get('weight'))  # in kg
        age = int(data.get('age'))
        gender = data.get('gender', 'male').lower()
        activity_level = data.get('activity_level', 'sedentary').lower()
        
        # Activity level multipliers
        activity_multipliers = {
            'sedentary': 1.2,           # Little to no exercise
            'lightly_active': 1.375,    # Light exercise 1-3 days/week
            'moderately_active': 1.55,  # Moderate exercise 3-5 days/week
            'very_active': 1.725,       # Hard exercise 6-7 days/week
            'extremely_active': 1.9     # Very hard exercise, physical job
        }
        
        activity_multiplier = activity_multipliers.get(activity_level, 1.2)
        
        # Mifflin-St Jeor Equation for BMR
        if gender == 'male':
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
        else:  # female
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
        
        # Calculate TDEE (Total Daily Energy Expenditure)
        tdee = bmr * activity_multiplier
        
        # CORRECTED: Using 7700 calories ≈ 1 kg body weight (scientific consensus)
        # Formula: Calorie adjustment = (7700 cal/kg) × (kg per week) ÷ 7 days
        maintain_calories = round(tdee)
        mild_weight_loss = round(tdee - (7700 * 0.25 / 7))      # -275 cal/day = 0.25 kg/week
        weight_loss = round(tdee - (7700 * 0.5 / 7))            # -550 cal/day = 0.5 kg/week  
        extreme_weight_loss = round(tdee - (7700 * 1.0 / 7))    # -1100 cal/day = 1 kg/week
        mild_weight_gain = round(tdee + (7700 * 0.25 / 7))      # +275 cal/day = 0.25 kg/week
        weight_gain = round(tdee + (7700 * 0.5 / 7))            # +550 cal/day = 0.5 kg/week
        extreme_weight_gain = round(tdee + (7700 * 1.0 / 7))    # +1100 cal/day = 1 kg/week
        
        # Calculate BMI for recommendation
        height_m = height / 100
        bmi = weight / (height_m ** 2)
        
        # Generate recommendation based on BMI
        if bmi < 18.5:
            recommendation = "You probably need to gain weight! Focus on nutrient-dense, calorie-rich foods and consider strength training."
            recommendation_color = "text-blue-600 bg-blue-50 border-blue-200"
        elif 18.5 <= bmi < 25.0:
            recommendation = "Your weight appears to be in a healthy range. Focus on maintaining your current weight with balanced nutrition and regular exercise."
            recommendation_color = "text-green-600 bg-green-50 border-green-200"
        else:
            recommendation = "You probably need to lose weight. Consider creating a moderate calorie deficit combined with regular physical activity."
            recommendation_color = "text-orange-600 bg-orange-50 border-orange-200"
        
        # CORRECTED MACRO CALCULATIONS - Body-weight based
        # Protein: 2.2g/kg for maintenance (scientifically optimal)
        protein_grams_maintain = round(weight * 2.2)
        protein_calories_maintain = protein_grams_maintain * 4
        
        # Fat: 25% of calories for hormonal health
        fat_calories_maintain = round(maintain_calories * 0.25)
        fat_grams_maintain = round(fat_calories_maintain / 9)
        
        # Carbs: Remaining calories
        carb_calories_maintain = maintain_calories - protein_calories_maintain - fat_calories_maintain
        carb_grams_maintain = round(carb_calories_maintain / 4)
        
        # Calculate percentages
        protein_percentage = round((protein_calories_maintain / maintain_calories) * 100)
        fat_percentage = 25
        carb_percentage = 100 - protein_percentage - fat_percentage
        
        result = {
            'bmr': round(bmr),
            'tdee': maintain_calories,
            'activity_level': activity_level,
            'activity_multiplier': activity_multiplier,
            'goals': {
                'maintain': maintain_calories,
                'mild_loss': mild_weight_loss,
                'weight_loss': weight_loss,
                'extreme_loss': extreme_weight_loss,
                'mild_gain': mild_weight_gain,
                'weight_gain': weight_gain,
                'extreme_gain': extreme_weight_gain
            },
            'recommendation': recommendation,
            'recommendation_color': recommendation_color,
            'macros': {
                'protein': {
                    'grams': protein_grams_maintain,
                    'calories': protein_calories_maintain,
                    'percentage': protein_percentage
                },
                'carbs': {
                    'grams': carb_grams_maintain,
                    'calories': carb_calories_maintain,
                    'percentage': carb_percentage
                },
                'fat': {
                    'grams': fat_grams_maintain,
                    'calories': fat_calories_maintain,
                    'percentage': fat_percentage
                }
            },
            'user_info': {
                'age': age,
                'height': height,
                'weight': weight,
                'gender': gender,
                'bmi': round(bmi, 1)
            },
            'weekly_weight_changes': {
                'mild_loss': -0.25,
                'weight_loss': -0.5,
                'extreme_loss': -1.0,
                'mild_gain': 0.25,
                'weight_gain': 0.5,
                'extreme_gain': 1.0
            },
            'calculation_date': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

# ============================================
# BODY FAT PREDICTOR ENDPOINT
# ============================================

@app.route('/api/calculate/bodyfat', methods=['POST'])
def calculate_bodyfat():
    """Body Fat Predictor endpoint using Ridge Regression model"""
    try:
        import pickle
        import numpy as np
        
        # Load the trained model
        try:
            with open('bodyfat.pkl', 'rb') as file:
                model = pickle.load(file)
        except FileNotFoundError:
            return jsonify({
                'success': False,
                'error': 'Model file not found. Please ensure bodyfat.pkl is in the server directory.'
            }), 500
        
        data = request.json
        
        # Extract features
        age = float(data.get('age'))
        weight = float(data.get('weight'))
        height = float(data.get('height'))
        neck = float(data.get('neck'))
        abdomen = float(data.get('abdomen'))
        forearm = float(data.get('forearm'))
        wrist = float(data.get('wrist'))
        unit = data.get('unit', 'metric')
        
        # Store original values for display
        original_weight = weight
        
        # Convert to metric if needed (model expects metric)
        if unit == 'imperial':
            weight = weight * 0.453592  # pounds to kg
            height = height * 2.54      # inches to cm
            neck = neck * 2.54
            abdomen = abdomen * 2.54
            forearm = forearm * 2.54
            wrist = wrist * 2.54
        
        # Prepare features in EXACT training order
        # ['Age', 'Weight', 'Height', 'Neck', 'Abdomen', 'Forearm', 'Wrist']
        features = np.array([[age, weight, height, neck, abdomen, forearm, wrist]])
        
        # Debug: Print features
        print(f"Input features: Age={age}, Weight={weight}, Height={height}, Neck={neck}, Abdomen={abdomen}, Forearm={forearm}, Wrist={wrist}")
        
        # Make prediction
        body_fat_percentage = model.predict(features)[0]
        
        # Debug: Print raw prediction
        print(f"Raw prediction: {body_fat_percentage}")
        
        # Clamp between reasonable values (3-50%)
        body_fat_percentage = max(3, min(body_fat_percentage, 50))
        
        # Determine category
        if body_fat_percentage < 6:
            category = 'Essential Fat'
            category_color = 'text-blue-600 bg-blue-100'
            health_status = 'essential'
            recommendation = 'This is extremely low body fat. Essential fat only - consult a healthcare provider.'
        elif 6 <= body_fat_percentage < 14:
            category = 'Athletes'
            category_color = 'text-green-600 bg-green-100'
            health_status = 'athlete'
            recommendation = 'Excellent! Athletic body fat range. Great for performance and aesthetics.'
        elif 14 <= body_fat_percentage < 18:
            category = 'Fitness'
            category_color = 'text-green-500 bg-green-50'
            health_status = 'fitness'
            recommendation = 'Great! You have a fit and healthy body fat percentage.'
        elif 18 <= body_fat_percentage < 25:
            category = 'Average'
            category_color = 'text-yellow-600 bg-yellow-100'
            health_status = 'average'
            recommendation = 'Average body fat range. Consider regular exercise to improve fitness.'
        else:
            category = 'Above Average'
            category_color = 'text-orange-600 bg-orange-100'
            health_status = 'high'
            recommendation = 'Consider a combination of diet and exercise to reduce body fat percentage.'
        
        # Calculate body composition
        fat_mass = (body_fat_percentage / 100) * weight
        lean_body_mass = weight - fat_mass
        
        # Health risks
        risk_factors = []
        if health_status == 'essential':
            risk_factors = [
                'Hormone disruption',
                'Weakened immune system',
                'Loss of muscle mass'
            ]
        elif health_status == 'high':
            risk_factors = [
                'Cardiovascular disease',
                'Type 2 diabetes',
                'High blood pressure'
            ]
        
        result = {
            'body_fat_percentage': round(body_fat_percentage, 1),
            'category': category,
            'category_color': category_color,
            'health_status': health_status,
            'recommendation': recommendation,
            'body_composition': {
                'total_weight': round(weight, 1),
                'fat_mass': round(fat_mass, 1),
                'lean_body_mass': round(lean_body_mass, 1)
            },
            'risk_factors': risk_factors,
            'mae': 3.133,
            'calculation_date': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        print(f"Error in bodyfat calculation: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    print("\n" + "="*70)
    print("MACROMATE FITNESS BACKEND SERVER")
    print("="*70)
    print("\nAvailable endpoints:")
    print("  POST /api/chatbot          - Fitness AI Chatbot (NEW: No AI model!)")
    print("  POST /api/calculate/bmi    - BMI Calculator")
    print("  POST /api/calculate/calories - Calorie Calculator") 
    print("  POST /api/calculate/bodyfat - Body Fat Predictor")
    print("  POST /api/calculate/macros - Macro Calculator")
    print("  GET  /api/health           - Health Check")
    print("\nServer running on http://localhost:5000")
    print("="*70 + "\n")
    
    if __name__ == '__main__':
      app.run(debug=False, host='0.0.0.0', port=5000)