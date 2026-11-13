/** Запити людей компанії: список і зміна ролі. */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export type UserRole = "OWNER" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string | null;
  email: string;
  role: UserRole;
  position?: string | null;
  isActive?: boolean;
}

type PaginatedUsers = {
  data: User[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users?limit=100",
      transformResponse: (response: User[] | PaginatedUsers) =>
        Array.isArray(response) ? response : response.data,
      providesTags: ["Users"],
    }),

    updateUserRole: builder.mutation<
      { message: string; user: User },
      { id: string; role: UserRole }
    >({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserRoleMutation } = userApi;
