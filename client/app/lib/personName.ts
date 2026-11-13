/** Як показати ім'я: displayName, інакше «ім'я прізвище». */
type NamedPerson = {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
};

export function personName(person?: NamedPerson | null, fallback = ""): string {
  if (!person) return fallback;
  const display = person.displayName?.trim();
  if (display) return display;
  const name = [person.firstName, person.lastName].filter(Boolean).join(" ").trim();
  if (name) return name;
  return person.fullName?.trim() || fallback;
}

export function personInitial(person?: NamedPerson | null): string {
  return personName(person).slice(0, 1).toUpperCase();
}
