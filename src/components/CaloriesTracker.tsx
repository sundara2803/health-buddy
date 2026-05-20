import { useState, useRef, useEffect } from 'react';
import type { CaloriesData, MealEntry } from '../types/health';
import ProgressBar from './ProgressBar';
import SectionCard from './SectionCard';
import './Trackers.css';

interface FoodItem {
  name: string; desc: string;
  per100g: { calories: number; protein: number; carbs: number; fat: number };
}

const FOOD_DB: FoodItem[] = [
  { name: 'Egg',              desc: 'Whole large egg, boiled or fried',         per100g: { calories: 155, protein: 13, carbs: 1,  fat: 11 } },
  { name: 'Chicken Breast',   desc: 'Skinless, cooked, lean protein',           per100g: { calories: 165, protein: 31, carbs: 0,  fat: 4  } },
  { name: 'Salmon',           desc: 'Atlantic salmon, rich in omega-3',         per100g: { calories: 208, protein: 20, carbs: 0,  fat: 13 } },
  { name: 'Tuna',             desc: 'Canned in water, very lean protein',       per100g: { calories: 116, protein: 26, carbs: 0,  fat: 1  } },
  { name: 'Brown Rice',       desc: 'Cooked, whole grain carbohydrate',         per100g: { calories: 112, protein: 3,  carbs: 23, fat: 1  } },
  { name: 'White Rice',       desc: 'Cooked, quick-digesting carbs',            per100g: { calories: 130, protein: 3,  carbs: 28, fat: 0  } },
  { name: 'Oatmeal',          desc: 'Cooked oats, high fibre breakfast',        per100g: { calories: 71,  protein: 2,  carbs: 12, fat: 1  } },
  { name: 'Banana',           desc: 'Medium ripe banana, natural energy',       per100g: { calories: 89,  protein: 1,  carbs: 23, fat: 0  } },
  { name: 'Apple',            desc: 'Medium fresh apple with skin',             per100g: { calories: 52,  protein: 0,  carbs: 14, fat: 0  } },
  { name: 'Greek Yogurt',     desc: 'Plain, non-fat, high protein dairy',       per100g: { calories: 59,  protein: 10, carbs: 4,  fat: 0  } },
  { name: 'Almonds',          desc: 'Raw almonds, healthy fats & protein',      per100g: { calories: 579, protein: 21, carbs: 22, fat: 50 } },
  { name: 'Avocado',          desc: 'Fresh, rich in monounsaturated fats',      per100g: { calories: 160, protein: 2,  carbs: 9,  fat: 15 } },
  { name: 'Whole Milk',       desc: 'Full-fat cow milk, calcium-rich',          per100g: { calories: 61,  protein: 3,  carbs: 5,  fat: 3  } },
  { name: 'Whole Wheat Bread',desc: 'Sliced bread, fibre and complex carbs',    per100g: { calories: 247, protein: 13, carbs: 41, fat: 4  } },
  { name: 'Pasta',            desc: 'Cooked, moderate-GI carbohydrate',         per100g: { calories: 131, protein: 5,  carbs: 25, fat: 1  } },
  { name: 'Baked Potato',     desc: 'Plain baked potato with skin',             per100g: { calories: 93,  protein: 2,  carbs: 21, fat: 0  } },
  { name: 'Broccoli',         desc: 'Steamed, low-calorie green vegetable',     per100g: { calories: 35,  protein: 2,  carbs: 7,  fat: 0  } },
  { name: 'Spinach',          desc: 'Raw leaves, iron and vitamin K',           per100g: { calories: 23,  protein: 3,  carbs: 4,  fat: 0  } },
  { name: 'Cheddar Cheese',   desc: 'Aged, high in protein and calcium',        per100g: { calories: 403, protein: 25, carbs: 1,  fat: 33 } },
  { name: 'Protein Shake',    desc: 'Whey protein powder, mixed with water',    per100g: { calories: 375, protein: 80, carbs: 10, fat: 6  } },
  { name: 'Peanut Butter',    desc: 'Natural, no added sugar, healthy fats',    per100g: { calories: 588, protein: 25, carbs: 20, fat: 50 } },
  { name: 'Orange Juice',     desc: 'Freshly squeezed, vitamin C boost',        per100g: { calories: 45,  protein: 1,  carbs: 10, fat: 0  } },
  { name: 'Cottage Cheese',   desc: 'Low-fat, slow-digesting protein',          per100g: { calories: 98,  protein: 11, carbs: 3,  fat: 4  } },
  { name: 'Lentils',          desc: 'Cooked, plant protein and fibre',          per100g: { calories: 116, protein: 9,  carbs: 20, fat: 0  } },
  { name: 'Quinoa',           desc: 'Cooked, complete plant protein grain',     per100g: { calories: 120, protein: 4,  carbs: 22, fat: 2  } },
  { name: 'Sweet Potato',     desc: 'Baked, beta-carotene and slow carbs',      per100g: { calories: 86,  protein: 2,  carbs: 20, fat: 0  } },
  { name: 'Beef (lean)',      desc: 'Lean ground beef, cooked',                 per100g: { calories: 215, protein: 26, carbs: 0,  fat: 12 } },
  { name: 'Tofu',             desc: 'Firm, plant-based protein',                per100g: { calories: 76,  protein: 8,  carbs: 2,  fat: 5  } },
  { name: 'Blueberries',      desc: 'Fresh, high in antioxidants',              per100g: { calories: 57,  protein: 1,  carbs: 14, fat: 0  } },
  { name: 'Olive Oil',        desc: 'Extra-virgin, heart-healthy fat',          per100g: { calories: 884, protein: 0,  carbs: 0,  fat: 100} },
];

