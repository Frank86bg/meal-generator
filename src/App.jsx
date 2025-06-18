import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Calculator, Copy, Plus, Minus, X, RefreshCw } from 'lucide-react';

const nutritionDb = {
  // Colazione - Carboidrati (per 100g)
  'avena': { kcal: 370, prot: 13.7, carb: 58.0, fat: 7.0, portion: 'avena/cereali', unit: 'g' },
  'fette_biscottate': { kcal: 350, prot: 10.0, carb: 65.0, fat: 7.0, portion: 'fette biscottate', unit: 'pz', perPiece: 8.75 },
  'pane': { kcal: 270, prot: 8.0, carb: 56.0, fat: 2.0, portion: 'pane', unit: 'g' },
  'frutta': { kcal: 80, prot: 1.0, carb: 18.0, fat: 0.3, portion: 'frutta', unit: 'g' },
  'purea_frutta': { kcal: 50, prot: 0.5, carb: 12.0, fat: 0.1, portion: 'purea frutta', unit: 'g' },
  'marmellata_miele': { kcal: 260, prot: 0.3, carb: 65.0, fat: 0.1, portion: 'marmellata/miele', unit: 'cucchiai', perPiece: 20 },
  'gel_maltodestrine': { kcal: 110, prot: 0, carb: 27.0, fat: 0, portion: 'gel maltodestrine', unit: 'bustina', perPiece: 30 },
  'frutta_essiccata': { kcal: 250, prot: 2.5, carb: 60.0, fat: 0.5, portion: 'frutta essiccata', unit: 'g' },
  'barretta_proteica': { kcal: 180, prot: 20.0, carb: 15.0, fat: 6.0, portion: 'barretta proteica', unit: 'barretta', perPiece: 45 },

  // EMERGENZA - Pasto completo
  'pranzo_emergenza': { 
    kcal: 405, prot: 25.0, carb: 46.0, fat: 17.5,
    portion: 'Pasto completo emergenza',
    unit: 'porzione',
    isComposite: true,
    displayAmount: '1 barretta + 1 banana + 20g frutta secca'
  },

  // LEGUMI + GRANA composto
  'legumi_grana': {
    kcal: 190, prot: 11.8, carb: 16.0, fat: 9.8,
    portion: 'legumi + grana',
    unit: 'porzione', 
    isComposite: true,
    displayAmount: '100g legumi + 20g grana'
  },

  // Colazione - Proteine COMPOSTE - valori calcolati per la porzione completa
  'yogurt_proteico': { kcal: 180, prot: 22.0, carb: 8.0, fat: 6.0, portion: 'yogurt proteico', unit: 'vasetto', perPiece: 100 },
  'proteine_polvere': { 
    kcal: 184, prot: 26.8, carb: 11.6, fat: 1.9,
    portion: 'proteine + latte', 
    unit: 'porzione',
    isComposite: true,
    displayAmount: '25g proteine + 200ml latte'
  },
  'yogurt_greco': { kcal: 95, prot: 9.0, carb: 4.5, fat: 4.5, portion: 'yogurt greco', unit: 'g' },
  'albumi': { 
    kcal: 118, prot: 22.5, carb: 1.25, fat: 10.5,
    portion: 'albumi + olio',
    unit: 'porzione',
    isComposite: true,
    displayAmount: '250ml albumi + 10ml olio'
  },
  'uova': { kcal: 155, prot: 13.0, carb: 1.0, fat: 11.0, portion: 'uova', unit: 'uova', perPiece: 60 },
  'bresaola': { kcal: 150, prot: 33.0, carb: 0.8, fat: 2.0, portion: 'bresaola/fesa', unit: 'g' },
  'latte_ps': { kcal: 46, prot: 3.3, carb: 5.0, fat: 1.6, portion: 'latte parzialmente scremato', unit: 'ml' },
  'latte_proteine': { 
    kcal: 129, prot: 18.3, carb: 7.5, fat: 2.4,
    portion: 'latte + proteine',
    unit: 'porzione',
    isComposite: true,
    displayAmount: '150ml latte + 15g proteine'
  },
  'ricotta_proteica': { kcal: 130, prot: 11.0, carb: 4.0, fat: 8.0, portion: 'ricotta light/proteica', unit: 'g' },

  // Colazione - Grassi (per 100g)  
  'frutta_secca': { kcal: 600, prot: 20.0, carb: 20.0, fat: 53.0, portion: 'frutta secca', unit: 'g' },
  'cioccolato_fondente': { kcal: 567, prot: 10.0, carb: 33.0, fat: 43.0, portion: 'cioccolato fondente', unit: 'g' },
  'farina_cocco': { kcal: 667, prot: 13.3, carb: 60.0, fat: 43.3, portion: 'farina cocco', unit: 'g' },
  'formaggio_fette': { kcal: 320, prot: 24.0, carb: 4.0, fat: 24.0, portion: 'formaggio fette', unit: 'fette', perPiece: 25 },
  'avocado': { kcal: 160, prot: 2.0, carb: 8.5, fat: 14.7, portion: 'avocado', unit: 'g' },
  'semi': { kcal: 567, prot: 23.3, carb: 26.7, fat: 43.3, portion: 'semi', unit: 'g' },
  'olive': { kcal: 150, prot: 1.5, carb: 3.0, fat: 15.0, portion: 'olive piccole', unit: 'pz', perPiece: 3 },

  // Pranzo/Cena - Carboidrati (per 100g crudi)
  'riso': { kcal: 360, prot: 7.0, carb: 77.0, fat: 0.7, portion: 'riso/pasta (CRUDO)', unit: 'g' },
  'gnocchi': { kcal: 150, prot: 4.0, carb: 30.0, fat: 1.0, portion: 'gnocchi', unit: 'g' },
  'cereali_integrali': { kcal: 336, prot: 7.5, carb: 70.0, fat: 2.1, portion: 'cereali integrali (CRUDO)', unit: 'g' },
  'legumi_cotti': { kcal: 80, prot: 4.0, carb: 16.0, fat: 0.3, portion: 'legumi/patate (COTTI)', unit: 'g' },
  'patate_cotte': { kcal: 80, prot: 2.0, carb: 18.0, fat: 0.1, portion: 'patate (COTTE)', unit: 'g' },
  'wasa': { kcal: 350, prot: 10.0, carb: 70.0, fat: 3.3, portion: 'wasa/gallette', unit: 'pz', perPiece: 10 },

  // Pranzo/Cena - Proteine (per 100g crudi)
  'pesce_magro': { kcal: 100, prot: 20.0, carb: 0, fat: 2.0, portion: 'pesce magro (CRUDO)', unit: 'g' },
  'carne_magra': { kcal: 133, prot: 20.0, carb: 0, fat: 5.3, portion: 'carne magra (CRUDA)', unit: 'g' },
  'polpo': { kcal: 69, prot: 14.3, carb: 1.1, fat: 0.9, portion: 'polpo/seppia (CRUDO)', unit: 'g' },
  'tonno_naturale': { kcal: 133, prot: 29.0, carb: 0, fat: 1.1, portion: 'tonno naturale', unit: 'g' },
  'legumi_proteici': { kcal: 120, prot: 8.0, carb: 16.0, fat: 1.0, portion: 'legumi (COTTI)', unit: 'g' },
  'formaggio_proteico': { kcal: 120, prot: 16.0, carb: 4.0, fat: 4.0, portion: 'formaggio proteico', unit: 'g' },
  'hamburger_vegetale': { kcal: 180, prot: 12.0, carb: 8.0, fat: 12.0, portion: 'hamburger vegetale (COTTO)', unit: 'g' },
  'pesce_grasso': { kcal: 164, prot: 18.2, carb: 0, fat: 10.0, portion: 'pesce grasso (CRUDO)', unit: 'g' },
  'mozzarella': { kcal: 227, prot: 16.4, carb: 2.7, fat: 17.3, portion: 'mozzarella/feta', unit: 'g' },

  // Pranzo/Cena - Grassi (per 100g)
  'olio_evo': { kcal: 900, prot: 0, carb: 0, fat: 100.0, portion: 'olio extravergine', unit: 'g' },
  'grana': { kcal: 390, prot: 34.0, carb: 0, fat: 29.0, portion: 'grana/emmenthal', unit: 'g' },

  // Verdure (per 100g)
  'verdure_verdi': { kcal: 17, prot: 1.3, carb: 2.7, fat: 0.1, portion: 'verdure verdi/bianche', unit: 'g' },
  'verdure_rosse': { kcal: 23, prot: 1.7, carb: 4.0, fat: 0.2, portion: 'verdure rosse/arancio', unit: 'g' }
};

