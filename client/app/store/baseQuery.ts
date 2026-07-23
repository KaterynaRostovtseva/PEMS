import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'https://pems-i9a1.onrender.com',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const refreshBaseQuery = fetchBaseQuery({
  baseUrl: 'https://pems-i9a1.onrender.com',
  credentials: 'include',
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Обязательно нужен await, чтобы получить объект результата, а не Promise
  let result = await rawBaseQuery(args, api, extraOptions);

  // Обрабатываем только 401 (ошибка истекшего токена)
 if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const refreshResult = await refreshBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data = refreshResult.data as { accessToken: string };
      localStorage.setItem('token', data.accessToken);

      // Повторяем запрос
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
  }

  return result;
};