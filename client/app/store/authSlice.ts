/** Хто зараз увійшов і його токен. Пише те саме в localStorage. */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authStorage, type AuthUser } from "~/lib/authStorage";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state) {
      state.token = authStorage.getToken();
      state.user = authStorage.getUser();
      state.hydrated = true;
    },
    setCredentials(
      state,
      action: PayloadAction<{ accessToken: string; user: AuthUser }>
    ) {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.hydrated = true;
      authStorage.setSession(action.payload.accessToken, action.payload.user);
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      authStorage.setToken(action.payload);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.hydrated = true;
      authStorage.clear();
    },
  },
});

export const { hydrateAuth, setCredentials, setAccessToken, logout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  Boolean(state.auth.token);
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role ?? null;
