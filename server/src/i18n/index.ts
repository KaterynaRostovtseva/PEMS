import type { Request } from "express";

export type Locale = "uk" | "en";

const catalog: Record<string, Record<Locale, string>> = {
  "Пользователь с таким email уже существует": {
    uk: "Користувач з такою поштою вже існує",
    en: "A user with this email already exists",
  },
  "Организация не найдена": {
    uk: "Організацію не знайдено",
    en: "Organization not found",
  },
  "Нельзя пригласить второго OWNER через invite": {
    uk: "Не можна запросити другого власника через запрошення",
    en: "A second owner cannot be invited",
  },
  "Приглашение не найдено": {
    uk: "Запрошення не знайдено",
    en: "Invitation not found",
  },
  "Приглашение уже принято": {
    uk: "Запрошення вже прийнято",
    en: "Invitation has already been accepted",
  },
  "Приглашение недействительно или истекло": {
    uk: "Запрошення недійсне або прострочене",
    en: "Invitation is invalid or expired",
  },
  "Токен сброса недействителен или истёк": {
    uk: "Токен скидання недійсний або прострочений",
    en: "Reset token is invalid or expired",
  },
  "Если аккаунт существует, письмо отправлено": {
    uk: "Якщо акаунт існує, лист надіслано",
    en: "If the account exists, an email has been sent",
  },
  "Пароль успешно изменён": {
    uk: "Пароль успішно змінено",
    en: "Password changed successfully",
  },
  "Пароль успешно изменён. Войдите заново.": {
    uk: "Пароль успішно змінено. Увійдіть знову.",
    en: "Password changed successfully. Please sign in again.",
  },
  "Проект не найден": {
    uk: "Проєкт не знайдено",
    en: "Project not found",
  },
  "Стадия не найдена": {
    uk: "Стадію не знайдено",
    en: "Stage not found",
  },
  "projectId обязателен": {
    uk: "projectId обов'язковий",
    en: "projectId is required",
  },
  "Заголовок задачи (title) обязателен": {
    uk: "Заголовок завдання обов'язковий",
    en: "Task title is required",
  },
  "status обязателен": {
    uk: "Статус обов'язковий",
    en: "Status is required",
  },
  "Задача успешно удалена": {
    uk: "Завдання успішно видалено",
    en: "Task deleted",
  },
  "Исполнитель должен быть участником проекта": {
    uk: "Виконавець має бути учасником проєкту",
    en: "The assignee must be a project member",
  },
  "Задача не найдена": {
    uk: "Завдання не знайдено",
    en: "Task not found",
  },
  "Файл обязателен (поле file)": {
    uk: "Файл обов'язковий (поле file)",
    en: "A file is required (field file)",
  },
  "Файл не найден": {
    uk: "Файл не знайдено",
    en: "File not found",
  },
  "Можно удалять только свои файлы": {
    uk: "Можна видаляти лише свої файли",
    en: "You can delete only your own files",
  },
  "Файл удалён": {
    uk: "Файл видалено",
    en: "File deleted",
  },
  "Запись времени удалена": {
    uk: "Запис часу видалено",
    en: "Time entry deleted",
  },
  "Ведомость удалена": {
    uk: "Відомість видалено",
    en: "Payroll record deleted",
  },
  "Пользователь не найден": {
    uk: "Користувача не знайдено",
    en: "User not found",
  },
  "Недопустимая роль": {
    uk: "Недопустима роль",
    en: "Invalid role",
  },
  "Нельзя изменить свою собственную роль": {
    uk: "Не можна змінити власну роль",
    en: "You cannot change your own role",
  },
  "Роль успешно обновлена": {
    uk: "Роль успішно оновлено",
    en: "Role updated",
  },
  "Нельзя удалить свой собственный аккаунт": {
    uk: "Не можна видалити власний акаунт",
    en: "You cannot delete your own account",
  },
  "Пользователь удалён": {
    uk: "Користувача видалено",
    en: "User deleted",
  },
  "Клиент удалён": {
    uk: "Клієнта видалено",
    en: "Client deleted",
  },
  "Клиент не найден": {
    uk: "Клієнта не знайдено",
    en: "Client not found",
  },
  "Менеджер не найден": {
    uk: "Менеджера не знайдено",
    en: "Manager not found",
  },
  "Проект с таким кодом уже есть": {
    uk: "Проєкт з таким кодом вже існує",
    en: "A project with this code already exists",
  },
  "Сотрудник не найден": {
    uk: "Співробітника не знайдено",
    en: "Employee not found",
  },
  "Сотрудник уже добавлен в этот проект": {
    uk: "Співробітника вже додано до цього проєкту",
    en: "This employee is already on the project",
  },
  "Проект или сотрудник не найден": {
    uk: "Проєкт або співробітника не знайдено",
    en: "Project or employee not found",
  },
  "Участник проекта не найден": {
    uk: "Учасника проєкту не знайдено",
    en: "Project member not found",
  },
  "Название компании обязательно": {
    uk: "Назва компанії обов'язкова",
    en: "Company name is required",
  },
  "Неверный email или пароль, либо аккаунт неактивен": {
    uk: "Невірна пошта чи пароль, або акаунт неактивний",
    en: "Wrong email or password, or the account is inactive",
  },
  "Неверный email или пароль": {
    uk: "Невірна пошта або пароль",
    en: "Wrong email or password",
  },
  "Refresh token отсутствует": {
    uk: "Відсутній refresh token",
    en: "Refresh token is missing",
  },
  "Невалидный или просроченный Refresh token": {
    uk: "Недійсний або прострочений refresh token",
    en: "Invalid or expired refresh token",
  },
  "Токен не найден или отозван": {
    uk: "Токен не знайдено або його відкликано",
    en: "Token was not found or has been revoked",
  },
  "Аккаунт неактивен": {
    uk: "Акаунт неактивний",
    en: "Account is inactive",
  },
  "Выплата не найдена": {
    uk: "Виплату не знайдено",
    en: "Payment not found",
  },
  "Ведомость за этот период уже существует": {
    uk: "Відомість за цей період вже існує",
    en: "A payroll record for this period already exists",
  },
  "Выплата уже отмечена как оплаченная": {
    uk: "Виплату вже позначено як оплачену",
    en: "This payment is already marked as paid",
  },
  "Нельзя удалить оплаченную ведомость": {
    uk: "Не можна видалити оплачену відомість",
    en: "A paid payroll record cannot be deleted",
  },
  "Нет доступа к этому проекту": {
    uk: "Немає доступу до цього проєкту",
    en: "You do not have access to this project",
  },
  "Задача не найдена в этом проекте": {
    uk: "Завдання в цьому проєкті не знайдено",
    en: "Task was not found in this project",
  },
  "Запись времени не найдена": {
    uk: "Запис часу не знайдено",
    en: "Time entry not found",
  },
  "Можно редактировать только свои записи": {
    uk: "Можна редагувати лише свої записи",
    en: "You can edit only your own entries",
  },
  "Можно редактировать только записи со статусом PENDING": {
    uk: "Можна редагувати лише записи зі статусом PENDING",
    en: "Only PENDING entries can be edited",
  },
  "Можно удалять только свои записи": {
    uk: "Можна видаляти лише свої записи",
    en: "You can delete only your own entries",
  },
  "Можно удалять только записи со статусом PENDING": {
    uk: "Можна видаляти лише записи зі статусом PENDING",
    en: "Only PENDING entries can be deleted",
  },
  "Профиль не найден": {
    uk: "Профіль не знайдено",
    en: "Profile not found",
  },
  "Email уже занят": {
    uk: "Цю пошту вже зайнято",
    en: "This email is already taken",
  },
  "Неверный текущий пароль": {
    uk: "Невірний поточний пароль",
    en: "Current password is wrong",
  },
  "Новый пароль должен отличаться от текущего": {
    uk: "Новий пароль має відрізнятися від поточного",
    en: "The new password must be different from the current one",
  },
  "Аватар должен быть изображением": {
    uk: "Аватар має бути зображенням",
    en: "The avatar must be an image",
  },
  "Успешный выход": {
    uk: "Вихід виконано",
    en: "Signed out",
  },
  "Нет доступа. Токен отсутствует": {
    uk: "Немає доступу. Токен відсутній",
    en: "Access denied. Token is missing",
  },
  "Недействительный или просроченный токен доступа": {
    uk: "Недійсний або прострочений токен доступу",
    en: "Access token is invalid or expired",
  },
  "Необходима авторизация": {
    uk: "Потрібна авторизація",
    en: "Authentication is required",
  },
  "Недостаточно прав для выполнения действия": {
    uk: "Недостатньо прав для цієї дії",
    en: "You do not have permission for this action",
  },
  "Ошибка валидации данных": {
    uk: "Помилка перевірки даних",
    en: "Validation error",
  },
  "Запись с такими уникальными данными уже существует": {
    uk: "Запис з такими унікальними даними вже існує",
    en: "A record with these unique values already exists",
  },
  "Файл слишком большой (макс. 10MB)": {
    uk: "Файл завеликий (максимум 10 МБ)",
    en: "File is too large (max 10MB)",
  },
  "Недопустимый тип файла": {
    uk: "Недопустимий тип файлу",
    en: "This file type is not allowed",
  },
  "Внутренняя ошибка сервера": {
    uk: "Внутрішня помилка сервера",
    en: "Internal server error",
  },
  "Некорректный или отсутствующий projectId": {
    uk: "Некоректний або відсутній projectId",
    en: "projectId is missing or invalid",
  },
  "У вас нет доступа к этому проекту": {
    uk: "У вас немає доступу до цього проєкту",
    en: "You do not have access to this project",
  },
  "Ошибка проверки прав доступа к проекту": {
    uk: "Помилка перевірки доступу до проєкту",
    en: "Failed to check project access",
  },
  "Название проекта обязательно": {
    uk: "Назва проєкту обов'язкова",
    en: "Project name is required",
  },
  "Код проекта обязателен": {
    uk: "Код проєкту обов'язковий",
    en: "Project code is required",
  },
  "Название стадии обязательно": {
    uk: "Назва стадії обов'язкова",
    en: "Stage name is required",
  },
  "userId должен быть UUID": {
    uk: "userId має бути UUID",
    en: "userId must be a UUID",
  },
  "Некорректный формат email": {
    uk: "Некоректний формат email",
    en: "Invalid email format",
  },
  "Некорректный email": {
    uk: "Некоректний email",
    en: "Invalid email",
  },
  "Текущий пароль обязателен": {
    uk: "Поточний пароль обов'язковий",
    en: "Current password is required",
  },
  "Пароль должен содержать минимум 8 символов": {
    uk: "Пароль має містити щонайменше 8 символів",
    en: "Password must be at least 8 characters",
  },
  "Пароль должен содержать заглавную букву": {
    uk: "Пароль має містити велику літеру",
    en: "Password must contain an uppercase letter",
  },
  "Пароль должен содержать знак": {
    uk: "Пароль має містити знак",
    en: "Password must contain a symbol",
  },
  "Email должен быть строкой": {
    uk: "Email має бути рядком",
    en: "Email must be a string",
  },
  "Email обязателен": {
    uk: "Email обов'язковий",
    en: "Email is required",
  },
  "Пароль должен быть строкой": {
    uk: "Пароль має бути рядком",
    en: "Password must be a string",
  },
  "Пароль обязателен": {
    uk: "Пароль обов'язковий",
    en: "Password is required",
  },
  "token обязателен": {
    uk: "Токен обов'язковий",
    en: "Token is required",
  },
  "Имя обязательно": {
    uk: "Ім'я обов'язкове",
    en: "First name is required",
  },
  "Имя слишком длинное": {
    uk: "Ім'я занадто довге",
    en: "First name is too long",
  },
  "Фамилия обязательна": {
    uk: "Прізвище обов'язкове",
    en: "Last name is required",
  },
  "Фамилия слишком длинная": {
    uk: "Прізвище занадто довге",
    en: "Last name is too long",
  },
  "Отображаемое имя не может быть пустым": {
    uk: "Відображуване ім'я не може бути порожнім",
    en: "Display name cannot be empty",
  },
  "Отображаемое имя слишком длинное": {
    uk: "Відображуване ім'я занадто довге",
    en: "Display name is too long",
  },
  "projectId должен быть UUID": {
    uk: "projectId має бути UUID",
    en: "projectId must be a UUID",
  },
  "date обязателен": {
    uk: "Дата обов'язкова",
    en: "Date is required",
  },
  "hours должно быть > 0": {
    uk: "Години мають бути більші за 0",
    en: "Hours must be greater than 0",
  },
  "hours не больше 24": {
    uk: "Годин не більше ніж 24",
    en: "Hours cannot exceed 24",
  },
  "Название клиента обязательно": {
    uk: "Назва клієнта обов'язкова",
    en: "Client name is required",
  },
};

export function requestLocale(req: Request): Locale {
  const raw = String(req.headers["accept-language"] || "").toLowerCase();
  return raw.startsWith("uk") ? "uk" : "en";
}

export function tr(req: Request, message: string): string {
  return catalog[message]?.[requestLocale(req)] ?? message;
}

export function localize<T>(req: Request, body: T): T {
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof (body as { message?: unknown }).message === "string"
  ) {
    return {
      ...body,
      message: tr(req, (body as { message: string }).message),
    };
  }
  return body;
}
