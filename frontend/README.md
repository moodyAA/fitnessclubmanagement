# FitClub Admin — Frontend

Веб-панель администратора фитнес-зала.

## Стек

- React 19 + TypeScript
- React Router
- Vite
- Mock-данные (готово к подключению Django DRF)

## Запуск

```bash
cd frontend
npm install
npm run dev
```

Откройте http://localhost:5173

## Разделы

| Страница | Аналог в Access |
|---|---|
| Главная | Главная форма БД |
| Клиенты | Форма «Клиент» |
| Договоры | Форма «Договор» + платежи |
| Абонементы | Форма «Абонемент» + договоры |
| Залы | Форма «Зал» |
| Типы занятий | Форма «ТипЗанятия» |
| Запись на занятие | Форма «Запись_на_занятие» |
| Отчёты | 4 отчёта из курсовой |

## Подключение Django DRF

1. Запустите бэкенд на `http://localhost:8000`
2. Создайте `.env`:

```
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK=false
```

3. Замените вызовы в `DataContext` на `apiFetch()` из `src/api/client.ts`

## Сборка

```bash
npm run build
npm run preview
```
