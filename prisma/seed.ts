import { PrismaClient, MealType, type Product } from "@prisma/client";

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

const PRODUCT_DATA = [
  { name: "Болгарский перец", kcalPer100: 31, proteinPer100: 0.9, fatPer100: 0.1, carbsPer100: 6.7 },
  { name: "Ветчина Империя Вкуса", kcalPer100: 90, proteinPer100: 13, fatPer100: 2, carbsPer100: 4, packageSizeG: 400 },
  { name: "Вишня замороженная", kcalPer100: 50, proteinPer100: 1, fatPer100: 0.2, carbsPer100: 11, packageSizeG: 300 },
  { name: "Греческий йогурт Савушкин", kcalPer100: 67, proteinPer100: 8, fatPer100: 2, carbsPer100: 4.2, packageSizeG: 250 },
  { name: "Гречка в пакете", kcalPer100: 340, proteinPer100: 13, fatPer100: 2.5, carbsPer100: 61, packageSizeG: 80 },
  { name: "Додстер Чилл Гриль", kcalPer100: 225, proteinPer100: 13.9, fatPer100: 9.7, carbsPer100: 20.4, packageSizeG: 180 },
  { name: "Зефир Коломенский", kcalPer100: 320, proteinPer100: 1, fatPer100: 0, carbsPer100: 80, packageSizeG: 42 },
  { name: "Капучино", kcalPer100: 55, proteinPer100: 2.8, fatPer100: 3, carbsPer100: 4.1, packageSizeG: 200 },
  { name: "Картофель", kcalPer100: 77, proteinPer100: 2, fatPer100: 0.4, carbsPer100: 16.3 },
  { name: "Квашеная капуста", kcalPer100: 14, proteinPer100: 0.9, fatPer100: 0.1, carbsPer100: 2.4, packageSizeG: 500 },
  { name: "Кефир", kcalPer100: 40, proteinPer100: 3.3, fatPer100: 1, carbsPer100: 4, packageSizeG: 930 },
  { name: "Киви", kcalPer100: 61, proteinPer100: 1.1, fatPer100: 0.5, carbsPer100: 14.7, packageSizeG: 75 },
  { name: "Лук репчатый", kcalPer100: 41, proteinPer100: 1.4, fatPer100: 0.2, carbsPer100: 8.2 },
  { name: "Морковь", kcalPer100: 41, proteinPer100: 0.9, fatPer100: 0.2, carbsPer100: 6.8 },
  { name: "Мука пшеничная", kcalPer100: 334, proteinPer100: 10.8, fatPer100: 1.3, carbsPer100: 69.9 },
  { name: "Паста Песто Додо", kcalPer100: 120, proteinPer100: 9, fatPer100: 8.3, carbsPer100: 22.4, packageSizeG: 270 },
  { name: "Пастила", kcalPer100: 350, proteinPer100: 0.5, fatPer100: 0.5, carbsPer100: 87, packageSizeG: 28 },
  { name: "Подсолнечное масло", kcalPer100: 899, proteinPer100: 0, fatPer100: 99.9, carbsPer100: 0 },
  { name: "Протеин (скуп)", kcalPer100: 130, proteinPer100: 24, fatPer100: 2.5, carbsPer100: 2, packageSizeG: 33 },
  { name: "Рис пропаренный", kcalPer100: 347, proteinPer100: 7.2, fatPer100: 0.5, carbsPer100: 76.9, packageSizeG: 100 },
  { name: "Соевый соус", kcalPer100: 50, proteinPer100: 2.5, fatPer100: 0, carbsPer100: 11, packageSizeG: 50 },
  { name: "Творог 2% Хуторок", kcalPer100: 100, proteinPer100: 18, fatPer100: 2, carbsPer100: 3.3, packageSizeG: 180 },
  { name: "Томаты черри", kcalPer100: 15, proteinPer100: 0.8, fatPer100: 0.1, carbsPer100: 2.8, packageSizeG: 200 },
  { name: "Филе грудки индейки Премиум", kcalPer100: 110, proteinPer100: 23, fatPer100: 1.5, carbsPer100: 0, packageSizeG: 550 },
  { name: "Азу из индейки Пава-Пава", kcalPer100: 110, proteinPer100: 23, fatPer100: 2, carbsPer100: 0, packageSizeG: 450 },
  { name: "Филе минтая Borealis", kcalPer100: 89, proteinPer100: 20, fatPer100: 1, carbsPer100: 0, packageSizeG: 300 },
  { name: "Цезарь ролл ВкусВилл", kcalPer100: 230, proteinPer100: 16.7, fatPer100: 8.3, carbsPer100: 22, packageSizeG: 160 },
  { name: "Шампиньоны", kcalPer100: 27, proteinPer100: 4.3, fatPer100: 1, carbsPer100: 0.1, packageSizeG: 400 },
  { name: "Экспонента", kcalPer100: 60, proteinPer100: 12, fatPer100: 0, carbsPer100: 2.5, packageSizeG: 250 },
  { name: "Яйцо С1", kcalPer100: 157, proteinPer100: 12.7, fatPer100: 11.5, carbsPer100: 0.7, packageSizeG: 70 },
  { name: "Яичный белок (бутылка)", kcalPer100: 52, proteinPer100: 11, fatPer100: 0.2, carbsPer100: 0.7 },
  { name: "Медальоны из индейки в маринаде", kcalPer100: 150, proteinPer100: 18, fatPer100: 8, carbsPer100: 1, packageSizeG: 500 },
];

