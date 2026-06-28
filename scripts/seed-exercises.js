const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role to bypass RLS for inserting public library
);

async function seedExercises() {
  console.log('Fetching exercise DB...');
  const res = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
  const exercises = await res.json();
  
  console.log(`Found ${exercises.length} exercises. Transforming...`);
  
  const formatted = exercises.map(ex => ({
    id: ex.id,
    name: ex.name,
    primary_muscles: ex.primaryMuscles || [],
    secondary_muscles: ex.secondaryMuscles || [],
    equipment: ex.equipment || 'none',
    level: ex.level || 'beginner',
    mechanic: ex.mechanic || 'none',
    instructions: ex.instructions || [],
    image_urls: ex.images ? ex.images.map(img => `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`) : []
  }));

  // Batch insert to avoid huge payload size issues
  const batchSize = 100;
  for (let i = 0; i < formatted.length; i += batchSize) {
    const batch = formatted.slice(i, i + batchSize);
    console.log(`Inserting batch ${i / batchSize + 1} / ${Math.ceil(formatted.length / batchSize)}...`);
    const { error } = await supabase.from('exercise_library').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error('Error inserting batch:', error);
      process.exit(1);
    }
  }

  console.log('Successfully seeded exercise library!');
}

seedExercises().catch(console.error);
