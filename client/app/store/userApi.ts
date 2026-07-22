import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE';
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    // Если нужно передавать токен из localStorage:
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // Получение всех пользователей
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),

    // Изменение роли пользователя
    updateUserRole: builder.mutation<User, { id: number; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      // Автоматически перезапросит список пользователей после успешного изменения
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserRoleMutation } = userApi;