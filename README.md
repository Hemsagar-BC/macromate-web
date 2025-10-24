# 🏋️‍♂️ MacroMate - AI Fitness Tracker  

## 🧩 1. About This Project  

**MacroMate** is a full-stack AI fitness platform that blends **Machine Learning**, **Deep Learning**, and **modern web technologies** to help users track their nutrition, predict body fat percentage, and log daily progress.  
Built with **React + Flask**, MacroMate demonstrates **frontend development**, **AI integration**, and **API design** skills.  

**Key Highlights:**
- 🤖 **Ridge Regression** body fat predictor with **±3.133% MAE**
- 📸 **Fine-tuned MobileNetV2** recognizing **20+ Indian dishes**
- 🕷️ **Custom Dataset**: Web-scraped 1000+ food images using Python
- ⚙️ **Flask-based**: REST API for seamless ML/DL integration  
- 📊 Interactive UI with Recharts, Tailwind CSS, and Framer Motion
- 💾 LocalStorage-based data persistence

---

## ⚡ 2. Features  

### 🎯 Smart Calculators  
- Calorie & Macro Calculator using Mifflin-St Jeor BMR formula  
- Goal-based macro targets for bulking, cutting, and maintenance  

### 🤖 AI-Powered Tools  
- Body fat prediction using Ridge Regression  
- Food image recognition via MobileNetV2 fine-tuning  
- Confidence threshold filtering for accurate predictions  

### 📊 Progress Tracking  
- Interactive weight & body fat charts  
- Daily food logging with real-time macro updates  
- LocalStorage-based data persistence  

---

## 🧠 3. How ML & DL Models Work  

### 🧩 Body Fat Predictor (Ridge Regression)

**Training Process:**
```python
# Model Selection: Tested 4 algorithms
Linear Regression:     MAE = 3.899
Ridge Regression:      MAE = 3.133  ← Best
Lasso Regression:      MAE = 3.842
Random Forest:         MAE = 4.156

# Final Model Configuration
Ridge(alpha=1.0)
Features: ['Age', 'Weight', 'Height', 'Neck', 'Abdomen', 'Forearm', 'Wrist']
Training: 80/20 split with random_state=2
```
- Ridge Regression outperformed Linear, Lasso & Random Forest
- L2 regularization improved stability on small datasets
- Fast inference (~2ms on CPU)
  
**Model Export:**
```python
pickle.dump(final_model, open('bodyfat.pkl', 'wb'))
```

### 🍱 Food Image Classifier (MobileNetV2)
```
Input (224×224×3)
↓
MobileNetV2 (frozen base)
↓
GlobalAveragePooling2D
↓
Dense(256, ReLU, L2=0.01) 
↓
Dense(20, Softmax)
```

**Training Configuration:**
```python
# Initial Training (Transfer Learning)
- Base Model: MobileNetV2 (frozen)
- Optimizer: Adam(lr=0.0005)
- Batch Size: 32
- Data Split: 70% train, 15% val, 15% test
- Augmentation: RandomFlip, RandomRotation(0.2), RandomZoom(0.2)

# Fine-Tuning Phase
- Unfroze: Last 40 layers
- Optimizer: Adam(lr=0.0001)  # 5x lower
- Epochs: 20 additional
- Result: +5-10% accuracy boost
```


## 🧰 4. Tech Stack  

| Tool / Library | Purpose |
|----------------|----------|
| ⚛️ **React 18 + Vite** | Frontend framework with fast HMR for modern UI development |
| 🎨 **Tailwind CSS** | Utility-first CSS framework for responsive, clean styling |
| 🎞️ **Framer Motion** | Animations and transitions for interactive UI components |
| 📊 **Recharts** | Data visualization for progress and analytics |
| 🐍 **Flask 3.x** | Lightweight backend framework for REST API development |
| 🤖 **TensorFlow 2.15** | Deep learning model inference (MobileNetV2 fine-tuning) |
| 📈 **scikit-learn 1.3** | Machine learning library for Ridge Regression model |
| 🧩 **NumPy & Pandas** | Data manipulation and preprocessing |
| 🖼️ **Pillow** | Image preprocessing for food recognition model |
| 🔒 **Flask-CORS** | Cross-origin resource sharing for frontend-backend communication |
| ☁️ **Vercel** | Frontend deployment (React) |
| 🧱 **Render** | Backend deployment (Flask API) |
| 💾 **LocalStorage** | Client-side data persistence for progress tracking |

## 📂5. Project Structure  
```
demo/
├── backend/
│ ├── app.py # Flask backend entry point
│ ├── food_predictor.py # Food recognition using ML model
│ ├── bodyfat.pkl # Trained model
│ ├── macros.json # Nutrition data reference file
│ ├── model.h5 # Trained TensorFlow model
│ ├── config.json # Model and API configuration
│ ├── requirements.txt # Python dependencies
│ ├── Dockerfile # Docker build configuration
│ ├── Procfile # Render deployment setup
│ ├── runtime.txt # Python version info
│
├── frontend/
│ ├── src/
│ │ ├── assets/ #static files
│ │ ├── components/ # Reusable UI components (Navbar, Footer, etc.)
│ │ ├── pages/ # Main feature pages (Calculator, Food, Dashboard)
│ │ ├── constants/ # Shared constants and config
│ │ ├── App.jsx # Root React component
│ │ ├── main.jsx # React DOM entry point
│ │ └── index.css # Global Tailwind CSS styles
│ ├── package.json # Frontend dependencies
│ └── vite.config.js # Vite configuration
│
├── .gitignore
└── README.md
```
## 💻 6. For Cloning & Running Locally

### 🧩 Prerequisites
```
Node.js >= 18.x  
Python >= 3.9
```
### Frontend Setup
```
git clone https://github.com/Hemsagar-BC/macromate-web.git
cd frontend
npm install
npm run dev  # Runs at http://localhost:5173
```
### Backend Setup
```
cd backend
python -m venv venv   
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py  # Runs at http://localhost:8080
```

