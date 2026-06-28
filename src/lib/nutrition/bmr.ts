// Mifflin-St Jeor Equation
export function calculateBMR_MifflinStJeor(
  sex: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number
): number {
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

// Katch-McArdle Equation
export function calculateBMR_KatchMcArdle(
  weightKg: number,
  bodyFatPct: number
): number {
  const leanBodyMass = weightKg * (1 - bodyFatPct / 100);
  return 370 + 21.6 * leanBodyMass;
}

export function calculateBMR(
  sex: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number,
  bodyFatPct?: number | null
): number {
  if (bodyFatPct && bodyFatPct > 0) {
    return calculateBMR_KatchMcArdle(weightKg, bodyFatPct);
  }
  return calculateBMR_MifflinStJeor(sex, weightKg, heightCm, age);
}
