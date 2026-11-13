/** Збирає стан застосунку: хто увійшов і кеші запитів. */
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { userApi } from "./userApi";
import { authReducer } from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
