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
  { name: "Тунец в банке", kcalPer100: 92, proteinPer100: 21, fatPer100: 1, carbsPer100: 0, packageSizeG: 150 },
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

  console.log("Deleting existing meals...");
  await prisma.weekPlanSlot.deleteMany({});
  await prisma.dailyLog.deleteMany({});
  await prisma.meal.deleteMany({});

  console.log("Seeding meals...");

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
    const meal = await prisma.meal.create({
      data: { name, type, prepMinutes, notes, ...macros },
    });
    await prisma.mealIngredient.createMany({
      data: ingredients.map((i) => ({
        mealId: meal.id,
        productId: byName(i.name),
        grams: i.grams,
      })),
    });
    return meal;
  }

  // ─── ЗАВТРАКИ ─────────────────────────────────────────────────────────────
  await upsertMeal(
    "Сырники с йогуртом и вишней",
    MealType.BREAKFAST, 20,
    "Смешать творог, яйцо, муку. Сформировать сырники. Обжарить на антипригарной сковороде с минимумом масла (или в аэрогриле 180°C, 10 мин). Подать с йогуртом и размороженной вишней.",
    [
      { name: "Творог 2% Хуторок", grams: 180 },
      { name: "Яйцо С1", grams: 70 },
      { name: "Мука пшеничная", grams: 30 },
      { name: "Подсолнечное масло", grams: 5 },
      { name: "Греческий йогурт Савушкин", grams: 125 },
      { name: "Вишня замороженная", grams: 100 },
    ]
  );

  await upsertMeal(
    "Яйца + ветчина + томаты черри",
    MealType.BREAKFAST, 10,
    "Яйца — вкрутую или глазунья. Ветчину и томаты черри подать рядом. Йогурт — отдельно. Протеин — взболтать с водой.",
    [
      { name: "Яйцо С1", grams: 140 },
      { name: "Ветчина Империя Вкуса", grams: 100 },
      { name: "Томаты черри", grams: 100 },
      { name: "Греческий йогурт Савушкин", grams: 125 },
      { name: "Протеин (скуп)", grams: 33 },
    ]
  );

  await upsertMeal(
    "Протеиновый капучино + бутерброд с ветчиной",
    MealType.BREAKFAST, 10,
    "Творог намазать, как «паштет», сверху ветчина и томаты черри. Перец нарезать слайсами. Протеин всыпать в готовый капучино и перемешать.",
    [
      { name: "Ветчина Империя Вкуса", grams: 200 },
      { name: "Творог 2% Хуторок", grams: 90 },
      { name: "Томаты черри", grams: 100 },
      { name: "Болгарский перец", grams: 80 },
      { name: "Капучино", grams: 200 },
      { name: "Протеин (скуп)", grams: 33 },
    ]
  );

  // ─── ОБЕДЫ (порция на 1 человека, готовить на 5) ─────────────────────────
  await upsertMeal(
    "Рис с Азу из индейки, грибами и овощами",
    MealType.LUNCH, 60,
    "Готовить в мультиварке на 5 порций. Лук и морковь обжарить на «Жарка» 5 мин. Добавить грибы, ещё 5 мин. Добавить индейку, перец, соевый соус. Сверху — промытый рис, залить водой (1:1.5). Режим «Плов» или «Рис». Разложить по контейнерам, хранить в холодильнике 5 дней.",
    [
      { name: "Азу из индейки Пава-Пава", grams: 90 },
      { name: "Шампиньоны", grams: 80 },
      { name: "Рис пропаренный", grams: 100 },
      { name: "Болгарский перец", grams: 40 },
      { name: "Морковь", grams: 20 },
      { name: "Лук репчатый", grams: 20 },
      { name: "Соевый соус", grams: 10 },
      { name: "Подсолнечное масло", grams: 2 },
    ]
  );

  await upsertMeal(
    "Медальоны из индейки с гречкой и квашеной капустой",
    MealType.LUNCH, 30,
    "Медальоны — в аэрогриль 180°C, 20–22 мин. Гречку отварить в пакетах. Квашеная капуста — как есть. Разложить по 5 контейнерам.",
    [
      { name: "Медальоны из индейки в маринаде", grams: 100 },
      { name: "Гречка в пакете", grams: 80 },
      { name: "Квашеная капуста", grams: 100 },
      { name: "Подсолнечное масло", grams: 1 },
    ]
  );

  // ─── УЖИНЫ ────────────────────────────────────────────────────────────────
  await upsertMeal(
    "Минтай в аэрогриле + яичные белки + томаты",
    MealType.DINNER, 20,
    "Минтай — в аэрогриль 200°C, 15 мин, сбрызнуть соевым соусом. Яичные белки — омлет на антипригарной сковороде без масла. Томаты и капуста — свежие.",
    [
      { name: "Филе минтая Borealis", grams: 200 },
      { name: "Яичный белок (бутылка)", grams: 150 },
      { name: "Томаты черри", grams: 100 },
      { name: "Квашеная капуста", grams: 100 },
      { name: "Соевый соус", grams: 20 },
    ]
  );

  await upsertMeal(
    "Тунец с овощами и кефиром",
    MealType.DINNER, 5,
    "Смешать тунец с овощами. Кефир — отдельно (можно добавить протеин и выпить как коктейль).",
    [
      { name: "Тунец в банке", grams: 150 },
      { name: "Томаты черри", grams: 100 },
      { name: "Болгарский перец", grams: 100 },
      { name: "Квашеная капуста", grams: 100 },
      { name: "Кефир", grams: 200 },
    ]
  );

  await upsertMeal(
    "Омлет из белков с ветчиной и перцем",
    MealType.DINNER, 10,
    "Взбить белки + 1 целое яйцо, добавить нарезанный перец и ветчину, вылить на сковороду без масла. Крышкой накрыть на 3–4 мин. Йогурт — соус или отдельно.",
    [
      { name: "Яичный белок (бутылка)", grams: 200 },
      { name: "Яйцо С1", grams: 70 },
      { name: "Ветчина Империя Вкуса", grams: 100 },
      { name: "Болгарский перец", grams: 100 },
      { name: "Томаты черри", grams: 100 },
      { name: "Греческий йогурт Савушкин", grams: 125 },
    ]
  );

  // ─── ПЕРЕКУСЫ (СЛАДКОЕ В ПЛАНЕ) ──────────────────────────────────────────
  await upsertMeal(
    "Зефир Коломенский",
    MealType.SNACK, 1,
    "1 шт (42г) — снимает ощущение запрета и контролирует тягу к сладкому.",
    [
      { name: "Зефир Коломенский", grams: 42 },
    ]
  );

  await upsertMeal(
    "Пастила",
    MealType.SNACK, 1,
    "1 пачка (28г) — хорошо гасит тягу к сладкому.",
    [
      { name: "Пастила", grams: 28 },
    ]
  );

  await upsertMeal(
    "Греческий йогурт с вишней",
    MealType.SNACK, 3,
    "Десерт с белком. Вишню разморозить или есть полузамороженной.",
    [
      { name: "Греческий йогурт Савушкин", grams: 125 },
      { name: "Вишня замороженная", grams: 100 },
    ]
  );

  await upsertMeal(
    "Кефир с протеином",
    MealType.SNACK, 2,
    "Шоколадный вкус закрывает тягу к сладкому. Смешать в шейкере.",
    [
      { name: "Кефир", grams: 200 },
      { name: "Протеин (скуп)", grams: 33 },
    ]
  );

  // ─── ВЫХОДНЫЕ ─────────────────────────────────────────────────────────────
  await upsertMeal(
    "Паста песто с индейкой и грибами",
    MealType.WEEKEND, 20,
    "Индейку обжарить с грибами и перцем ~10 мин. Пасту приготовить по инструкции. Подать всё вместе.",
    [
      { name: "Паста Песто Додо", grams: 270 },
      { name: "Азу из индейки Пава-Пава", grams: 150 },
      { name: "Шампиньоны", grams: 150 },
      { name: "Болгарский перец", grams: 100 },
    ]
  );

  await upsertMeal(
    "Карри с индейкой и рисом",
    MealType.WEEKEND, 25,
    "Лук + морковь обжарить. Добавить индейку, грибы, перец. Влить кефир + соевый соус, тушить 10 мин на медленном огне — получается кремовый соус. Подать с рисом.",
    [
      { name: "Азу из индейки Пава-Пава", grams: 200 },
      { name: "Рис пропаренный", grams: 80 },
      { name: "Шампиньоны", grams: 200 },
      { name: "Морковь", grams: 100 },
      { name: "Лук репчатый", grams: 100 },
      { name: "Болгарский перец", grams: 100 },
      { name: "Соевый соус", grams: 30 },
      { name: "Кефир", grams: 100 },
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
