import { PROGRAM_TEMPLATES, ProgramTemplate, TemplateEquipment } from './templates';

export function matchProgram(
  goal: string,
  experience: string,
  equipments: string[]
): ProgramTemplate {
  
  // Determine available equipment tier
  let equipmentTier: TemplateEquipment = 'body_only';
  const equips = equipments.map(e => e.toLowerCase());
  
  if (equips.includes('barbell') || equips.includes('machine') || equips.includes('cable')) {
    equipmentTier = 'full_gym';
  } else if (equips.includes('dumbbell') || equips.includes('kettlebell')) {
    equipmentTier = 'dumbbell';
  }

  // Score templates based on match quality
  let bestMatch = PROGRAM_TEMPLATES[0];
  let highestScore = -1;

  for (const template of PROGRAM_TEMPLATES) {
    let score = 0;

    // Goal match
    if (template.goal === goal) score += 3;
    else if (template.goal === 'any') score += 1;

    // Experience match
    if (template.experience_level === experience) score += 2;
    else if (template.experience_level === 'any') score += 1;

    // Equipment match - critical constraint
    if (template.equipment_needed === equipmentTier) score += 4;
    else if (template.equipment_needed === 'body_only') score += 2; // Always valid fallback
    else if (template.equipment_needed === 'dumbbell' && equipmentTier === 'full_gym') score += 2; // Gym has dumbbells
    else continue; // Cannot do a full gym program with bodyweight

    if (score > highestScore) {
      highestScore = score;
      bestMatch = template;
    }
  }

  return bestMatch;
}
