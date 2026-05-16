# DRIP.STORE — Telegram Mini App

Каталог одежды для ресейлера. Telegram Mini App на Next.js + Node.js + PostgreSQL.

## Структура

```
reseller-bot/
├── server/   — Express API + Telegraf бот (Railway)
└── web/      — Next.js Mini App (Vercel)
```

---

## 1. Настройка базы данных (Railway)

1. Зарегистрируйся на [railway.app](https://railway.app)
2. New Project → Add a service → Database → PostgreSQL
3. После создания: Variables → скопируй `DATABASE_URL`

---

## 2. Настройка сервера (Railway)

1. В том же проекте: New Service → GitHub Repo → выбери репо → укажи `server/` как Root Directory
2. Добавь переменные (Variables):
   ```
   DATABASE_URL=  (из шага 1)
   BOT_TOKEN=     (новый токен от BotFather)
   ADMIN_TELEGRAM_ID=  (твой числовой Telegram ID — узнай у @userinfobot)
   FRONTEND_URL=  (URL Vercel, добавишь позже)
   PORT=3001
   NODE_ENV=production
   ```
3. В Settings → Build Command: `npm install && npm run db:generate && npm run db:push && npm run build`
4. Start Command: `npm start`

---

## 3. Настройка фронтенда (Vercel)

1. Зарегистрируйся на [vercel.com](https://vercel.com)
2. New Project → Import из GitHub → выбери папку `web/`
3. Добавь переменные окружения:
   ```
   NEXT_PUBLIC_API_URL=  (URL Railway сервера)
   NEXT_PUBLIC_SELLER_USERNAME=dollordol
   ```
4. Deploy

---

## 4. Привязка Mini App к боту

1. Открой @BotFather → /newapp
2. Выбери своего бота
3. Укажи URL Vercel
4. Получишь ссылку вида: `https://t.me/ИМЯ_БОТА/ИМЯ_ПРИЛОЖЕНИЯ`

---

## 5. Локальная разработка

### Сервер
```bash
cd server
cp .env.example .env   # заполни переменные
npm install
npm run db:push         # применяет схему к БД
npm run dev
```

### Фронтенд
```bash
cd web
cp .env.example .env.local   # заполни переменные
npm install
npm run dev
```

---

## Команды бота (для админа)

| Команда | Действие |
|---------|----------|
| `/add` | Добавить новый товар (пошаговый диалог) |
| `/list` | Показать последние 20 товаров |
| `/delete {id}` | Удалить товар по ID |
| `/cancel` | Отменить добавление |

### Процесс добавления товара через бота:
1. `/add`
2. Название RU → Название EN → Цена
3. Выбор категории (кнопки)
4. Выбор размеров (мультиселект, затем ✅ Готово)
5. Отправить фото

---

## Получить свой Telegram ID

Напиши боту [@userinfobot](https://t.me/userinfobot) — он вернёт твой числовой ID.
