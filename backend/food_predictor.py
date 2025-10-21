# food_predictor.py
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import json
import os

print(f"TensorFlow version: {tf.__version__}")
print(f"Keras version: {tf.keras.__version__}")

class FoodClassifier:
    def __init__(self, model_path='model.h5', config_path='config.json'):
        """Initialize the food classifier with TF 2.19.0 compatibility"""
        try:
            # Check if files exist
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            if not os.path.exists(config_path):
                raise FileNotFoundError(f"Config file not found: {config_path}")
            
            print("Loading model...")
            
            # Method 1: Try standard loading first
            try:
                self.model = tf.keras.models.load_model(model_path)
                print("✓ Model loaded using standard method")
            except Exception as e:
                print(f"Standard loading failed: {e}")
                # Method 2: Try loading with custom objects
                try:
                    self.model = tf.keras.models.load_model(
                        model_path, 
                        compile=False,
                        custom_objects=None
                    )
                    print("✓ Model loaded with compile=False")
                except Exception as e2:
                    print(f"Loading with compile=False failed: {e2}")
                    # Method 3: Try loading weights only (last resort)
                    try:
                        # Recreate model architecture first
                        base_model = tf.keras.applications.MobileNetV2(
                            input_shape=(224, 224, 3),
                            include_top=False,
                            weights=None
                        )
                        base_model.trainable = False
                        
                        inputs = tf.keras.Input(shape=(224, 224, 3))
                        x = base_model(inputs, training=False)
                        x = tf.keras.layers.GlobalAveragePooling2D()(x)
                        x = tf.keras.layers.Dropout(0.5)(x)
                        x = tf.keras.layers.Dense(256, activation='relu')(x)
                        x = tf.keras.layers.Dropout(0.5)(x)
                        outputs = tf.keras.layers.Dense(19, activation='softmax')(x)  # Update 19 with your actual class count
                        
                        self.model = tf.keras.Model(inputs=inputs, outputs=outputs)
                        self.model.load_weights(model_path)
                        print("✓ Model loaded using weights only")
                    except Exception as e3:
                        raise Exception(f"All loading methods failed: {e3}")
            
            # Load config
            with open(config_path, 'r') as f:
                config = json.load(f)
            
            self.class_names = config['class_names']
            self.confidence_threshold = config.get('confidence_threshold', 0.80)
            self.image_size = tuple(config.get('image_size', [224, 224]))
            
            # Compile the model if it wasn't compiled during loading
            if not hasattr(self.model, 'optimizer') or self.model.optimizer is None:
                self.model.compile(
                    optimizer='adam',
                    loss='categorical_crossentropy',
                    metrics=['accuracy']
                )
                print("✓ Model compiled")
            
            # Nutritional information database
            self.macros = {
    'bisi_bele_bath': {'calories': 320, 'protein': 8, 'carbs': 52, 'fat': 9, 'serving': '1 bowl (250g)'},
    'burger': {'calories': 540, 'protein': 25, 'carbs': 45, 'fat': 28, 'serving': '1 burger (220g)'},
    'chicken_65': {'calories': 280, 'protein': 22, 'carbs': 12, 'fat': 17, 'serving': '1 plate (150g)'},
    'chicken_biryani': {'calories': 450, 'protein': 20, 'carbs': 55, 'fat': 16, 'serving': '1 plate (300g)'},
    'chicken_curry': {'calories': 240, 'protein': 24, 'carbs': 8, 'fat': 13, 'serving': '1 bowl (200g)'},
    'curd_rice': {'calories': 180, 'protein': 5, 'carbs': 32, 'fat': 4, 'serving': '1 bowl (200g)'},
    'egg_omelette': {'calories': 154, 'protein': 13, 'carbs': 1, 'fat': 11, 'serving': '2 eggs (100g)'},
    'fish_curry': {'calories': 220, 'protein': 22, 'carbs': 7, 'fat': 12, 'serving': '1 bowl (200g)'},
    'fried_rice': {'calories': 330, 'protein': 8, 'carbs': 52, 'fat': 10, 'serving': '1 plate (250g)'},
    'grilled_chicken': {'calories': 165, 'protein': 31, 'carbs': 0, 'fat': 4, 'serving': '1 breast (100g)'},
    'idli': {'calories': 78, 'protein': 2, 'carbs': 15, 'fat': 1, 'serving': '2 idlis (100g)'},
    'lemon_rice': {'calories': 260, 'protein': 4, 'carbs': 48, 'fat': 6, 'serving': '1 plate (200g)'},
    'masala_dosa': {'calories': 220, 'protein': 5, 'carbs': 35, 'fat': 7, 'serving': '1 dosa (150g)'},
    'open_pudi_dosa': {'calories': 180, 'protein': 4, 'carbs': 28, 'fat': 6, 'serving': '1 dosa (120g)'},
    'palak_paneer': {'calories': 260, 'protein': 12, 'carbs': 10, 'fat': 19, 'serving': '1 bowl (200g)'},
    'paneer_butter_masala': {'calories': 340, 'protein': 14, 'carbs': 12, 'fat': 26, 'serving': '1 bowl (200g)'},
    'pizza': {'calories': 285, 'protein': 12, 'carbs': 36, 'fat': 10, 'serving': '1 slice (100g)'},
    'poori': {'calories': 296, 'protein': 5, 'carbs': 40, 'fat': 13, 'serving': '2 pooris (80g)'},
    'sambar_rice': {'calories': 240, 'protein': 6, 'carbs': 45, 'fat': 4, 'serving': '1 plate (250g)'},
    'set_dosa': {'calories': 140, 'protein': 3, 'carbs': 25, 'fat': 3, 'serving': '2 dosas (100g)'},
    'thatte_idli': {'calories': 95, 'protein': 3, 'carbs': 18, 'fat': 1, 'serving': '1 idli (120g)'},
    'upma': {'calories': 200, 'protein': 5, 'carbs': 35, 'fat': 5, 'serving': '1 bowl (200g)'},
    'vada': {'calories': 180, 'protein': 4, 'carbs': 20, 'fat': 9, 'serving': '2 vadas (80g)'},
    'vegetable_pulao': {'calories': 280, 'protein': 6, 'carbs': 48, 'fat': 7, 'serving': '1 plate (250g)'}
            }           
            print(f"✓ Food classifier loaded successfully!")
            print(f"✓ Number of classes: {len(self.class_names)}")
            print(f"✓ Classes: {self.class_names}")
            print(f"✓ Confidence threshold: {self.confidence_threshold}")
            
            # Test prediction with dummy data to verify model works
            test_input = np.random.random((1, 224, 224, 3))
            test_pred = self.model.predict(test_input, verbose=0)
            print(f"✓ Model test prediction successful - output shape: {test_pred.shape}")
            
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            import traceback
            traceback.print_exc()
            raise

    def preprocess_image(self, img_path):
        """Preprocess image for prediction"""
        img = image.load_img(img_path, target_size=self.image_size)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        # Normalize to [-1, 1] (same as training)
        img_array = (img_array / 127.5) - 1
        return img_array

    def predict(self, img_path):
        """Predict food from image"""
        try:
            # Preprocess
            img_array = self.preprocess_image(img_path)

            # Predict
            predictions = self.model.predict(img_array, verbose=0)

            # Get top prediction
            predicted_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_idx])
            predicted_class = self.class_names[predicted_idx]

            # Get top 3 predictions
            top_3_idx = np.argsort(predictions[0])[-3:][::-1]
            top_3 = [
                {
                    'name': self.class_names[idx],
                    'confidence': float(predictions[0][idx])
                }
                for idx in top_3_idx
            ]

            # Check confidence threshold
            if confidence >= self.confidence_threshold:
                result = {
                    'status': 'recognized',
                    'food': predicted_class,
                    'confidence': round(confidence * 100, 1),
                    'macros': self.macros.get(predicted_class, {
                        'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0, 'serving': '1 serving'
                    }),
                    'top_3': top_3
                }
            else:
                result = {
                    'status': 'unknown',
                    'message': 'Low confidence. Food not recognized.',
                    'best_guess': predicted_class,
                    'confidence': round(confidence * 100, 1),
                    'suggestion': 'Try taking a clearer photo with better lighting.',
                    'top_3': top_3
                }

            return result

        except Exception as e:
            return {
                'status': 'error',
                'error': f'Prediction failed: {str(e)}'
            }