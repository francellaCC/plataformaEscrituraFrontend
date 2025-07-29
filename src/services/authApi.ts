import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootSatate } from "../store/store";



export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootSatate).auth.token
    console.log(" token", token)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
});

export const authApi = createApi({
   reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userData) => ({
        url: '/user/register',
        method: 'POST',
        body: userData
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;