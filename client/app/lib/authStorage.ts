/** Токен і користувач у localStorage. Ключі: token і user. */
export type AuthUser = {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string | null;
  role: "OWNER" | "MANAGER" | "EMPLOYEE";
  avatarUrl?: string | null;
  avatar?: string | null;
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

const canUseDom = () => typeof window !== "undefined";

export const authStorage = {
  getToken(): string | null {
    if (!canUseDom()) return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    if (!canUseDom()) return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  setSession(accessToken: string, user: AuthUser) {
    if (!canUseDom()) return;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // legacy keys used elsewhere
    localStorage.setItem("role", user.role);
  },

  setToken(accessToken: string) {
    if (!canUseDom()) return;
    localStorage.setItem(TOKEN_KEY, accessToken);
  },

  clear() {
    if (!canUseDom()) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
  },
};
