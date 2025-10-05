import pandas as pd
import os

def verify_csv_files():
    """Verify CSV files have correct structure"""
    
    print("="*70)
    print("CSV DATA VERIFICATION")
    print("="*70)
    
    csv_files = [
        "data/exercises.csv",
        "data/nutrition.csv",
        "data/workout_plans.csv"
    ]
    
    for csv_file in csv_files:
        print(f"\n📄 Checking: {csv_file}")
        print("-"*70)
        
        if not os.path.exists(csv_file):
            print(f"❌ FILE NOT FOUND!")
            continue
        
        try:
            df = pd.read_csv(csv_file)
            print(f"✓ File loaded successfully")
            print(f"✓ Rows: {len(df)}")
            print(f"✓ Columns: {len(df.columns)}")
            print(f"\nColumn names:")
            for col in df.columns:
                print(f"  • {col}")
            
            # Show first row as sample
            print(f"\nSample data (first row):")
            for col in df.columns:
                value = df[col].iloc[0]
                # Truncate long values
                if isinstance(value, str) and len(value) > 50:
                    value = value[:50] + "..."
                print(f"  {col}: {value}")
            
            # Check for required columns based on file type
            if 'nutrition' in csv_file.lower():
                required = ['food_name', 'category', 'calories', 'protein_g', 'carbs_g', 'fat_g']
                missing = [col for col in required if col not in df.columns]
                if missing:
                    print(f"\n⚠️  Missing required columns: {missing}")
                else:
                    print(f"\n✓ All required columns present")
            
            elif 'exercise' in csv_file.lower():
                required = ['name', 'category', 'difficulty', 'equipment', 'description']
                missing = [col for col in required if col not in df.columns]
                if missing:
                    print(f"\n⚠️  Missing required columns: {missing}")
                else:
                    print(f"\n✓ All required columns present")
            
            elif 'workout' in csv_file.lower():
                required = ['plan_name', 'level', 'days_per_week', 'goal']
                missing = [col for col in required if col not in df.columns]
                if missing:
                    print(f"\n⚠️  Missing required columns: {missing}")
                else:
                    print(f"\n✓ All required columns present")
            
        except Exception as e:
            print(f"❌ Error reading file: {e}")
    
    print("\n" + "="*70)
    print("VERIFICATION COMPLETE")
    print("="*70)

if __name__ == "__main__":
    verify_csv_files()