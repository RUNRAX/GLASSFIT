import { db } from '../src/db';
import { exerciseLibrary } from '../src/db/schema';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function seedExercises() {
  console.log('Fetching exercise DB...');
  const res = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
  const exercises = await res.json();
  
  console.log(`Found ${exercises.length} exercises. Transforming...`);
  
  const formatted = exercises.map((ex: any) => ({
    id: ex.id,
    name: ex.name,
    primaryMuscles: ex.primaryMuscles || [],
    secondaryMuscles: ex.secondaryMuscles || [],
    equipment: ex.equipment || 'none',
    level: ex.level || 'beginner',
    mechanic: ex.mechanic || 'none',
    instructions: ex.instructions || [],
    imageUrls: ex.images ? ex.images.map((img: string) => `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`) : []
  }));

  // Batch insert to avoid huge payload size issues
  const batchSize = 100;
  for (let i = 0; i < formatted.length; i += batchSize) {
    const batch = formatted.slice(i, i + batchSize);
    console.log(`Inserting batch ${i / batchSize + 1} / ${Math.ceil(formatted.length / batchSize)}...`);
    
    await db.insert(exerciseLibrary).values(batch).onConflictDoUpdate({
      target: exerciseLibrary.id,
      set: {
        name: exerciseLibrary.name, // dummy update to bypass "on conflict do nothing doesn't exist" in drizzle easily if needed, but we can do it properly
      }
    });
  }

  console.log('Successfully seeded exercise library!');
  process.exit(0);
}

seedExercises().catch((err) => {
  console.error(err);
  process.exit(1);
});
