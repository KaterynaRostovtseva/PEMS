import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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