/** Тексти екранів українською і англійською. t("ключ") повертає рядок поточної мови. */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "uk" | "en";

export const LANG_KEY = "pems.lang";

const uk = {
  "meta.home": "PEMS",
  "home.kicker": "PEMS",
  "home.title": "Керування проєктами та співробітниками",
  "home.subtitle": "Облік проєктів, часу та виплат для команди.",
  "home.open": "Відкрити кабінет",
  "home.login": "Увійти",
  "home.register": "Реєстрація",
  "login.title": "Вхід",
  "login.password": "Пароль",
  "login.submit": "Увійти",
  "login.submitting": "Вхід…",
  "login.noAccount": "Немає акаунта?",
  "login.register": "Реєстрація",
  "login.authError": "Помилка авторизації. Перевірте дані.",
  "login.network": "Не вдалося з'єднатися з сервером. Перевірте, що API запущено на порту 3000.",
  "register.title": "Реєстрація",
  "register.subtitle": "Створіть організацію та акаунт власника",
  "register.company": "Компанія",
  "register.firstName": "Імʼя",
  "register.lastName": "Прізвище",
  "register.password": "Пароль",
  "register.submit": "Зареєструватися",
  "register.submitting": "Створюємо…",
  "register.hasAccount": "Вже є акаунт?",
  "register.login": "Увійти",
  "register.error": "Помилка реєстрації. Перевірте введені дані.",
  "nav.dashboard": "Дашборд",
  "nav.team": "Команда",
  "nav.projects": "Проєкти",
  "nav.tasks": "Завдання",
  "nav.soon": "скоро",
  "nav.billing": "Оплата",
  "nav.billingContact": "Контакт для оплати",
  "nav.billingInfo": "Платіжна інформація",
  "nav.collapse": "Згорнути",
  "nav.expand": "Розгорнути",
  "nav.collapseMenu": "Згорнути меню",
  "nav.expandMenu": "Розгорнути меню",
  "shell.search": "Пошук…",
  "shell.language": "Мова",
  "shell.uk": "Українська",
  "shell.en": "English",
  "shell.notifications": "Сповіщення",
  "shell.noNotifications": "Нових сповіщень немає",
  "shell.loading": "Завантаження…",
  "theme.light": "Світла тема",
  "theme.dark": "Темна тема",
  "menu.user": "Користувач",
  "menu.profile": "Профіль",
  "menu.logout": "Вийти",
  "role.OWNER": "Власник",
  "role.MANAGER": "Менеджер",
  "role.EMPLOYEE": "Співробітник",
  "dash.welcome": "Вітаємо, {name}",
  "dash.ownerFallback": "власнику",
  "dash.managerFallback": "менеджере",
  "dash.employeeFallback": "колего",
  "dash.ownerOrg": "організація «{name}»",
  "dash.ownerOverview": "огляд організації",
  "dash.managerSubtitle": "керування проєктами та командою",
  "dash.employeeSubtitle": "ваші проєкти та облік часу",
  "dash.members": "Учасники",
  "dash.roleSplit": "{owners} власн. · {managers} мен. · {employees} співр.",
  "dash.projects": "Проєкти",
  "dash.active": "{count} активних",
  "dash.timeEntries": "Записи часу",
  "dash.latestOrg": "останні в організації",
  "dash.role": "Роль",
  "dash.fullAccess": "повний доступ",
  "dash.manageTeam": "Керування командою →",
  "dash.profile": "Профіль →",
  "dash.teamLink": "Команда →",
  "dash.latestTime": "Останні записи часу",
  "dash.allProjects": "усі в організації",
  "dash.team": "Команда",
  "dash.withoutOwners": "без власників",
  "dash.forReview": "для модерації та контролю",
  "dash.waiting": "Очікують",
  "dash.pendingHint": "статус pending / submitted",
  "dash.viewTeam": "Переглянути команду →",
  "dash.teamTime": "Записи часу команди",
  "dash.teamRoster": "Склад команди",
  "dash.noMembers": "Поки немає учасників команди.",
  "dash.myProjects": "Мої проєкти",
  "dash.whereAdded": "куди вас додано",
  "dash.myHours": "Мої години",
  "dash.recentEntries": "за останніми записами",
  "dash.approved": "Підтверджено",
  "dash.approvedHint": "записів зі статусом approved",
  "dash.myProfile": "Мій профіль →",
  "dash.myTime": "Мій час",
  "dash.notInProjects": "Вас ще не додано до проєктів.",
  "list.loadingProjects": "Завантаження проєктів…",
  "list.noProjects": "Поки немає доступних проєктів.",
  "list.loadingTime": "Завантаження записів часу…",
  "list.noTime": "Записів часу поки немає.",
  "list.project": "Проєкт",
  "list.hours": "{hours} год",
  "team.title": "Керування командою",
  "team.name": "Імʼя",
  "team.role": "Роль",
  "team.changeRole": "Змінити роль",
  "team.loadError": "Не вдалося завантажити список користувачів",
  "team.roleError": "Помилка під час зміни ролі",
  "profile.title": "Профіль",
  "profile.name": "Імʼя",
  "profile.role": "Роль",
  "profile.org": "Організація",
  "error.oops": "Ой!",
  "error.unexpected": "Сталася неочікувана помилка.",
  "error.generic": "Помилка",
  "error.notFound": "Запитану сторінку не знайдено.",
} as const;

