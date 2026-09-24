import { SuplisBackendApplication } from './application';

import aminos from './data/aminos.json';
import creatines from './data/creatines.json';
import multivitamins from './data/multivitamins.json';
import omegas from './data/omegas.json';
import preworkouts from './data/preworkout.json';
import proteins from './data/proteins.json';
import salts from './data/salts.json';
import vitamins from './data/vitamins.json';
import weightManagement from './data/weightManagement.json';

import {
  CategoryRepository,
  AminoProductRepository,
  CreatineProductRepository,
  MultivitaminProductRepository,
  OmegaProductRepository,
  PreWorkoutProductRepository,
  ProteinProductRepository,
  SaltProductRepository,
  SingleVitaminProductRepository,
  WeightManagementProductRepository,
} from './repositories';

export async function seedData() {
  const app = new SuplisBackendApplication();
  await app.boot();

  const categoryRepo = await app.getRepository(CategoryRepository);
  const proteinRepo = await app.getRepository(ProteinProductRepository);
  const multivitaminRepo = await app.getRepository(MultivitaminProductRepository);
  const omegaRepo = await app.getRepository(OmegaProductRepository);
  const preworkoutRepo = await app.getRepository(PreWorkoutProductRepository);
  const saltRepo = await app.getRepository(SaltProductRepository);
  const singleVitaminRepo = await app.getRepository(SingleVitaminProductRepository);
  const weightManageRepo = await app.getRepository(WeightManagementProductRepository);
  const aminoRepo = await app.getRepository(AminoProductRepository);
  const creatineRepo = await app.getRepository(CreatineProductRepository);

  console.log('Clearing existing records from database...');
  await proteinRepo.deleteAll();
  await multivitaminRepo.deleteAll();
  await omegaRepo.deleteAll();
  await preworkoutRepo.deleteAll();
  await saltRepo.deleteAll();
  await singleVitaminRepo.deleteAll();
  await weightManageRepo.deleteAll();
  await aminoRepo.deleteAll();
  await creatineRepo.deleteAll();
  await categoryRepo.deleteAll();

  console.log('Seeding products with cat_ Category IDs...');

  async function seedCategory(
    repo: any,
    data: any[],
    categoryName: string,
    customCategoryId: string
  ) {
    if (!data || data.length === 0) return;

    // 1. Create Category with clean ID (e.g., 'cat_prot', 'cat_amino')
    const category = await categoryRepo.create({
      id: customCategoryId,
      name: categoryName,
    });

    // 2. Map through products and set categoryId foreign key
    for (const item of data) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { category: oldCategoryString, ...cleanedItem } = item;

        await repo.create({
          ...cleanedItem,
          categoryId: category.id, // Foreign key linking to cat_ ID
        });
      } catch (err) {
        console.error(`Failed to insert ${item.id} in ${categoryName}:`, err);
      }
    }
    console.log(`✔ ${categoryName} seeded (${data.length} items) [ID: ${customCategoryId}]`);
  }

  // 3. Execute Seeding with cat_ Category IDs
  await seedCategory(proteinRepo, proteins, 'Proteins', 'cat_prot');
  await seedCategory(multivitaminRepo, multivitamins, 'Multivitamins', 'cat_multi');
  await seedCategory(omegaRepo, omegas, 'Omegas', 'cat_omg');
  await seedCategory(preworkoutRepo, preworkouts, 'Pre-Workouts', 'cat_pw');
  await seedCategory(saltRepo, salts, 'Salts', 'cat_salt');
  await seedCategory(singleVitaminRepo, vitamins, 'Vitamins', 'cat_vit');
  await seedCategory(weightManageRepo, weightManagement, 'Weight Management', 'cat_wm');
  await seedCategory(aminoRepo, aminos, 'Aminos', 'cat_amino');
  await seedCategory(creatineRepo, creatines, 'Creatines', 'cat_crt');

  console.log('All categories and products successfully linked with cat_ IDs!');
  process.exit(0);
}
