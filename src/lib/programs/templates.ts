export type TemplateExperience = 'beginner' | 'intermediate' | 'advanced' | 'any';
export type TemplateGoal = 'lose_fat' | 'build_muscle' | 'recomposition' | 'maintain' | 'general_fitness' | 'any';
export type TemplateEquipment = 'body_only' | 'dumbbell' | 'full_gym' | 'any';

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  goal: TemplateGoal;
  experience_level: TemplateExperience;
  equipment_needed: TemplateEquipment;
  days: {
    day_number: number;
    focus: string;
    exercises: {
      exercise_id: string; // matches free-exercise-db ID
      sets: number;
      reps: string;
      rest_seconds: number;
    }[];
  }[];
}

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  {
    id: "beginner-bodyweight-general",
    name: "Beginner Bodyweight Fitness",
    description: "A great starting point using just your bodyweight to build a foundation of strength.",
    goal: "any",
    experience_level: "beginner",
    equipment_needed: "body_only",
    days: [
      {
        day_number: 1,
        focus: "Full Body",
        exercises: [
          { exercise_id: "Pushups", sets: 3, reps: "8-12", rest_seconds: 90 },
          { exercise_id: "Bodyweight_Squat", sets: 3, reps: "15", rest_seconds: 90 },
          { exercise_id: "Crunch", sets: 3, reps: "15-20", rest_seconds: 60 }
        ]
      },
      {
        day_number: 2,
        focus: "Rest",
        exercises: []
      },
      {
        day_number: 3,
        focus: "Full Body",
        exercises: [
          { exercise_id: "Pushups", sets: 3, reps: "8-12", rest_seconds: 90 },
          { exercise_id: "Lunges", sets: 3, reps: "10/leg", rest_seconds: 90 },
          { exercise_id: "Plank", sets: 3, reps: "30s", rest_seconds: 60 }
        ]
      }
    ]
  },
  {
    id: "beginner-dumbbell-muscle",
    name: "Dumbbell Muscle Builder",
    description: "Build muscle at home using a pair of dumbbells.",
    goal: "build_muscle",
    experience_level: "beginner",
    equipment_needed: "dumbbell",
    days: [
      {
        day_number: 1,
        focus: "Upper Body",
        exercises: [
          { exercise_id: "Dumbbell_Bench_Press", sets: 3, reps: "8-12", rest_seconds: 90 },
          { exercise_id: "Dumbbell_Alternate_Bicep_Curl", sets: 3, reps: "10-12", rest_seconds: 60 },
          { exercise_id: "Side_Lateral_Raise", sets: 3, reps: "12-15", rest_seconds: 60 }
        ]
      },
      {
        day_number: 2,
        focus: "Lower Body",
        exercises: [
          { exercise_id: "Goblet_Squat", sets: 3, reps: "10-15", rest_seconds: 90 },
          { exercise_id: "Dumbbell_Lunges", sets: 3, reps: "10/leg", rest_seconds: 90 },
          { exercise_id: "Dumbbell_Calf_Raises", sets: 3, reps: "15-20", rest_seconds: 60 }
        ]
      }
    ]
  },
  {
    id: "intermediate-gym-hypertrophy",
    name: "Gym Hypertrophy Program",
    description: "Classic gym-based muscle building split.",
    goal: "build_muscle",
    experience_level: "intermediate",
    equipment_needed: "full_gym",
    days: [
      {
        day_number: 1,
        focus: "Push",
        exercises: [
          { exercise_id: "Barbell_Bench_Press_-_Medium_Grip", sets: 4, reps: "8-10", rest_seconds: 120 },
          { exercise_id: "Seated_Dumbbell_Press", sets: 3, reps: "10", rest_seconds: 90 },
          { exercise_id: "Triceps_Pushdown", sets: 3, reps: "12-15", rest_seconds: 60 }
        ]
      },
      {
        day_number: 2,
        focus: "Pull",
        exercises: [
          { exercise_id: "Lat_Pulldown", sets: 4, reps: "8-12", rest_seconds: 90 },
          { exercise_id: "Bent_Over_Barbell_Row", sets: 3, reps: "8-10", rest_seconds: 120 },
          { exercise_id: "Barbell_Curl", sets: 3, reps: "10-12", rest_seconds: 60 }
        ]
      },
      {
        day_number: 3,
        focus: "Legs",
        exercises: [
          { exercise_id: "Barbell_Squat", sets: 4, reps: "8-10", rest_seconds: 120 },
          { exercise_id: "Leg_Press", sets: 3, reps: "10-15", rest_seconds: 90 },
          { exercise_id: "Lying_Leg_Curls", sets: 3, reps: "12-15", rest_seconds: 60 }
        ]
      }
    ]
  }
  // For MVP, we have these core templates to prove the concept.
];