const mealConfigsByDayType = {
  riposo: {
    colazione: {
      carboidrati: [
        { foodKey: 'avena', minAmount: 30, maxAmount: 30, suggestedAmount: 30 },
        { foodKey: 'fette_biscottate', minAmount: 3, maxAmount: 3, suggestedAmount: 3 },
        { foodKey: 'frutta', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'purea_frutta', minAmount: 200, maxAmount: 200, suggestedAmount: 200 }
      ],
      latte: [
        { foodKey: 'latte_ps', minAmount: 200, maxAmount: 250, suggestedAmount: 225 }
      ],
      proteine: [
        { foodKey: 'yogurt_proteico', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'yogurt_greco', minAmount: 150, maxAmount: 150, suggestedAmount: 150 },
        { foodKey: 'albumi', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'uova', minAmount: 1, maxAmount: 2, suggestedAmount: 1 },
        { foodKey: 'ricotta_proteica', minAmount: 100, maxAmount: 100, suggestedAmount: 100 }
      ],
      grassi: [
        { foodKey: 'frutta_secca', minAmount: 15, maxAmount: 15, suggestedAmount: 15 },
        { foodKey: 'cioccolato_fondente', minAmount: 15, maxAmount: 15, suggestedAmount: 15 },
        { foodKey: 'formaggio_fette', minAmount: 2, maxAmount: 2, suggestedAmount: 2 },
        { foodKey: 'avocado', minAmount: 15, maxAmount: 15, suggestedAmount: 15 }
      ]
    },
    spuntino_mattina: {
      carboidrati: [
        { foodKey: 'purea_frutta', minAmount: 100, maxAmount: 100, suggestedAmount: 100 }
      ]
    },
    pranzo: {
      carboidrati_single: [
        { foodKey: 'wasa', minAmount: 3, maxAmount: 5, suggestedAmount: 4 },
        { foodKey: 'patate_cotte', minAmount: 150, maxAmount: 150, suggestedAmount: 150 },
        { foodKey: 'frutta', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'pane', minAmount: 50, maxAmount: 60, suggestedAmount: 55 }
      ],
      proteine: [
        { foodKey: 'pesce_magro', minAmount: 150, maxAmount: 200, suggestedAmount: 175 },
        { foodKey: 'carne_magra', minAmount: 150, maxAmount: 200, suggestedAmount: 175 },
        { foodKey: 'polpo', minAmount: 150, maxAmount: 250, suggestedAmount: 200 },
        { foodKey: 'tonno_naturale', minAmount: 100, maxAmount: 150, suggestedAmount: 125 },
        { foodKey: 'yogurt_proteico', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'uova', minAmount: 3, maxAmount: 3, suggestedAmount: 3 },
        { foodKey: 'legumi_grana', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'hamburger_vegetale', minAmount: 100, maxAmount: 100, suggestedAmount: 100 },
        { foodKey: 'pesce_grasso', minAmount: 100, maxAmount: 150, suggestedAmount: 125 },
        { foodKey: 'bresaola', minAmount: 80, maxAmount: 110, suggestedAmount: 95 },
        { foodKey: 'formaggio_proteico', minAmount: 100, maxAmount: 150, suggestedAmount: 125 }
      ],
      grassi: [
        { foodKey: 'olio_evo', minAmount: 10, maxAmount: 10, suggestedAmount: 10 },
        { foodKey: 'frutta_secca', minAmount: 20, maxAmount: 20, suggestedAmount: 20 },
        { foodKey: 'cioccolato_fondente', minAmount: 20, maxAmount: 20, suggestedAmount: 20 },
        { foodKey: 'avocado', minAmount: 60, maxAmount: 70, suggestedAmount: 65 },
        { foodKey: 'olive', minAmount: 15, maxAmount: 20, suggestedAmount: 17 }
      ],
      verdure: [
        { foodKey: 'verdure_verdi', minAmount: 150, maxAmount: 300, suggestedAmount: 200 },
        { foodKey: 'verdure_rosse', minAmount: 150, maxAmount: 300, suggestedAmount: 200 }
      ],
      emergenza: [
        { foodKey: 'pranzo_emergenza', minAmount: 1, maxAmount: 1, suggestedAmount: 1 }
      ]
    },
    cena: {
      carboidrati_single: [
        { foodKey: 'riso', minAmount: 70, maxAmount: 80, suggestedAmount: 75 },
        { foodKey: 'pane', minAmount: 100, maxAmount: 120, suggestedAmount: 110 },
        { foodKey: 'gnocchi', minAmount: 150, maxAmount: 150, suggestedAmount: 150 }
      ],
      carboidrati_multiple: [
        { foodKey: 'wasa', minAmount: 3, maxAmount: 5, suggestedAmount: 4 },
        { foodKey: 'patate_cotte', minAmount: 150, maxAmount: 150, suggestedAmount: 150 },
        { foodKey: 'frutta', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'pane', minAmount: 50, maxAmount: 60, suggestedAmount: 55 }
      ],
      proteine: [
        { foodKey: 'pesce_magro', minAmount: 150, maxAmount: 200, suggestedAmount: 175 },
        { foodKey: 'carne_magra', minAmount: 150, maxAmount: 200, suggestedAmount: 175 },
        { foodKey: 'polpo', minAmount: 150, maxAmount: 250, suggestedAmount: 200 },
        { foodKey: 'tonno_naturale', minAmount: 100, maxAmount: 150, suggestedAmount: 125 },
        { foodKey: 'uova', minAmount: 3, maxAmount: 3, suggestedAmount: 3 },
        { foodKey: 'legumi_grana', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'hamburger_vegetale', minAmount: 100, maxAmount: 100, suggestedAmount: 100 },
        { foodKey: 'pesce_grasso', minAmount: 100, maxAmount: 150, suggestedAmount: 125 },
        { foodKey: 'bresaola', minAmount: 80, maxAmount: 110, suggestedAmount: 95 },
        { foodKey: 'formaggio_proteico', minAmount: 100, maxAmount: 150, suggestedAmount: 125 }
      ],
      grassi: [
        { foodKey: 'olio_evo', minAmount: 10, maxAmount: 10, suggestedAmount: 10 },
        { foodKey: 'frutta_secca', minAmount: 20, maxAmount: 20, suggestedAmount: 20 },
        { foodKey: 'cioccolato_fondente', minAmount: 20, maxAmount: 20, suggestedAmount: 20 },
        { foodKey: 'avocado', minAmount: 60, maxAmount: 70, suggestedAmount: 65 },
        { foodKey: 'olive', minAmount: 15, maxAmount: 20, suggestedAmount: 17 }
      ],
      verdure: [
        { foodKey: 'verdure_verdi', minAmount: 150, maxAmount: 300, suggestedAmount: 200 },
        { foodKey: 'verdure_rosse', minAmount: 150, maxAmount: 300, suggestedAmount: 200 }
      ]
    },
    dopo_cena: {
      grassi: [
        { foodKey: 'cioccolato_fondente', minAmount: 10, maxAmount: 20, suggestedAmount: 15 }
      ]
    }
  },
  allenamento: {
    pre_allenamento: {
      carboidrati: [
        { foodKey: 'riso', minAmount: 70, maxAmount: 80, suggestedAmount: 75 },
        { foodKey: 'pane', minAmount: 100, maxAmount: 120, suggestedAmount: 110 },
        { foodKey: 'wasa', minAmount: 3, maxAmount: 5, suggestedAmount: 4 }
      ],
      proteine: [
        { foodKey: 'yogurt_proteico', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'yogurt_greco', minAmount: 150, maxAmount: 150, suggestedAmount: 150 },
        { foodKey: 'uova', minAmount: 2, maxAmount: 2, suggestedAmount: 2 },
        { foodKey: 'bresaola', minAmount: 60, maxAmount: 60, suggestedAmount: 60 },
        { foodKey: 'ricotta_proteica', minAmount: 150, maxAmount: 200, suggestedAmount: 175 },
        { foodKey: 'tonno_naturale', minAmount: 80, maxAmount: 120, suggestedAmount: 100 }
      ],
      grassi: [
        { foodKey: 'olio_evo', minAmount: 5, maxAmount: 10, suggestedAmount: 7 },
        { foodKey: 'olive', minAmount: 10, maxAmount: 15, suggestedAmount: 12 }
      ]
    },
    durante_allenamento: {
      carboidrati: [
        { foodKey: 'gel_maltodestrine', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'frutta_essiccata', minAmount: 30, maxAmount: 30, suggestedAmount: 30 }
      ]
    },
    post_allenamento: {
      carboidrati: [
        { foodKey: 'avena', minAmount: 30, maxAmount: 30, suggestedAmount: 30 },
        { foodKey: 'fette_biscottate', minAmount: 3, maxAmount: 4, suggestedAmount: 3 },
        { foodKey: 'purea_frutta', minAmount: 200, maxAmount: 200, suggestedAmount: 200 }
      ],
      proteine: [
        { foodKey: 'yogurt_proteico', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'yogurt_greco', minAmount: 150, maxAmount: 150, suggestedAmount: 150 },
        { foodKey: 'bresaola', minAmount: 40, maxAmount: 50, suggestedAmount: 45 },
        { foodKey: 'latte_ps', minAmount: 250, maxAmount: 250, suggestedAmount: 250 },
        { foodKey: 'latte_proteine', minAmount: 1, maxAmount: 1, suggestedAmount: 1 }
      ],
      grassi: [
        { foodKey: 'frutta_secca', minAmount: 15, maxAmount: 15, suggestedAmount: 15 },
        { foodKey: 'cioccolato_fondente', minAmount: 15, maxAmount: 15, suggestedAmount: 15 },
        { foodKey: 'formaggio_fette', minAmount: 2, maxAmount: 2, suggestedAmount: 2 },
        { foodKey: 'avocado', minAmount: 15, maxAmount: 15, suggestedAmount: 15 }
      ]
    }
  },
  camminata: {
    colazione: {
      carboidrati: [
        { foodKey: 'avena', minAmount: 50, maxAmount: 60, suggestedAmount: 55 },
        { foodKey: 'fette_biscottate', minAmount: 6, maxAmount: 8, suggestedAmount: 7 },
        { foodKey: 'pane', minAmount: 80, maxAmount: 80, suggestedAmount: 80 },
        { foodKey: 'frutta', minAmount: 2, maxAmount: 2, suggestedAmount: 2 }
      ],
      marmellata: [
        { foodKey: 'marmellata_miele', minAmount: 2, maxAmount: 2, suggestedAmount: 2 }
      ],
      latte: [
        { foodKey: 'latte_ps', minAmount: 200, maxAmount: 250, suggestedAmount: 225 }
      ],
      proteine: [
        { foodKey: 'yogurt_proteico', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'yogurt_greco', minAmount: 150, maxAmount: 150, suggestedAmount: 150 },
        { foodKey: 'albumi', minAmount: 1, maxAmount: 1, suggestedAmount: 1 },
        { foodKey: 'uova', minAmount: 1, maxAmount: 2, suggestedAmount: 1 },
        { foodKey: 'ricotta_proteica', minAmount: 100, maxAmount: 100, suggestedAmount: 100 }
      ],
      grassi: [
        { foodKey: 'frutta_secca', minAmount: 15, maxAmount: 15, suggestedAmount: 15 },
        { foodKey: 'cioccolato_fondente', minAmount: 15, maxAmount: 15, suggestedAmount: 15 },
        { foodKey: 'formaggio_fette', minAmount: 2, maxAmount: 2, suggestedAmount: 2 },
        { foodKey: 'avocado', minAmount: 15, maxAmount: 15, suggestedAmount: 15 }
      ]
    }
  }
};

