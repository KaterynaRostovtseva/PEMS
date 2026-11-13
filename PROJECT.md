# PEMS — как устроен проект

Памятка по репозиторию: что это, где какой файл, какими командами запускать и что уже сделано, а чего на экранах ещё нет.

Короткий английский README в корне — старое описание MVP. Карта всего репозитория — этот файл. Карта только клиента, простым языком — `client/README.md`.

## Что это

PEMS (Project & Workforce Management System) — внутренняя система для одной компании: люди, проекты, задачи, часы и зарплата.

Один человек регистрируется и становится владельцем новой организации. Все данные дальше живут внутри этой организации (`organizationId`). Чужую компанию пользователь не видит.

Роли:

| Роль | Кто это | Что может |
|---|---|---|
| `OWNER` | создаётся при регистрации | всё, включая роли, удаление и расчёт выплат |
| `MANAGER` | приглашённый менеджер | проекты, задачи, клиенты, приглашения, подтверждение часов |
| `EMPLOYEE` | сотрудник | свои проекты и свои записи времени |

Интерфейс на украинском. Тексты ошибок API в основном на русском.

## Как запустить

Монорепозиторий: зависимости ставятся из корня (`workspaces`: `server` и `client`).

```bash
# из корня D:\Projects\PEMS
npm install

# два терминала
npm run dev:server
npm run dev:client
```

Те же команды из папок:

```bash
cd server
npm run dev          # tsx watch src/index.ts, порт 3000

cd client
npm run dev          # React Router + Vite, обычно http://localhost:5173
```

Сборка:

```bash
npm run build:server
npm run build:client
```

База и Prisma (команды из папки `server`):

```bash
npm run prisma:generate   # клиент Prisma в server/src/generated/prisma
npm run prisma:migrate    # prisma migrate dev
npm run prisma:deploy     # prisma migrate deploy (без интерактива, для выкладки)
npm run prisma:studio     # просмотр таблиц
npm run prisma:validate
```

Схема лежит кусками в `server/prisma/schema/`. Скрипт `server/prisma/scripts/merge-prisma.mjs` склеивает их в `server/prisma/schema.prisma`. Конфиг Prisma 7 — `server/prisma.config.ts`, строка подключения берётся из `DATABASE_URL`.

Swagger локально: `http://localhost:3000/api-docs`.  
Выложенный API: `https://pems-i9a1.onrender.com/api-docs`.

## Переменные окружения

Секреты в этот файл не копировать.

Сервер, файл `server/.env`:

| Переменная | Зачем |
|---|---|
| `DATABASE_URL` | PostgreSQL (в README указан Neon) |
| `JWT_ACCESS_SECRET` | подпись access-токена (15 минут). Если пусто, в коде запасное значение `access` |
| `JWT_REFRESH_SECRET` | подпись refresh-токена (7 дней). Запасное значение `refresh` |
| `PORT` | порт сервера, по умолчанию 3000 |
| `NODE_ENV` | `production` включает secure-cookie и прячет текст внутренних ошибок |
| `API_URL` | базовый адрес сервера для ссылок на аватар |
| `APP_URL` | адрес клиента в письмах, по умолчанию `http://localhost:5173` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | почта. Без `SMTP_HOST` в разработке письма уходят в Ethereal, в ответе бывает `previewUrl` |
| `SMTP_ETHEREAL` | `false` отключает тестовую почту |

Клиент, файл `client/.env`:

| Переменная | Зачем |
|---|---|
| `VITE_API_URL` | куда ходит браузер. В `client/.env.example` это `http://localhost:3000` |

В `client/.env` сейчас `http://localhost:3000/api`, чтобы сайт ходил в локальный сервер и базу Neon. Адрес Render `https://pems-i9a1.onrender.com` остаётся в README и Swagger, но его база без таблиц, поэтому регистрация туда отвечает 500.

## Дерево папок

```
PEMS/
  package.json              скрипты dev:server, dev:client, build:*
  README.md                 короткое описание MVP
  PROJECT.md                этот файл
  client/                   фронтенд
  server/                   API
```

### Клиент `client/`

```
client/
  package.json
  .env / .env.example
  public/Logo.svg
  app/
    root.tsx                оболочка приложения, Redux Provider
    routes.ts               карта страниц
    app.css                 Tailwind
    routes/                 страницы
    components/             оболочки и куски интерфейса
    store/                  Redux и запросы к API
    lib/                    тема, токен, сборка имени
    welcome/                остаток шаблона React Router, в маршрутах не используется
```

Страницы (`app/routes/`):