async function main() {
  console.log("Seeding products...");

  // Sequential to avoid exceeding Supabase pooler connection limit
  const products: Product[] = [];
  for (const data of PRODUCT_DATA) {
    const p = await prisma.product.upsert({ where: { name: data.name }, update: {}, create: data });
    products.push(p);
  }

  const byName = (name: string) => {
    const p = products.find((p) => p.name === name);
    if (!p) throw new Error(`Product not found: ${name}`);
    return p.id;
  };

  console.log("Seeding meals...");

  // Helper: calculate macros from ingredients
  function calcMacros(ingredients: { name: string; grams: number }[]) {
    let kcal = 0, protein = 0, fat = 0, carbs = 0;
    for (const { name, grams } of ingredients) {
      const p = products.find((p) => p.name === name)!;
      const factor = grams / 100;
      kcal += p.kcalPer100 * factor;
      protein += p.proteinPer100 * factor;
      fat += p.fatPer100 * factor;
      carbs += p.carbsPer100 * factor;
    }
    return {
      kcal: Math.round(kcal),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
    };
  }

  async function upsertMeal(
    name: string,
    type: MealType,
    prepMinutes: number,
    notes: string | undefined,
    ingredients: { name: string; grams: number }[]
  ) {
    const macros = calcMacros(ingredients);
    const existing = await prisma.meal.findFirst({ where: { name } });
    let meal;
    if (existing) {
      meal = await prisma.meal.update({
        where: { id: existing.id },
        data: { ...macros, prepMinutes, notes },
      });
      await prisma.mealIngredient.deleteMany({ where: { mealId: meal.id } });
    } else {
      meal = await prisma.meal.create({
        data: { name, type, prepMinutes, notes, ...macros },
      });
    }
    await prisma.mealIngredient.createMany({
      data: ingredients.map((i) => ({
        mealId: meal.id,
        productId: byName(i.name),
        grams: i.grams,
      })),
    });
    return meal;
  }

  // ─── ОБЕДЫ (порция на 1 человека, готовить на 5) ─────────────────────────
  await upsertMeal(
    "Индейка с рисом, грибами и овощами",
    MealType.LUNCH, 60,
    "Готовить в мультиварке на 5 порций. Режим «Тушение» 40 мин. Специи: соевый соус, чёрный перец.",
    [
      { name: "Филе грудки индейки Премиум", grams: 110 },
      { name: "Рис пропаренный", grams: 100 },
      { name: "Шампиньоны", grams: 80 },
      { name: "Болгарский перец", grams: 20 },
      { name: "Морковь", grams: 20 },
      { name: "Лук репчатый", grams: 20 },
      { name: "Соевый соус", grams: 10 },
      { name: "Подсолнечное масло", grams: 1 },
    ]
  );

  await upsertMeal(
    "Медальоны индейки с гречкой и квашеной капустой",
    MealType.LUNCH, 30,
    "Медальоны в аэрогриле 180°C 15 мин. Гречку варить в пакете. Квашеную капусту подавать холодной.",
    [
      { name: "Медальоны из индейки в маринаде", grams: 100 },
      { name: "Гречка в пакете", grams: 80 },
      { name: "Квашеная капуста", grams: 60 },
    ]
  );

  await upsertMeal(
    "Минтай с рисом и овощами",
    MealType.LUNCH, 40,
    "Минтай запекать 180°C 20 мин или тушить с овощами. Рис варить параллельно.",
    [
      { name: "Филе минтая Borealis", grams: 120 },
      { name: "Рис пропаренный", grams: 70 },
      { name: "Лук репчатый", grams: 20 },
      { name: "Морковь", grams: 20 },
      { name: "Подсолнечное масло", grams: 1 },
    ]
  );

  await upsertMeal(
    "Азу из индейки с гречкой и помидорами",
    MealType.LUNCH, 35,
    "Азу тушить с помидорами и луком 20 мин. Гречку варить отдельно.",
    [
      { name: "Азу из индейки Пава-Пава", grams: 90 },
      { name: "Гречка в пакете", grams: 80 },
      { name: "Томаты черри", grams: 40 },
      { name: "Лук репчатый", grams: 20 },
      { name: "Соевый соус", grams: 10 },
    ]
  );

  // ─── ЗАВТРАКИ ─────────────────────────────────────────────────────────────
  await upsertMeal(
    "Сырники с греческим йогуртом",
    MealType.BREAKFAST, 20,
    "Смешать творог, яйцо, муку. Лепить небольшие котлетки. Жарить на минимальном масле 3-4 мин с каждой стороны. Подавать с йогуртом и сахарозаменителем.",
    [
      { name: "Творог 2% Хуторок", grams: 180 },
      { name: "Яйцо С1", grams: 70 },
      { name: "Мука пшеничная", grams: 50 },
      { name: "Подсолнечное масло", grams: 1 },
      { name: "Греческий йогурт Савушкин", grams: 150 },
    ]
  );

  await upsertMeal(
    "Омлет из яичного белка + Экспонента",
    MealType.BREAKFAST, 10,
    "Белки взбить, добавить специи. Жарить на антипригарной сковороде без масла или с каплей. Экспоненту пить сразу.",
    [
      { name: "Яичный белок (бутылка)", grams: 200 },
      { name: "Подсолнечное масло", grams: 2 },
      { name: "Экспонента", grams: 250 },
    ]
  );

  await upsertMeal(
    "Вареные яйца с ветчиной и творогом",
    MealType.BREAKFAST, 12,
    "Яйца варить 8-10 мин. Ветчину нарезать. Творог в миску — можно добавить зелень.",
    [
      { name: "Яйцо С1", grams: 140 },
      { name: "Ветчина Империя Вкуса", grams: 100 },
      { name: "Творог 2% Хуторок", grams: 100 },
    ]
  );

  await upsertMeal(
    "Творог с кефиром и протеином",
    MealType.BREAKFAST, 5,
    "Смешать всё в миске. Можно добавить корицу. Самый быстрый вариант завтрака.",
    [
      { name: "Творог 2% Хуторок", grams: 180 },
      { name: "Кефир", grams: 200 },
      { name: "Протеин (скуп)", grams: 33 },
    ]
  );

  // ─── УЖИНЫ ────────────────────────────────────────────────────────────────
  await upsertMeal(
    "Цезарь ролл + кефир",
    MealType.DINNER, 2,
    "Готовый ролл — просто достать из холодильника. Кефир из пачки.",
    [
      { name: "Цезарь ролл ВкусВилл", grams: 160 },
      { name: "Кефир", grams: 200 },
    ]
  );

  await upsertMeal(
    "Ветчина с творогом и квашеной капустой",
    MealType.DINNER, 5,
    "Нарезать ветчину. Творог выложить в миску. Квашеная капуста — отличный пробиотик для вечера.",
    [
      { name: "Ветчина Империя Вкуса", grams: 150 },
      { name: "Творог 2% Хуторок", grams: 180 },
      { name: "Квашеная капуста", grams: 200 },
    ]
  );

  await upsertMeal(
    "Минтай с гречкой",
    MealType.DINNER, 20,
    "Минтай запечь или потушить. Гречку сварить в пакете. Можно добавить соевый соус.",
    [
      { name: "Филе минтая Borealis", grams: 200 },
      { name: "Гречка в пакете", grams: 80 },
    ]
  );

  await upsertMeal(
    "Додстер + Экспонента",
    MealType.DINNER, 2,
    "Готовый додстер разогреть 1 мин в микроволновке. Экспонента из холодильника.",
    [
      { name: "Додстер Чилл Гриль", grams: 180 },
      { name: "Экспонента", grams: 250 },
    ]
  );

  // ─── ПЕРЕКУСЫ (СЛАДКОЕ В ПЛАНЕ) ──────────────────────────────────────────
  await upsertMeal(
    "Зефир + замороженная вишня",
    MealType.SNACK, 2,
    "Вишню разморозить заранее или есть полузамороженной — вкусно! Зефир — 1 шт (42г).",
    [
      { name: "Зефир Коломенский", grams: 42 },
      { name: "Вишня замороженная", grams: 150 },
    ]
  );

  await upsertMeal(
    "Пастила + греческий йогурт",
    MealType.SNACK, 2,
    "Пастила — 1 пачка (28г). Йогурт как основа — насыщает и замедляет усвоение сахара.",
    [
      { name: "Пастила", grams: 28 },
      { name: "Греческий йогурт Савушкин", grams: 150 },
    ]
  );

  await upsertMeal(
    "Протеиновый коктейль с кефиром",
    MealType.SNACK, 3,
    "Смешать в шейкере или стакане. Отличная альтернатива сладкому — содержит немного лактозы.",
    [
      { name: "Кефир", grams: 300 },
      { name: "Протеин (скуп)", grams: 33 },
    ]
  );

  await upsertMeal(
    "Киви с кефиром",
    MealType.SNACK, 3,
    "2 киви (150г) нарезать. Кефир — отдельно или полить сверху.",
    [
      { name: "Киви", grams: 150 },
      { name: "Кефир", grams: 200 },
    ]
  );

  // ─── ВЫХОДНЫЕ ─────────────────────────────────────────────────────────────
  await upsertMeal(
    "Яичница с ветчиной и помидорами",
    MealType.WEEKEND, 10,
    "На выходных не торопясь. Жарить яйца на масле, добавить ветчину и помидоры черри в конце.",
    [
      { name: "Яйцо С1", grams: 210 },
      { name: "Ветчина Империя Вкуса", grams: 100 },
      { name: "Томаты черри", grams: 100 },
      { name: "Подсолнечное масло", grams: 2 },
    ]
  );

  // ─── НАСТРОЙКИ (singleton) ────────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      targetKcal: 2100,
      targetProtein: 150,
      targetFat: 67,
      targetCarbs: 210,
    },
  });

  console.log("✅ Seed completed");
  console.log(`   ${products.length} products`);
  const mealCount = await prisma.meal.count();
  console.log(`   ${mealCount} meals`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