const getMealOptions = (dayType, mealType) => {
  if (dayType === 'allenamento' && !mealConfigsByDayType.allenamento[mealType]) {
    return mealConfigsByDayType.riposo[mealType] || {};
  }
  
  if (dayType === 'camminata' && !mealConfigsByDayType.camminata[mealType]) {
    return mealConfigsByDayType.riposo[mealType] || {};
  }
  
  return mealConfigsByDayType[dayType]?.[mealType] || {};
};

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const MealGenerator = () => {
  const [dayType, setDayType] = useState('riposo');
  const [lunchMode, setLunchMode] = useState('standard');
  const [meals, setMeals] = useState({
    colazione: { carboidrati: [], proteine: [], grassi: [], latte: [], custom: [] },
    spuntino_mattina: { carboidrati: [], custom: [] },
    pranzo: { carboidrati: [], proteine: [], grassi: [], verdure: [], emergenza: [], custom: [] },
    pre_allenamento: { carboidrati: [], proteine: [], grassi: [], custom: [] },
    durante_allenamento: { carboidrati: [], custom: [] },
    post_allenamento: { carboidrati: [], proteine: [], grassi: [], custom: [] },
    cena: { carboidrati: [], proteine: [], grassi: [], verdure: [], custom: [] },
    dopo_cena: { grassi: [], custom: [] },
    spuntini: { carboidrati: [], proteine: [], custom: [] }
  });

  const [deletedItems, setDeletedItems] = useState({
    colazione: [], spuntino_mattina: [], pranzo: [], pre_allenamento: [], 
    durante_allenamento: [], post_allenamento: [], cena: [], dopo_cena: [], spuntini: []
  });

  const [totals, setTotals] = useState({ kcal: 0, carb: 0, prot: 0, fat: 0 });
  const [showCustomFood, setShowCustomFood] = useState(false);
  const [customFoodMeal, setCustomFoodMeal] = useState('');
  const [customFoodCategory, setCustomFoodCategory] = useState('');
  const [newCustomFood, setNewCustomFood] = useState({
    name: '', kcal: '', carb: '', prot: '', fat: '', amount: '', unit: 'g'
  });

  const toggleCarbMode = (mealType) => {
    const currentCarbs = meals[mealType]?.carboidrati || [];
    const isCurrentlyMultiple = currentCarbs.length > 1;
    const mealOptions = getMealOptions(dayType, mealType);

    if (isCurrentlyMultiple) {
      const randomSingle = getRandomItem(mealOptions.carboidrati_single || []);
      if (randomSingle) {
        const singleCarb = {
          id: Date.now(),
          foodKey: randomSingle.foodKey,
          minAmount: randomSingle.minAmount,
          maxAmount: randomSingle.maxAmount,
          suggestedAmount: randomSingle.suggestedAmount,
          currentAmount: null,
          isMultiple: false
        };
        
        setMeals(prev => ({
          ...prev,
          [mealType]: {
            ...prev[mealType],
            carboidrati: [singleCarb]
          }
        }));
      }
    } else {
      const availableOptions = mealOptions.carboidrati_multiple || [];
      if (availableOptions.length >= 2) {
        const first = getRandomItem(availableOptions);
        const remaining = availableOptions.filter(opt => opt.foodKey !== first.foodKey);
        const second = getRandomItem(remaining);
        
        const multipleCarbs = [
          {
            id: Date.now(),
            foodKey: first.foodKey,
            minAmount: first.minAmount,
            maxAmount: first.maxAmount,
            suggestedAmount: first.suggestedAmount,
            currentAmount: null,
            isMultiple: true,
            groupId: Date.now()
          },
          {
            id: Date.now() + 1,
            foodKey: second.foodKey,
            minAmount: second.minAmount,
            maxAmount: second.maxAmount,
            suggestedAmount: second.suggestedAmount,
            currentAmount: null,
            isMultiple: true,
            groupId: Date.now()
          }
        ];
        
        setMeals(prev => ({
          ...prev,
          [mealType]: {
            ...prev[mealType],
            carboidrati: multipleCarbs
          }
        }));
      }
    }
  };

  const generateRandomMeals = () => {
    const newMeals = {};
    const baseMeals = ['colazione', 'pranzo', 'cena'];
    const mealsByDayType = {
      riposo: ['spuntino_mattina', 'dopo_cena'],
      allenamento: ['spuntino_mattina', 'pre_allenamento', 'durante_allenamento', 'post_allenamento'],
      camminata: ['spuntino_mattina', 'dopo_cena']
    };
    
    const allMealsForDay = [...baseMeals, ...mealsByDayType[dayType]];
    
    allMealsForDay.forEach(mealType => {
      const mealOptions = getMealOptions(dayType, mealType);
      newMeals[mealType] = {};
      
      Object.keys(mealOptions).forEach(configCategory => {
        const options = mealOptions[configCategory];
        if (options && options.length > 0) {
          let targetCategory = configCategory;
          
          if (configCategory === 'carboidrati_single' || configCategory === 'carboidrati_multiple') {
            targetCategory = 'carboidrati';
            
            if (!newMeals[mealType][targetCategory]) {
              const selectedOption = getRandomItem(options);
              newMeals[mealType][targetCategory] = [{
                id: Date.now() + Math.random(),
                ...selectedOption,
                isMultiple: false
              }];
            }
          } else {
            const selectedOption = getRandomItem(options);
            newMeals[mealType][targetCategory] = [{
              id: Date.now() + Math.random(),
              ...selectedOption
            }];
          }
        }
      });
      
      if (mealType === 'pranzo' || mealType === 'cena') {
        const requiredCategories = ['carboidrati', 'proteine', 'grassi', 'verdure'];
        if (mealType === 'pranzo') {
          requiredCategories.push('emergenza');
        }
        requiredCategories.forEach(category => {
          if (!newMeals[mealType][category]) {
            newMeals[mealType][category] = [];
          }
        });
      }
      
      newMeals[mealType].custom = [];
    });

    setMeals(newMeals);
  };

  const generateRandomMeal = (mealType) => {
    const mealOptions = getMealOptions(dayType, mealType);
    const newMeal = { ...(meals[mealType] || {}) };
    
    Object.keys(newMeal).forEach(key => {
      if (key !== 'custom') {
        newMeal[key] = [];
      }
    });
    
    Object.keys(mealOptions).forEach(configCategory => {
      const options = mealOptions[configCategory];
      if (options && options.length > 0) {
        let targetCategory = configCategory;
        
        if (configCategory === 'carboidrati_single' || configCategory === 'carboidrati_multiple') {
          targetCategory = 'carboidrati';
          
          if (!newMeal[targetCategory] || newMeal[targetCategory].length === 0) {
            const selectedOption = getRandomItem(options);
            newMeal[targetCategory] = [{
              id: Date.now() + Math.random(),
              ...selectedOption,
              isMultiple: false
            }];
          }
        } else {
          const selectedOption = getRandomItem(options);
          newMeal[targetCategory] = [{
            id: Date.now() + Math.random(),
            ...selectedOption
          }];
        }
      }
    });

    if (mealType === 'pranzo' || mealType === 'cena') {
      const requiredCategories = ['carboidrati', 'proteine', 'grassi', 'verdure'];
      if (mealType === 'pranzo') {
        requiredCategories.push('emergenza');
      }
      requiredCategories.forEach(category => {
        if (!newMeal[category]) {
          newMeal[category] = [];
        }
      });
    }

    if (!newMeal.custom) {
      newMeal.custom = [];
    }

    setMeals(prev => ({ ...prev, [mealType]: newMeal }));
  };

  const restoreLastDeleted = (mealType) => {
    const lastDeleted = deletedItems[mealType] || [];
    if (lastDeleted.length > 0) {
      const itemToRestore = lastDeleted[lastDeleted.length - 1];
      
      setMeals(prev => ({
        ...prev,
        [mealType]: {
          ...prev[mealType],
          [itemToRestore.category]: [...(prev[mealType]?.[itemToRestore.category] || []), itemToRestore.item]
        }
      }));
      
      setDeletedItems(prev => ({
        ...prev,
        [mealType]: (prev[mealType] || []).slice(0, -1)
      }));
    }
  };

  const changeMealItem = (mealType, category, itemId, newFoodKey) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [category]: (prev[mealType]?.[category] || []).map(item => {
          if (item.id === itemId) {
            const mealOptions = getMealOptions(dayType, mealType);
            let options = [];
            
            if (category === 'carboidrati' && (mealType === 'pranzo' || mealType === 'cena')) {
              if (item.isMultiple) {
                options = mealOptions.carboidrati_multiple || [];
              } else {
                options = mealOptions.carboidrati_single || [];
              }
            } else {
              options = mealOptions[category] || [];
            }
            
            const newFoodInfo = options.find(opt => opt.foodKey === newFoodKey);
            
            if (newFoodInfo) {
              return { 
                ...item, 
                foodKey: newFoodKey,
                minAmount: newFoodInfo.minAmount,
                maxAmount: newFoodInfo.maxAmount,
                suggestedAmount: newFoodInfo.suggestedAmount,
                currentAmount: null
              };
            } else {
              return { ...item, foodKey: newFoodKey, currentAmount: null };
            }
          }
          return item;
        })
      }
    }));
  };

  const changeAmount = (mealType, category, itemId, delta) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [category]: (prev[mealType]?.[category] || []).map(item => {
          if (item.id === itemId) {
            const food = nutritionDb[item.foodKey];
            if (food) {
              const currentAmount = item.currentAmount || item.suggestedAmount || 100;
              
              let stepSize = 1;
              if (!food.isComposite) {
                stepSize = food.unit === 'pz' || food.unit === 'uova' || food.unit === 'vasetto' ? 1 : 10;
              }
              
              const newAmount = Math.max(stepSize === 1 ? 1 : stepSize, currentAmount + (delta * stepSize));
              
              return { ...item, currentAmount: newAmount };
            }
          }
          return item;
        })
      }
    }));
  };

  const resetAmount = (mealType, category, itemId) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [category]: (prev[mealType]?.[category] || []).map(item => 
          item.id === itemId ? { ...item, currentAmount: null } : item
        )
      }
    }));
  };

  const duplicateItem = (mealType, category, itemId) => {
    const originalItem = (meals[mealType]?.[category] || []).find(item => item.id === itemId);
    if (originalItem) {
      const newItem = { ...originalItem, id: Date.now() };
      setMeals(prev => ({
        ...prev,
        [mealType]: {
          ...prev[mealType],
          [category]: [...(prev[mealType]?.[category] || []), newItem]
        }
      }));
    }
  };

  const removeItem = (mealType, category, itemId) => {
    const itemToRemove = (meals[mealType]?.[category] || []).find(item => item.id === itemId);
    if (itemToRemove) {
      setDeletedItems(prev => ({
        ...prev,
        [mealType]: [...(prev[mealType] || []), { item: itemToRemove, category }].slice(-5)
      }));
      
      setMeals(prev => ({
        ...prev,
        [mealType]: {
          ...prev[mealType],
          [category]: (prev[mealType]?.[category] || []).filter(item => item.id !== itemId)
        }
      }));
    }
  };

  const calculateTotals = () => {
    let totalKcal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;

    const addNutrition = (item) => {
      if (item.foodKey && nutritionDb[item.foodKey]) {
        const food = nutritionDb[item.foodKey];
        
        let effectiveAmount = item.currentAmount || item.suggestedAmount || 1;
        
        let ratio;
        if (food.isComposite) {
          ratio = effectiveAmount;
        } else if (food.perPiece) {
          ratio = (effectiveAmount * food.perPiece) / 100;
        } else {
          ratio = effectiveAmount / 100;
        }
        
        totalKcal += food.kcal * ratio;
        totalProt += food.prot * ratio;
        totalCarb += food.carb * ratio;
        totalFat += food.fat * ratio;
      } else if (item.custom) {
        totalKcal += parseFloat(item.custom.kcal) || 0;
        totalProt += parseFloat(item.custom.prot) || 0;
        totalCarb += parseFloat(item.custom.carb) || 0;
        totalFat += parseFloat(item.custom.fat) || 0;
      }
    };

    const visibleMeals = getVisibleMeals();
    const mealTypesToCalculate = visibleMeals.map(meal => meal.key);

    mealTypesToCalculate.forEach(mealType => {
      const meal = meals[mealType];
      if (meal && typeof meal === 'object') {
        let categoriesToCalculate = [];
        
        if (mealType === 'pranzo' && lunchMode === 'emergenza') {
          categoriesToCalculate = ['emergenza'];
        } else {
          categoriesToCalculate = Object.keys(meal).filter(key => key !== 'emergenza');
        }
        
        categoriesToCalculate.forEach(category => {
          const items = meal[category] || [];
          if (Array.isArray(items)) {
            items.forEach(addNutrition);
          }
        });
      }
    });

    setTotals({
      kcal: Math.round(totalKcal),
      carb: Math.round(totalCarb * 10) / 10,
      prot: Math.round(totalProt * 10) / 10,
      fat: Math.round(totalFat * 10) / 10
    });
  };

  const calculateMealTotals = (mealType) => {
    let mealKcal = 0, mealProt = 0, mealCarb = 0, mealFat = 0;
    const meal = meals[mealType];

    if (!meal) {
      return { kcal: 0, carb: 0, prot: 0, fat: 0 };
    }

    let categoriesToCalculate = [];
    
    if (mealType === 'pranzo' && lunchMode === 'emergenza') {
      categoriesToCalculate = ['emergenza'];
    } else {
      categoriesToCalculate = Object.keys(meal).filter(key => key !== 'emergenza');
    }

    categoriesToCalculate.forEach(category => {
      const items = meal[category] || [];
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.foodKey && nutritionDb[item.foodKey]) {
            const food = nutritionDb[item.foodKey];
            
            let effectiveAmount = item.currentAmount || item.suggestedAmount || 1;
            
            let ratio;
            if (food.isComposite) {
              ratio = effectiveAmount;
            } else if (food.perPiece) {
              ratio = (effectiveAmount * food.perPiece) / 100;
            } else {
              ratio = effectiveAmount / 100;
            }
            
            mealKcal += food.kcal * ratio;
            mealProt += food.prot * ratio;
            mealCarb += food.carb * ratio;
            mealFat += food.fat * ratio;
          } else if (item.custom) {
            mealKcal += parseFloat(item.custom.kcal) || 0;
            mealProt += parseFloat(item.custom.prot) || 0;
            mealCarb += parseFloat(item.custom.carb) || 0;
            mealFat += parseFloat(item.custom.fat) || 0;
          }
        });
      }
    });

    return {
      kcal: Math.round(mealKcal),
      carb: Math.round(mealCarb * 10) / 10,
      prot: Math.round(mealProt * 10) / 10,
      fat: Math.round(mealFat * 10) / 10
    };
  };

  const addCustomFood = () => {
    if (newCustomFood.name && newCustomFood.kcal) {
      const customItem = {
        id: Date.now(),
        custom: { ...newCustomFood }
      };
      
      setMeals(prev => ({
        ...prev,
        [customFoodMeal]: {
          ...prev[customFoodMeal],
          [customFoodCategory]: [...(prev[customFoodMeal]?.[customFoodCategory] || []), customItem]
        }
      }));

      setNewCustomFood({ name: '', kcal: '', carb: '', prot: '', fat: '', amount: '', unit: 'g' });
      setShowCustomFood(false);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [meals, lunchMode, dayType]);

  useEffect(() => {
    generateRandomMeals();
  }, []);

  useEffect(() => {
    generateRandomMeals();
  }, [dayType]);

  useEffect(() => {
    if (lunchMode === 'emergenza') {
      if (!meals.pranzo?.emergenza || meals.pranzo.emergenza.length === 0) {
        setMeals(prev => ({
          ...prev,
          pranzo: {
            ...prev.pranzo,
            emergenza: [{
              id: Date.now(),
              foodKey: 'pranzo_emergenza',
              minAmount: 1,
              maxAmount: 1,
              suggestedAmount: 1,
              currentAmount: null
            }]
          }
        }));
      }
    }
  }, [lunchMode]);

  const FoodItem = ({ item, mealType, category, index, categoryCount = 1 }) => {
    if (item.custom) {
      return (
        <div className={`rounded p-2 mb-1 border ${categoryCount > 1 ? 'bg-blue-100 border-blue-300' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="text-sm font-medium w-20 flex-shrink-0">{item.custom.amount}{item.custom.unit}</span>
              <span className="text-sm text-blue-800 truncate">{item.custom.name}</span>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <div className="flex border rounded">
                <button onClick={() => changeAmount(mealType, category, item.id, -1)} className="w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 rounded-l" title="Diminuisci">
                  <Minus size={10} />
                </button>
                <button onClick={() => resetAmount(mealType, category, item.id)} className="w-5 h-5 bg-gray-500 text-white text-xs flex items-center justify-center hover:bg-gray-600" title="Reset dose">
                  <RefreshCw size={8} />
                </button>
                <button onClick={() => changeAmount(mealType, category, item.id, 1)} className="w-5 h-5 bg-green-500 text-white text-xs flex items-center justify-center hover:bg-green-600 rounded-r" title="Aumenta">
                  <Plus size={10} />
                </button>
              </div>
              
              <button onClick={() => duplicateItem(mealType, category, item.id)} className="w-5 h-5 bg-blue-500 text-white rounded text-xs flex items-center justify-center hover:bg-blue-600" title="Duplica">
                <Copy size={10} />
              </button>
              <button onClick={() => removeItem(mealType, category, item.id)} className="w-5 h-5 bg-red-500 text-white rounded text-xs flex items-center justify-center hover:bg-red-600" title="Elimina">
                <X size={10} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    const food = nutritionDb[item.foodKey];
    if (!food) return null;

    let currentAmount = item.currentAmount || item.suggestedAmount || 100;
    const hasRange = item.minAmount && item.maxAmount && (item.minAmount !== item.maxAmount);
    
    const mealOptions = getMealOptions(dayType, mealType);
    let options = [];
    
    if (category === 'carboidrati' && (mealType === 'pranzo' || mealType === 'cena')) {
      if (item.isMultiple) {
        options = mealOptions.carboidrati_multiple || [];
      } else {
        options = mealOptions.carboidrati_single || [];
      }
    } else {
      options = mealOptions[category] || [];
    }

    let bgColor = 'bg-blue-50';
    let borderStyle = '';
    
    if (item.groupId || item.isMultiple) {
      bgColor = 'bg-blue-50';
      borderStyle = 'border-l-4 border-blue-500';
    } else if (categoryCount > 1) {
      bgColor = 'bg-blue-100 border border-blue-300';
    }

    if (food.isComposite) {
      bgColor = 'bg-gradient-to-r from-orange-50 to-yellow-50';
      borderStyle = 'border-l-4 border-orange-400';
    }

    return (
      <div className={`rounded p-2 mb-1 ${bgColor} ${borderStyle}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <div className="w-20 flex-shrink-0">
              <span className="text-sm font-bold text-blue-700">
                {food.isComposite && food.displayAmount ? 
                  food.displayAmount : 
                  (food.isComposite ? `${currentAmount}x` : `${currentAmount}${food.unit}`)
                }
              </span>
              {/* Range sotto la dose - SOLO per alimenti normali */}
              {!food.isComposite && hasRange && (
                <div className="text-xs text-gray-500 italic">
                  {item.minAmount}-{item.maxAmount}{food.unit}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <select 
                value={item.foodKey}
                onChange={(e) => changeMealItem(mealType, category, item.id, e.target.value)}
                className="text-xs border rounded px-1 py-1 bg-white w-full"
              >
                {options.map(option => (
                  <option key={option.foodKey} value={option.foodKey}>
                    {nutritionDb[option.foodKey]?.portion || option.foodKey}
                  </option>
                ))}
              </select>
            </div>
            
            {category === 'carboidrati' && (mealType === 'pranzo' || mealType === 'cena') && mealOptions.carboidrati_multiple && (
              <button
                onClick={() => toggleCarbMode(mealType)}
                className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                  item.isMultiple
                    ? 'bg-blue-300 text-blue-800' 
                    : 'bg-blue-600 text-white'
                }`}
                title={item.isMultiple ? 'Torna a Portata Singola' : 'Passa a Più Portate'}
              >
                {item.isMultiple ? 'Singola' : '+ Portate'}
              </button>
            )}
          </div>
          
          {!food.isComposite && (
            <div className="flex gap-1 flex-shrink-0">
              <div className="flex border rounded">
                <button onClick={() => changeAmount(mealType, category, item.id, -1)} className="w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 rounded-l" title="Diminuisci">
                  <Minus size={10} />
                </button>
                <button onClick={() => resetAmount(mealType, category, item.id)} className="w-5 h-5 bg-gray-500 text-white text-xs flex items-center justify-center hover:bg-gray-600" title="Reset dose">
                  <RefreshCw size={8} />
                </button>
                <button onClick={() => changeAmount(mealType, category, item.id, 1)} className="w-5 h-5 bg-green-500 text-white text-xs flex items-center justify-center hover:bg-green-600 rounded-r" title="Aumenta">
                  <Plus size={10} />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => duplicateItem(mealType, category, item.id)} className="w-5 h-5 bg-blue-500 text-white rounded text-xs flex items-center justify-center hover:bg-blue-600" title="Duplica portata">
              <Copy size={10} />
            </button>
            <button onClick={() => removeItem(mealType, category, item.id)} className="w-5 h-5 bg-red-500 text-white rounded text-xs flex items-center justify-center hover:bg-red-600" title="Elimina portata">
              <X size={10} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getVisibleMeals = () => {
    const baseMeals = [
      { key: 'colazione', title: 'Colazione', categories: dayType === 'camminata' ? ['carboidrati', 'marmellata', 'latte', 'proteine', 'grassi'] : ['carboidrati', 'latte', 'proteine', 'grassi'] }
    ];
    
    const mealsByDayType = {
      riposo: [
        { key: 'spuntino_mattina', title: 'Spuntino Mattina', categories: ['carboidrati'] },
        { 
          key: 'pranzo', 
          title: 'Pranzo', 
          categories: lunchMode === 'emergenza' ? ['emergenza'] : ['carboidrati', 'proteine', 'grassi', 'verdure'],
          hasEmergency: true
        },
        { key: 'cena', title: 'Cena', categories: ['carboidrati', 'proteine', 'grassi', 'verdure'] },
        { key: 'dopo_cena', title: 'Dopo Cena', categories: ['grassi'] }
      ],
      allenamento: [
        { key: 'spuntino_mattina', title: 'Spuntino Mattina', categories: ['carboidrati'] },
        { 
          key: 'pranzo', 
          title: 'Pranzo', 
          categories: lunchMode === 'emergenza' ? ['emergenza'] : ['carboidrati', 'proteine', 'grassi', 'verdure'],
          hasEmergency: true
        },
        { key: 'pre_allenamento', title: 'Pre-Allenamento', categories: ['carboidrati', 'proteine', 'grassi'] },
        { key: 'durante_allenamento', title: 'Durante (opzionale)', categories: ['carboidrati'] },
        { key: 'post_allenamento', title: 'Post-Allenamento', categories: ['carboidrati', 'proteine', 'grassi'] }
      ],
      camminata: [
        { key: 'spuntino_mattina', title: 'Spuntino Mattina', categories: ['carboidrati'] },
        { 
          key: 'pranzo', 
          title: 'Pranzo', 
          categories: lunchMode === 'emergenza' ? ['emergenza'] : ['carboidrati', 'proteine', 'grassi', 'verdure'],
          hasEmergency: true
        },
        { key: 'cena', title: 'Cena', categories: ['carboidrati', 'proteine', 'grassi', 'verdure'] },
        { key: 'dopo_cena', title: 'Dopo Cena', categories: ['grassi'] }
      ]
    };
    
    return [...baseMeals, ...mealsByDayType[dayType]];
  };

  const renderMeal = (mealInfo) => {
    const { key: mealType, title, categories, hasEmergency } = mealInfo;
    const meal = meals[mealType] || {};
    
    return (
      <div key={mealType} className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-blue-800">{title}</h3>
            {hasEmergency && (
              <div className="flex bg-blue-100 rounded p-0.5">
                <button
                  onClick={() => setLunchMode('standard')}
                  className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                    lunchMode === 'standard'
                      ? 'bg-white text-blue-800 shadow-sm'
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setLunchMode('emergenza')}
                  className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                    lunchMode === 'emergenza'
                      ? 'bg-white text-blue-800 shadow-sm'
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  Emergenza
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <button onClick={() => generateRandomMeal(mealType)} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded hover:bg-blue-300" title="Genera pasto casuale">
              <Shuffle size={12} />
            </button>
            <button onClick={() => generateRandomMeal(mealType)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700" title="Reset pasto">
              <RotateCcw size={12} />
            </button>
            <button 
              onClick={() => restoreLastDeleted(mealType)} 
              disabled={(deletedItems[mealType] || []).length === 0}
              className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
              title="Ripristina ultimo alimento eliminato"
            >
              ↶
            </button>
          </div>
        </div>

        {categories.map(category => {
          const items = meal[category] || [];
          return items.map((item, index) => (
            <FoodItem 
              key={item.id} 
              item={item} 
              mealType={mealType} 
              category={category} 
              index={index} 
              categoryCount={items.length} 
            />
          ));
        })}

        {(meal.custom || []).map((item, index) => (
          <FoodItem 
            key={item.id} 
            item={item} 
            mealType={mealType} 
            category="custom" 
            index={index} 
            categoryCount={(meal.custom || []).length} 
          />
        ))}

        <div className="mt-2 flex justify-between items-center">
          <div className="bg-blue-100 rounded px-2 py-1 text-sm flex gap-3">
            <span>{calculateMealTotals(mealType).kcal} kcal</span>
            <span>C: {calculateMealTotals(mealType).carb}g</span>
            <span>P: {calculateMealTotals(mealType).prot}g</span>
            <span>G: {calculateMealTotals(mealType).fat}g</span>
          </div>
          <button 
            onClick={() => {
              setCustomFoodMeal(mealType);
              setCustomFoodCategory(categories[0] || 'carboidrati');
              setShowCustomFood(true);
            }} 
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            + Alimento
          </button>
        </div>
        
        {mealType === 'spuntino_mattina' && (
          <p className="text-xs text-blue-700 mt-1 italic">Solo purea frutta 100g</p>
        )}
        {mealType === 'durante_allenamento' && (
          <p className="text-xs text-blue-700 mt-1 italic">Solo se allenamento lungo</p>
        )}
        {mealType === 'dopo_cena' && (
          <p className="text-xs text-blue-700 mt-1 italic">Cioccolato fondente 10-20g</p>
        )}
        {mealType === 'pranzo' && lunchMode === 'emergenza' && (
          <p className="text-xs text-orange-700 mt-1 italic font-medium">Pasto completo d'emergenza</p>
        )}
      </div>
    );
  };

  const percentages = (() => {
    const totalCal = totals.prot * 4 + totals.carb * 4 + totals.fat * 9;
    return {
      carb: totalCal ? Math.round((totals.carb * 4 / totalCal) * 100) : 0,
      prot: totalCal ? Math.round((totals.prot * 4 / totalCal) * 100) : 0,
      fat: totalCal ? Math.round((totals.fat * 9 / totalCal) * 100) : 0
    };
  })();

  return (
    <div className="max-w-6xl mx-auto p-4 bg-blue-25 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-3">Generatore Pasti Nutrizionali 🎯</h1>
        
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setDayType('riposo')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dayType === 'riposo' 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
            }`}
          >
            Giorno di Non Allenamento
          </button>
          <button
            onClick={() => setDayType('allenamento')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dayType === 'allenamento' 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
            }`}
          >
            Giorno di Allenamento
          </button>
          <button
            onClick={() => setDayType('camminata')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dayType === 'camminata' 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
            }`}
          >
            Giorno di Camminata
          </button>
        </div>
        
        <button
          onClick={generateRandomMeals}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Shuffle size={16} className="inline mr-2" />
          Genera Giornata
        </button>
      </div>

      <div className={`grid gap-4 mb-8 ${
        dayType === 'allenamento' 
          ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
          : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4'
      }`}>
        {getVisibleMeals().map(mealInfo => renderMeal(mealInfo))}
      </div>

      <div className="h-16"></div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white shadow-2xl border-t-4 border-blue-500 z-40">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator size={18} />
              <h3 className="text-lg font-bold">Totali</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{totals.kcal}</div>
                <div className="text-xs text-gray-300">kcal</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{totals.carb}g</div>
                <div className="text-xs text-gray-300">C ({percentages.carb}%)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-400">{totals.prot}g</div>
                <div className="text-xs text-gray-300">P ({percentages.prot}%)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{totals.fat}g</div>
                <div className="text-xs text-gray-300">G ({percentages.fat}%)</div>
              </div>
            </div>

            <div className="flex-1 max-w-xs ml-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="h-3 rounded-full flex">
                  <div className="bg-yellow-500 h-full rounded-l-full" style={{width: `${percentages.carb}%`}}></div>
                  <div className="bg-red-500 h-full" style={{width: `${percentages.prot}%`}}></div>
                  <div className="bg-green-500 h-full rounded-r-full" style={{width: `${percentages.fat}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCustomFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Aggiungi Alimento</h3>
              <button
                onClick={() => setShowCustomFood(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Alimento</label>
                <input
                  type="text"
                  value={newCustomFood.name}
                  onChange={(e) => setNewCustomFood(prev => ({...prev, name: e.target.value}))}
                  placeholder="Es: Petto di pollo arrosto"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantità</label>
                  <input
                    type="number"
                    value={newCustomFood.amount}
                    onChange={(e) => setNewCustomFood(prev => ({...prev, amount: e.target.value}))}
                    placeholder="200"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unità</label>
                  <select
                    value={newCustomFood.unit}
                    onChange={(e) => setNewCustomFood(prev => ({...prev, unit: e.target.value}))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="g">grammi</option>
                    <option value="ml">ml</option>
                    <option value="pz">pezzi</option>
                    <option value="cucchiai">cucchiai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calorie</label>
                  <input
                    type="number"
                    value={newCustomFood.kcal}
                    onChange={(e) => setNewCustomFood(prev => ({...prev, kcal: e.target.value}))}
                    placeholder="250"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carboidrati (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCustomFood.carb}
                    onChange={(e) => setNewCustomFood(prev => ({...prev, carb: e.target.value}))}
                    placeholder="0"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proteine (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCustomFood.prot}
                    onChange={(e) => setNewCustomFood(prev => ({...prev, prot: e.target.value}))}
                    placeholder="35"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grassi (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCustomFood.fat}
                    onChange={(e) => setNewCustomFood(prev => ({...prev, fat: e.target.value}))}
                    placeholder="8"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={addCustomFood}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mt-4"
            >
              Aggiungi al {customFoodMeal}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealGenerator;
