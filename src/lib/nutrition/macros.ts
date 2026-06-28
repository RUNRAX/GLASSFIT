export type Goal = 'lose_fat' | 'build_muscle' | 'recomposition' | 'maintain' | 'general_fitness';

export function calculateCalorieTarget(tdee: number, goal: Goal, sex: 'male' | 'female'): number {
  let target = tdee;

  switch (goal) {
    case 'lose_fat':
      target = tdee * 0.8; // 20% deficit
      break;
    case 'build_muscle':
      target = tdee * 1.1; // 10% surplus
      break;
    case 'recomposition':
    case 'maintain':
    case 'general_fitness':
      target = tdee;
      break;
  }

  // Safety floor
  const floor = sex === 'male' ? 1800 : 1500;
  return Math.max(target, floor);
}

export function calculateMacros(calorieTarget: number, weightKg: number) {
  // Protein: 2.0g per kg of bodyweight
  const protein_g = weightKg * 2.0;
  
  // Fat: 25% of total calories (fat is 9 calories per gram)
  const fat_g = (calorieTarget * 0.25) / 9;
  
  // Carbs: Remaining calories (carbs and protein are 4 calories per gram)
  const remainingCalories = calorieTarget - (protein_g * 4) - (fat_g * 9);
  const carbs_g = Math.max(0, remainingCalories / 4);

  return {
    protein_g: Math.round(protein_g),
    fat_g: Math.round(fat_g),
    carbs_g: Math.round(carbs_g),
  };
}
