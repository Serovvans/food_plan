# FoodPlan 🥗

Личное приложение для планирования питания. Генерирует недельный план, список покупок, трекает БЖУ и помогает бороться с тягой к сладкому.

**Стек:** Next.js 14 · PostgreSQL (Supabase) · NextAuth.js · Telegram Bot · Vercel

---

## Локальная разработка

### 1. Запуск базы данных

Нужен Docker:

```bash
docker compose up -d
```

Это поднимает PostgreSQL на порту **5433** (5432 может быть занят системным Postgres).

### 2. Применить схему и загрузить данные

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/foodplan" \
DIRECT_URL="postgresql://postgres:postgres@localhost:5433/foodplan" \
npx prisma migrate deploy

DATABASE_URL="postgresql://postgres:postgres@localhost:5433/foodplan" \
DIRECT_URL="postgresql://postgres:postgres@localhost:5433/foodplan" \
npx tsx prisma/seed.ts
```

### 3. Запустить приложение

```bash
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000)

**Пароль для входа:** см. `APP_PASSWORD` в `.env.local` (по умолчанию `foodplan2026`)

---

## Деплой на Vercel + Supabase

### Шаг 1 — Найти URL базы данных в Supabase

> ⚠️ **Важно про IPv4:** Новые проекты Supabase используют IPv6 для прямых подключений. Твой Mac и Vercel работают на IPv4, поэтому прямое подключение (`db.xxx.supabase.co`) **не работает** без платного IPv4 add-on. Решение — использовать **Pooler** (бесплатно, поддерживает IPv4).

1. Зайди на [supabase.com](https://supabase.com) → свой проект
2. Нажми **Connect** (кнопка вверху) или **Settings → Database**
3. Перейди на вкладку **Connection string**

Тебе нужны **два** URL из раздела Pooler:

#### DATABASE_URL → выбери **"Transaction pooler"** (порт 6543)

Нажми радиокнопку **Transaction pooler** → скопируй URI:
```
postgresql://postgres.jluoktpwvlykugrhttxu:QwOGtuTllmAoRBjR@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

#### DIRECT_URL → выбери **"Session pooler"** (порт 5432)

Нажми радиокнопку **Session pooler** → скопируй URI:
```
postgresql://postgres.ТВОЙ_ID:[ПАРОЛЬ]@aws-X-eu-central-1.pooler.supabase.com:5432/postgres
```

> ⚠️ Supabase показывает пароль в скобках `[YOUR-PASSWORD]` — это заглушка. Замени `[YOUR-PASSWORD]` на свой реальный пароль **без скобок**.
>
> ❗ **Не используй** прямое подключение `db.xxx.supabase.co:5432` — оно работает только по IPv6 (нет бесплатного IPv4).

Пример правильного `.env.local`:
```
DATABASE_URL=postgresql://postgres.jluoktpwvlykugrhttxu:MyPassword@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.jluoktpwvlykugrhttxu:MyPassword@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

---

### Шаг 2 — Применить схему и данные на Supabase

```bash
# Применить схему БД
set -a; source .env.local; set +a
npx prisma migrate deploy

# Загрузить продукты и блюда (32 продукта, 17 блюд)
DATABASE_URL="$DIRECT_URL" npx tsx prisma/seed.ts
```

Должно вывести: `✅ Seed completed · 32 products · 17 meals`

> **Почему `DATABASE_URL="$DIRECT_URL"` для seed?** Transaction pooler (порт 6543) не поддерживает prepared statements. Для seed используем Session pooler (порт 5432).

---

### Шаг 3 — Деплой на Vercel

1. Создай репозиторий на GitHub и запушь код:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/ТОЙ_НИКНЕЙМ/foodplan.git
   git push -u origin main
   ```

2. Зайди на [vercel.com](https://vercel.com) → **Add New Project** → выбери репозиторий

3. Во вкладке **Environment Variables** добавь все переменные:

   | Ключ | Значение |
   |------|----------|
   | `APP_PASSWORD` | Твой пароль для входа |
   | `NEXTAUTH_SECRET` | Случайная строка (см. ниже) |
   | `NEXTAUTH_URL` | `https://твой-сайт.vercel.app` |
   | `DATABASE_URL` | Pooler URL из Supabase (порт 6543) |
   | `DIRECT_URL` | Direct URL из Supabase (порт 5432) |
   | `TELEGRAM_BOT_TOKEN` | Токен бота (если настраиваешь) |
   | `TELEGRAM_WEBHOOK_SECRET` | Любая случайная строка |
   | `CRON_SECRET` | Любая случайная строка |

   Сгенерировать `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

4. Нажми **Deploy**

5. После деплоя скопируй URL (`https://foodplan-xxx.vercel.app`) и обнови `NEXTAUTH_URL` в настройках Vercel → **Redeploy**

---

### Шаг 4 — Настроить Telegram-бота (опционально)

#### Создать бота

1. Открой Telegram → найди [@BotFather](https://t.me/BotFather)
2. Отправь `/newbot`
3. Придумай имя (например: `FoodPlan Ivan`) и username (например: `foodplan_ivan_bot`)
4. Скопируй токен вида `1234567890:ABCdef...`
5. Добавь его в Vercel как `TELEGRAM_BOT_TOKEN` → Redeploy

#### Зарегистрировать webhook

После деплоя выполни (замени `<TOKEN>` и `<SECRET>` на свои значения):

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://твой-сайт.vercel.app/api/telegram/webhook",
    "secret_token": "<TELEGRAM_WEBHOOK_SECRET>"
  }'
```

Должен ответить: `{"ok":true,"result":true}`

#### Получить свой Chat ID

1. Открой своего бота в Telegram
2. Отправь `/start`
3. Бот пришлёт твой Chat ID
4. В приложении: **Настройки** → вставь Chat ID → Сохранить

После этого бот будет присылать:
- 📦 Воскресенье 10:00 — список покупок на неделю
- 🍳 Понедельник 07:00 — напоминание готовить обед

Доступные команды: `/today`, `/shopping`

---

## Структура проекта

```
app/
  (app)/          — страницы приложения (Сегодня, План, Рецепты, Покупки, Настройки)
  api/            — API endpoints
  login/          — страница входа
components/
  today/          — MacroRing, MealCard, CravingWidget
  layout/         — BottomNav
  ui/             — MacroBadge, ProgressBar
lib/
  plan-generator.ts    — алгоритм генерации недельного плана
  shopping-aggregator.ts — формирование списка покупок
  telegram.ts          — обёртка над Telegram Bot API
prisma/
  schema.prisma   — схема БД
  seed.ts         — 32 продукта + 17 блюд с расчитанными макросами
```

## Цели по БЖУ (по умолчанию)

| | Цель |
|-|------|
| Калории | 2100 ккал |
| Белки | 150 г |
| Жиры | 67 г |
| Углеводы | 210 г |

Изменяются в **Настройках** приложения.

## Команды

```bash
npm run dev          # локальная разработка
npm run build        # сборка
npm run db:seed      # заново загрузить продукты и блюда
npm run db:studio    # открыть Prisma Studio (просмотр БД)
```