| Файл | Адрес | Что делает |
|---|---|---|
| `HomePage.tsx` | `/` | лендинг: войти, регистрация или «открыть кабинет» |
| `LoginPage.tsx` | `/login` | вход |
| `RegisterPage.tsx` | `/register` | компания, имя, фамилия, email, пароль. Создаёт организацию и OWNER |
| `DashboardPage.tsx` | `/dashboard` | выбирает дашборд по роли |
| `ProfilePage.tsx` | `/profile` | имя, email, роль, организация, аватар |
| `admin/TeamPage.tsx` | `/admin/team` | таблица людей. Роль меняет только OWNER |

Оболочки (`app/components/`):

| Файл | Зачем |
|---|---|
| `GuestRoute.tsx` | `/login` и `/register` только без токена, иначе редирект в кабинет |
| `ProtectedRoute.tsx` | всё внутри кабинета только с токеном |
| `AuthHydrator.tsx` | при старте читает токен и пользователя из `localStorage` |
| `AppShell.tsx` | шапка, сайдбар, заголовок страницы, поиск-заглушка, переключатель языка |
| `Sidebar.tsx` | меню. Рабочие пункты: Дашборд и Команда. Проекты, Завдання и Оплата нарисованы, но никуда не ведут |
| `UserMenu.tsx` | аватар, имя, выход |
| `ThemeToggle.tsx` + `lib/theme.ts` | светлая и тёмная тема, запоминается в `localStorage` |
| `OwnerManagerRoute.tsx` | пускает OWNER и MANAGER. Сотрудника отправляет на `/dashboard` |
| `dashboard/OwnerDashboard.tsx` | цифры по людям, проектам и часам |
| `dashboard/ManagerDashboard.tsx` | проекты, команда, часы, которые ещё не решены |
| `dashboard/EmployeeDashboard.tsx` | свои проекты и свои часы |
| `dashboard/shared.tsx` | карточки, списки проектов и часов |

Состояние (`app/store/`):

| Файл | Зачем |
|---|---|
| `store.ts` | Redux store |
| `hooks.ts` | типизированные `useAppDispatch` / `useAppSelector` |
| `authSlice.ts` | токен и пользователь в памяти |
| `baseQuery.ts` | общий fetch: подставляет Bearer, при 401 один раз зовёт `/auth/refresh` и повторяет запрос |
| `apiSlice.ts` | login, register, logout, профиль, проекты, часы |
| `userApi.ts` | список пользователей и смена роли |

Прочее в `app/lib/`:

| Файл | Зачем |
|---|---|
| `authStorage.ts` | `localStorage`: ключи `token` и `user` |
| `personName.ts` | на экране имя собирается так: `displayName`, иначе «имя фамилия». Старый `fullName` из прошлой сессии ещё показывается, пока человек не войдёт заново |

Маршруты собраны в `app/routes.ts`:

```
/                       home
/login, /register       GuestRoute
/dashboard, /profile    ProtectedRoute + AppShell
/admin/team             ещё и OwnerManagerRoute (владелец или менеджер)
```

### Сервер `server/`

Запрос идёт так: маршрут → контроллер → Zod-схема → сервис → Prisma.

```
server/
  src/index.ts                 Express: cors, json, cookie, /uploads, swagger, маршруты
  src/routes/                  URL и кто имеет право
  src/controllers/             разобрать запрос, отдать ответ
  src/schemas/                 проверка тела запроса (Zod)
  src/services/                логика и запросы к базе
  src/middlewares/             токен, роли, доступ к проекту, загрузка файла, ошибки
  src/lib/                     prisma, токены
  src/utils/                   ошибки, пагинация, аватар, выбор полей пользователя
  src/swagger/                 описание API для /api-docs
  src/types/                   тип авторизованного запроса
  prisma/schema/               куски схемы
  prisma/migrations/           история миграций
  uploads/                     загруженные файлы, раздаются как /uploads
```

Контроллер и сервис называются одинаково по предмету: `auth`, `user`, `profile`, `organization`, `client`, `project`, `project-member`, `project-stage`, `task`, `time-entry`, `payment`, `invitation` / `invite`, `file`. Почта — только сервис `email.service.ts`, отдельного маршрута нет.

## Авторизация

