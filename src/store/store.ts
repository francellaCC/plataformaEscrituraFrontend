import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/authSlice'
import { authApi } from "../services/authApi";
import { storyApi } from "../services/storyApi";
import { chapterApi } from "../services/chapterApi";
import { pageApi } from "../services/pageApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [storyApi.reducerPath]: storyApi.reducer,
    [chapterApi.reducerPath] : chapterApi.reducer,
    [pageApi.reducerPath] : pageApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
                                        .concat(authApi.middleware)
                                        .concat(storyApi.middleware)
                                        .concat(chapterApi.middleware)
                                        .concat(pageApi.middleware)
})

export type RootSatate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;