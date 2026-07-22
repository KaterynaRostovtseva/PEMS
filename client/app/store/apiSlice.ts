import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pems-i9a1.onrender.com', 
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Project', 'User', 'TimeEntry'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
   register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register', 
        method: 'POST',
        body: userData,
      }),
    }),
    getProjects: builder.query({
      query: () => '/projects',
      providesTags: ['Project'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetProjectsQuery } = apiSlice;