const en: Record<keyof typeof uk, string> = {
  "meta.home": "PEMS",
  "home.kicker": "PEMS",
  "home.title": "Project and workforce management",
  "home.subtitle": "Track projects, time, and payroll for your team.",
  "home.open": "Open workspace",
  "home.login": "Sign in",
  "home.register": "Register",
  "login.title": "Sign in",
  "login.password": "Password",
  "login.submit": "Sign in",
  "login.submitting": "Signing in…",
  "login.noAccount": "No account yet?",
  "login.register": "Register",
  "login.authError": "Sign-in failed. Check your details.",
  "login.network": "Could not reach the server. Make sure the API is running on port 3000.",
  "register.title": "Register",
  "register.subtitle": "Create an organization and an owner account",
  "register.company": "Company",
  "register.firstName": "First name",
  "register.lastName": "Last name",
  "register.password": "Password",
  "register.submit": "Create account",
  "register.submitting": "Creating…",
  "register.hasAccount": "Already have an account?",
  "register.login": "Sign in",
  "register.error": "Registration failed. Check the form.",
  "nav.dashboard": "Dashboard",
  "nav.team": "Team",
  "nav.projects": "Projects",
  "nav.tasks": "Tasks",
  "nav.soon": "soon",
  "nav.billing": "Billing",
  "nav.billingContact": "Billing contact",
  "nav.billingInfo": "Payment details",
  "nav.collapse": "Collapse",
  "nav.expand": "Expand",
  "nav.collapseMenu": "Collapse menu",
  "nav.expandMenu": "Expand menu",
  "shell.search": "Search…",
  "shell.language": "Language",
  "shell.uk": "Українська",
  "shell.en": "English",
  "shell.notifications": "Notifications",
  "shell.noNotifications": "No new notifications",
  "shell.loading": "Loading…",
  "theme.light": "Light theme",
  "theme.dark": "Dark theme",
  "menu.user": "User",
  "menu.profile": "Profile",
  "menu.logout": "Sign out",
  "role.OWNER": "Owner",
  "role.MANAGER": "Manager",
  "role.EMPLOYEE": "Employee",
  "dash.welcome": "Welcome, {name}",
  "dash.ownerFallback": "owner",
  "dash.managerFallback": "manager",
  "dash.employeeFallback": "there",
  "dash.ownerOrg": "organization “{name}”",
  "dash.ownerOverview": "organization overview",
  "dash.managerSubtitle": "projects and team",
  "dash.employeeSubtitle": "your projects and time",
  "dash.members": "People",
  "dash.roleSplit": "{owners} owners · {managers} mgrs · {employees} staff",
  "dash.projects": "Projects",
  "dash.active": "{count} active",
  "dash.timeEntries": "Time entries",
  "dash.latestOrg": "latest in the organization",
  "dash.role": "Role",
  "dash.fullAccess": "full access",
  "dash.manageTeam": "Manage team →",
  "dash.profile": "Profile →",
  "dash.teamLink": "Team →",
  "dash.latestTime": "Latest time entries",
  "dash.allProjects": "all in the organization",
  "dash.team": "Team",
  "dash.withoutOwners": "excluding owners",
  "dash.forReview": "for review",
  "dash.waiting": "Waiting",
  "dash.pendingHint": "pending / submitted",
  "dash.viewTeam": "View team →",
  "dash.teamTime": "Team time entries",
  "dash.teamRoster": "Team roster",
  "dash.noMembers": "No team members yet.",
  "dash.myProjects": "My projects",
  "dash.whereAdded": "where you were added",
  "dash.myHours": "My hours",
  "dash.recentEntries": "from recent entries",
  "dash.approved": "Approved",
  "dash.approvedHint": "entries with status approved",
  "dash.myProfile": "My profile →",
  "dash.myTime": "My time",
  "dash.notInProjects": "You have not been added to any projects yet.",
  "list.loadingProjects": "Loading projects…",
  "list.noProjects": "No projects yet.",
  "list.loadingTime": "Loading time entries…",
  "list.noTime": "No time entries yet.",
  "list.project": "Project",
  "list.hours": "{hours} h",
  "team.title": "Team management",
  "team.name": "Name",
  "team.role": "Role",
  "team.changeRole": "Change role",
  "team.loadError": "Could not load the user list",
  "team.roleError": "Could not change the role",
  "profile.title": "Profile",
  "profile.name": "Name",
  "profile.role": "Role",
  "profile.org": "Organization",
  "error.oops": "Oops!",
  "error.unexpected": "An unexpected error occurred.",
  "error.generic": "Error",
  "error.notFound": "The requested page was not found.",
};

export type MessageKey = keyof typeof uk;

const dictionaries: Record<Locale, Record<MessageKey, string>> = { uk, en };

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>
) {
  let text = dictionaries[locale][key] ?? dictionaries.uk[key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "uk";
  try {
    return localStorage.getItem(LANG_KEY) === "en" ? "en" : "uk";
  } catch {
    return "uk";
  }
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uk");

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (next) => {
        setLocaleState(next);
        try {
          localStorage.setItem(LANG_KEY, next);
        } catch {
          // ігноруємо, якщо сховище недоступне
        }
      },
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (ctx) return ctx;
  return {
    locale: "uk" as Locale,
    setLocale: () => {},
    t: (key: MessageKey, vars?: Record<string, string | number>) => translate("uk", key, vars),
  };
}
