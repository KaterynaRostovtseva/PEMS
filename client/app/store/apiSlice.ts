/** Запити: вхід, реєстрація, вихід, профіль, проєкти, години. */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type { AuthUser } from "~/lib/authStorage";

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  companyName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Project", "User", "TimeEntry", "Profile"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    getProfile: builder.query<
      {
        id: string;
        firstName: string;
        lastName: string;
        displayName?: string | null;
        email: string;
        role: string;
        avatar?: string | null;
        organization?: { id: string; name: string };
      },
      void
    >({
      query: () => "/users/me",
      providesTags: ["Profile"],
    }),
    getProjects: builder.query<
      | { id: string; name: string; status: string }[]
      | { data: { id: string; name: string; status: string }[] },
      void
    >({
      query: () => "/projects?limit=50",
      providesTags: ["Project"],
    }),
    getTimeEntries: builder.query<
      | {
          id: string;
          hours?: number;
          status?: string;
          date?: string;
          project?: { id: string; name: string };
        }[]
      | {
          data: {
            id: string;
            hours?: number;
            status?: string;
            date?: string;
            project?: { id: string; name: string };
          }[];
        },
      void
    >({
      query: () => "/time-entries?limit=20",
      providesTags: ["TimeEntry"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useGetProjectsQuery,
  useGetTimeEntriesQuery,
} = apiSlice;
