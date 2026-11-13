export const userNameSelect = {
  id: true,
  firstName: true,
  lastName: true,
  displayName: true,
  email: true,
} as const;

export const userBriefSelect = {
  ...userNameSelect,
  role: true,
} as const;