1. Регистрация или вход возвращают `accessToken` в JSON и кладут refresh в httpOnly-cookie `refreshToken`.
2. Клиент пишет access в `localStorage` и шлёт заголовок `Authorization: Bearer ...`.
3. В токене лежат `userId`, `organizationId`, `role`.
4. Access живёт 15 минут. Клиент при 401 вызывает `POST /api/auth/refresh`, сервер крутит refresh (старый отзывает, новый выдаёт).
5. Выход помечает refresh отозванным.
6. Пароль хранится как bcrypt-хеш. Сброс пароля и приглашение хранят не сам токен, а его хеш.

## База

PostgreSQL. Модели по файлам:

| Файл | Модели |
|---|---|
| `enums.prisma` | роли, валюты, статусы проекта, задачи, приглашения, часов, стадии, роль в проекте |
| `organization.prisma` | `Organization` |
| `auth.prisma` | `User`, `RefreshToken`, `Invitation`, `PasswordResetToken` |
| `crm.prisma` | `Client` |
| `project.prisma` | `Project`, `ProjectMember`, `ProjectStage`, `ProjectStageHistory` |
| `task.prisma` | `Task` |
| `time-tracking.prisma` | `TimeEntry` |
| `payroll.prisma` | `Payment` |
| `storage.prisma` | `FileAsset` |

Смысл связей:

- Организация — корень. К ней привязаны люди, клиенты, проекты, приглашения, файлы.
- Пользователь: `firstName`, `lastName`, необязательный `displayName`, должность, ставка `hourlyRate`, валюта USD/EUR/UAH, флаг ФОП 3 группы `isFop3Group`. Email уникален внутри организации, не во всей базе.
- Проект: код уникален в организации, статус `ACTIVE / ON_HOLD / COMPLETED / ARCHIVED`, бюджет, менеджер, цвет, клиент. Участник проекта имеет роль вроде `DEVELOPER`, `DESIGNER`, `QA`.
- Стадия проекта: имя, порядок, статус `TODO / ACTIVE / COMPLETED`, история смен.
- Задача: `TODO / IN_PROGRESS / REVIEW / DONE`, приоритет `LOW / MEDIUM / HIGH`, исполнитель, стадия, мягкое удаление (`deletedAt`).
- Часы: дата, часы, комментарий, статус `PENDING / APPROVED / REJECTED`, кто подтвердил.
- Выплата: одна ведомость на человека и месяц. Считается из подтверждённых часов этого месяца × ставка. Для ФОП 3 группы в коде налог = 5% единого + 22% ЕСВ от gross. Потом выплату отмечают оплаченной.
- Файл можно привязать к организации, проекту или задаче.

Миграции в `server/prisma/migrations/`, от старых к новым: пользователь → пароль → refresh → роли → проекты → полная схема → приглашения, сброс пароля и файлы → переименование пароля → `update_user_model`. Последняя как раз заменила одно поле `fullName` на `firstName` и `lastName`. Код сервисов и клиента уже переведён на эти поля.

## API

Всё, кроме Swagger и `/uploads`, висит на префиксе `/api`. Почти все маршруты требуют Bearer-токен. Исключение — ` /api/auth/*`.

`/api/auth`

| Метод | Путь | Кто |
|---|---|---|
| POST | `/register` | гость. Тело: `companyName`, `email`, `password`, `firstName`, `lastName` |
| POST | `/login` | гость |
| POST | `/refresh` | cookie |
| POST | `/logout` | cookie |
| POST | `/forgot-password` | гость |
| POST | `/reset-password` | гость |
| POST | `/accept-invite` | гость. Тело: `token`, `password`, `firstName`, `lastName` |

`/api/organizations` — `GET /current`, `PATCH /current` (только OWNER).

`/api/users`

| Метод | Путь | Кто |
|---|---|---|
| GET, PATCH | `/me` | любой вошедший. Профиль |
| PATCH | `/me/password` | любой вошедший |
| GET | `/` и `/:id` | OWNER, MANAGER |
| PATCH | `/:id` | OWNER, MANAGER |
| PATCH | `/:id/role` | OWNER |
| DELETE | `/:id` | OWNER |
| GET, POST | `/invites` | OWNER, MANAGER |

`/api/clients` — список и карточка всем вошедшим; создать и менять — OWNER и MANAGER; удалить — OWNER.

`/api/projects`

| Метод | Путь | Кто |
|---|---|---|
| GET | `/` и `/:id` | вошедший. Сотрудник видит проекты, куда его добавили |
| POST, PATCH | `/` и `/:id` | OWNER, MANAGER |
| DELETE | `/:id` | OWNER |
| GET, POST, PATCH, DELETE | `/:projectId/members` | менять состав — OWNER и MANAGER |
| GET, POST | `/:projectId/stages` | создавать стадии — OWNER и MANAGER |
| PATCH, DELETE | `/:stageId` | удалить стадию — OWNER |
| GET | `/:stageId/history` | вошедший |

