/** Спільний fetch: токен, мова, і одне оновлення сесії після 401. */
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { authStorage } from "~/lib/authStorage";
import { logout, setAccessToken } from "./authSlice";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://pems-i9a1.onrender.com/api"
    : "http://localhost:3000/api");
console.log("API_URL =", API_URL);
export const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = authStorage.getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    const lang = typeof window !== "undefined" ? localStorage.getItem("pems.lang") : null;
    headers.set("accept-language", lang === "en" ? "en" : "uk");
    return headers;
  },
});

const refreshBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const lang = typeof window !== "undefined" ? localStorage.getItem("pems.lang") : null;
    headers.set("accept-language", lang === "en" ? "en" : "uk");
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

const tryRefresh = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2]
): Promise<boolean> => {
  const refreshResult = await refreshBaseQuery(
    { url: "/auth/refresh", method: "POST" },
    api,
    extraOptions
  );

  if (refreshResult.data && typeof refreshResult.data === "object") {
    const data = refreshResult.data as { accessToken?: string };
    if (data.accessToken) {
      api.dispatch(setAccessToken(data.accessToken));
      return true;
    }
  }

  api.dispatch(logout());
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
  return false;
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // 401 — немає або прострочено access; 403 теж буває, коли JWT не пройшов перевірку
  const status = result.error?.status;
  const url = typeof args === "string" ? args : args.url;
  const isAuthEndpoint =
    typeof url === "string" &&
    (url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/reset-password") ||
      url.includes("/auth/accept-invite"));

  if (!isAuthEndpoint && result.error && status === 401 && authStorage.getToken()) {
    if (!refreshPromise) {
      refreshPromise = tryRefresh(api, extraOptions).finally(() => {
        refreshPromise = null;
      });
    }

    const ok = await refreshPromise;
    if (ok) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
