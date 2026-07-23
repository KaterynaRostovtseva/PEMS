import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE';
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth, 
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),

    updateUserRole: builder.mutation<User, { id: number; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserRoleMutation } = userApi;