`/api/tasks` — список и карточка всем, у кого есть доступ; создать и удалить — OWNER и MANAGER; править и менять статус — вошедший (сервис сам режет лишнее).

`/api/time-entries`

| Метод | Путь | Кто |
|---|---|---|
| POST | `/` | вошедший, свои часы |
| GET | `/my` | свои |
| GET | `/` | OWNER, MANAGER |
| PATCH, DELETE | `/:id` | сотрудник — только свои и только пока статус PENDING |
| PATCH | `/:id/approve` и `/:id/reject` | OWNER, MANAGER |

`/api/payments` — список, `POST /calculate`, `PATCH /:id/pay` только OWNER. Карточка по id — любой вошедший, но сервис всё равно проверяет организацию.

`/api/invitations` — список, создать, отменить: OWNER и MANAGER. Это второй вход в приглашения, рядом с `/api/users/invites`.

`/api/files` — `POST /upload`, `GET /:id`, `DELETE /:id`. Файл кладётся в `server/uploads` и отдаётся по `/uploads/...`.

Списки почти везде с пагинацией: `?page=&limit=`, ответ `{ data, meta }`.

## Что уже есть на экране

Сделано и можно открыть:

- лендинг, вход, регистрация с именем и фамилией;
- кабинет с сайдбаром, сворачиванием меню, тёмной темой;
- три дашборда (владелец / менеджер / сотрудник): цифры, список проектов, последние часы;
- профиль на чтение;
- страница команды и смена роли владельцем;
- выход и тихое обновление access-токена.

Дашборды уже читают `GET` проектов и часов. Форм, чтобы создать проект, задачу, списать часы или посчитать зарплату, в интерфейсе нет.

В сайдбаре «Проєкти», «Завдання» и блок «Оплата» — заглушки, пунктов-ссылок у них нет. Поиск в шапке и переключатель языка тоже только нарисованы.

Клиент сейчас вызывает API так (`client/app/store`):

| Экран | Куда стучится |
|---|---|
| вход / регистрация / выход | `/auth/login`, `/auth/register`, `/auth/logout` |
| обновление токена | `/auth/refresh` |
| профиль | `/profile` |
| проекты | `/projects?limit=50` |
| часы | `/time-entries?limit=20` |
| команда | `/users?limit=100`, смена роли `PATCH /users/:id/role` |

## Чего ещё нет

Экранов нет, API для этого уже написан. Имеет смысл делать в таком порядке:

1. Проекты: список, создание, карточка, участники.
2. Задачи внутри проекта.
3. Списание часов сотрудником и подтверждение менеджером.
4. Выплаты для владельца: посчитать месяц и отметить «оплачено».
5. Приглашение человека письмом и страница принятия приглашения (`/accept-invite` на клиенте нет).
6. Забытый пароль и смена пароля в профиле.
7. Клиенты (заказчики проектов).
8. Редактирование профиля: имя, должность, ставка, аватар.
9. Стадии проекта.

Пока это проверяется через Swagger, не через сайт.

## На что обратить внимание

Это не список дел «надо срочно», а места, о которые легко споткнуться, когда возвращаешься к коду.

- Клиент ходит без префикса `/api`, сервер слушает только `/api/...`. Профиль на клиенте — `/profile`, на сервере — `/api/users/me`. Пока `VITE_API_URL` смотрит на адрес без этого префикса, кабинет после входа не подтянет данные. Либо дописать `/api` в базу запросов и поправить путь профиля, либо повесить на сервере те же пути без префикса.
- В `server/src/routes/project-member.routes.ts` опечатка `cconst router`. Файл из-за этого не разбирается, и сервер не стартует, пока строка не станет `const router`.
- `GET /api/users/invites` объявлен после `GET /api/users/:id`. Запрос списка приглашений может попасть в «пользователь с id = invites».
- Стадии смонтированы на тот же префикс `/api/projects`, и `PATCH /:stageId` легко пересекается с `PATCH /:id` проекта.
- Приглашения есть и в `/api/users/invites`, и в `/api/invitations`.
- Поиск пользователя по email — `findFirst`, потому что почта уникальна только внутри организации. Если один email окажется в двух компаниях, вход возьмёт первую найденную запись.
- Налог ФОП в `payment.service.ts` упрощённый: 5% + 22% от gross, без минимального ЕСВ.
- `welcome/` в клиенте — неиспользуемый шаблон. Его можно не трогать.