const MEAL_ICONS: Record<MealEntry['mealType'], string> = {
  breakfast: '🌅', lunch: '🌞', dinner: '🌙', snack: '🍎',
};

const MEAL_TYPES: { label: string; value: MealEntry['mealType'] }[] = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch',     value: 'lunch'     },
  { label: 'Dinner',    value: 'dinner'    },
  { label: 'Snack',     value: 'snack'     },
];

interface Props {
  calories: CaloriesData;
  onAdd: (name: string, cals: number, protein: number, carbs: number, fat: number, type: MealEntry['mealType']) => void;
  onRemove: (id: string) => void;
}

export default function CaloriesTracker({ calories, onAdd, onRemove }: Props) {
  const [mealType, setMealType] = useState<MealEntry['mealType']>('breakfast');
  const [name,    setName]    = useState('');
  const [desc,    setDesc]    = useState('');
  const [weight,  setWeight]  = useState('');
  const [cals,    setCals]    = useState('');
  const [protein, setProtein] = useState('');
  const [carbs,   setCarbs]   = useState('');
  const [fat,     setFat]     = useState('');
  const [photo,   setPhoto]   = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSug,     setShowSug]     = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const wrapRef   = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const totalCal  = calories.meals.reduce((s, m) => s + m.calories, 0);
  const totalProt = calories.meals.reduce((s, m) => s + m.protein,  0);
  const totalCarb = calories.meals.reduce((s, m) => s + m.carbs,    0);
  const totalFat  = calories.meals.reduce((s, m) => s + m.fat,      0);

  const calPct  = Math.min(100, (totalCal  / calories.calorieGoal)  * 100);
  const protPct = Math.min(100, (totalProt / calories.proteinGoal)  * 100);
  const calColor = calPct > 105 ? '#f87171' : calPct > 80 ? '#4ade80' : '#fb923c';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setShowSug(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // When weight changes and a food is selected, recalculate macros
  useEffect(() => {
    if (!selectedFood || !weight) return;
    const g = parseFloat(weight);
    if (!g || g <= 0) return;
    const ratio = g / 100;
    const p = selectedFood.per100g;
    setCals(String(Math.round(p.calories * ratio)));
    setProtein(String(Math.round(p.protein * ratio)));
    setCarbs(String(Math.round(p.carbs * ratio)));
    setFat(String(Math.round(p.fat * ratio)));
  }, [weight, selectedFood]);

  const handleNameChange = (val: string) => {
    setName(val);
    setSelectedFood(null);
    if (val.length >= 2) {
      const q = val.toLowerCase();
      const matches = FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 6);
      setSuggestions(matches);
      setShowSug(matches.length > 0);
    } else {
      setShowSug(false);
    }
  };

  const selectFood = (food: FoodItem) => {
    setName(food.name);
    setDesc(food.desc);
    setSelectedFood(food);
    setShowSug(false);
    // Default serving 100g
    const w = weight || '100';
    setWeight(w);
    const ratio = parseFloat(w) / 100;
    const p = food.per100g;
    setCals(String(Math.round(p.calories * ratio)));
    setProtein(String(Math.round(p.protein * ratio)));
    setCarbs(String(Math.round(p.carbs * ratio)));
    setFat(String(Math.round(p.fat * ratio)));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const addMeal = () => {
    if (!name.trim() || !cals) return;
    onAdd(
      name.trim(),
      parseInt(cals)    || 0,
      parseInt(protein) || 0,
      parseInt(carbs)   || 0,
      parseInt(fat)     || 0,
      mealType,
    );
    setName(''); setDesc(''); setWeight(''); setCals('');
    setProtein(''); setCarbs(''); setFat('');
    setPhoto(null); setSelectedFood(null);
  };

  return (
    <SectionCard icon="🍎" title="Calories & Macros" badge={`${totalCal} / ${calories.calorieGoal} kcal`}>
      <ProgressBar value={calPct} color={calColor} />

      {/* Macro summary */}
      <div className="macro-summary">
        <div className="macro-summary-title">Today's Macros</div>
        <div className="macro-bar-row">
          <span className="macro-bar-label">💪 Protein</span>
          <div className="macro-bar-track">
            <div className="macro-bar-fill" style={{ width: `${protPct}%`, background: '#6c63ff' }} />
          </div>
          <span className="macro-bar-val">{totalProt}g / {calories.proteinGoal}g</span>
        </div>
        <div className="macro-bar-row">
          <span className="macro-bar-label">🌾 Carbs</span>
          <div className="macro-bar-track">
            <div className="macro-bar-fill"
              style={{ width: `${Math.min(100, (totalCarb / 260) * 100)}%`, background: '#fb923c' }} />
          </div>
          <span className="macro-bar-val">{totalCarb}g</span>
        </div>
        <div className="macro-bar-row">
          <span className="macro-bar-label">🥑 Fat</span>
          <div className="macro-bar-track">
            <div className="macro-bar-fill"
              style={{ width: `${Math.min(100, (totalFat / 65) * 100)}%`, background: '#4ade80' }} />
          </div>
          <span className="macro-bar-val">{totalFat}g</span>
        </div>
        {protPct >= 100 && (
          <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700, marginTop: 4 }}>
            ✅ Daily protein goal achieved!
          </div>
        )}
      </div>

      {/* Meal type */}
      <label className="field-label mt">Meal Type</label>
      <div className="chip-row">
        {MEAL_TYPES.map(m => (
          <button key={m.value} className={`chip ${mealType === m.value ? 'chip-on' : ''}`}
            onClick={() => setMealType(m.value)}>
            {MEAL_ICONS[m.value]} {m.label}
          </button>
        ))}
      </div>

      {/* Food search */}
      <div className="food-search-wrap" ref={wrapRef}>
        <input className="text-input" value={name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder="Search food (e.g. chicken, rice)…" autoComplete="off" />
        {showSug && (
          <div className="food-suggestions">
            {suggestions.map(f => (
              <div key={f.name} className="food-suggestion-item" onMouseDown={() => selectFood(f)}>
                <span>{f.name}</span>
                <span className="food-suggestion-macros">
                  {f.per100g.calories} kcal · P{f.per100g.protein} C{f.per100g.carbs} F{f.per100g.fat} /100g
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {desc && (
        <p style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>{desc}</p>
      )}

      {/* Weight + macros row */}
      <div className="macro-row" style={{ marginTop: 8 }}>
        <div className="macro-field">
          <label>Weight (g)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
            placeholder="g" min="1" />
        </div>
        <div className="macro-field">
          <label>Calories</label>
          <input type="number" value={cals} onChange={e => setCals(e.target.value)}
            placeholder="kcal" min="0" />
        </div>
        <div className="macro-field">
          <label>Protein</label>
          <input type="number" value={protein} onChange={e => setProtein(e.target.value)}
            placeholder="g" min="0" />
        </div>
        <div className="macro-field">
          <label>Carbs</label>
          <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)}
            placeholder="g" min="0" />
        </div>
        <div className="macro-field">
          <label>Fat</label>
          <input type="number" value={fat} onChange={e => setFat(e.target.value)}
            placeholder="g" min="0" />
        </div>
      </div>

      {/* Photo upload */}
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={handlePhoto} />
      {!photo ? (
        <button className="photo-upload-btn" onClick={() => fileRef.current?.click()}>
          📷 Add food photo (optional)
        </button>
      ) : (
        <div className="photo-preview-wrap">
          <img src={photo} className="photo-preview" alt="food" />
          <button className="photo-remove-btn" onClick={() => setPhoto(null)}>✕</button>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button className="pill-btn primary" onClick={addMeal}
          disabled={!name.trim() || !cals}>Add Meal</button>
      </div>

      {/* Meals list */}
      {calories.meals.length > 0 && (
        <div className="meals-list">
          {calories.meals.map(m => (
            <div key={m.id} className="meal-item">
              {(m as MealEntry & { photo?: string }).photo
                ? <img src={(m as MealEntry & { photo?: string }).photo} className="meal-thumb" alt={m.name} />
                : <span className="meal-icon">{MEAL_ICONS[m.mealType]}</span>
              }
              <div className="meal-info">
                <span className="meal-name">{m.name}</span>
                <span className="meal-meta">
                  <span>{m.time}</span>
                  {m.protein > 0 && <span>P {m.protein}g</span>}
                  {m.carbs   > 0 && <span>C {m.carbs}g</span>}
                  {m.fat     > 0 && <span>F {m.fat}g</span>}
                </span>
              </div>
              <span className="meal-cals">{m.calories} kcal</span>
              <button className="delete-btn" onClick={() => onRemove(m.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
