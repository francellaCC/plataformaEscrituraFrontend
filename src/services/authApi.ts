import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootSatate } from "../store/store";
import { type UserRequest, type UserResponse } from "../types/types";



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
  tagTypes:["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userData) => ({
        url: '/user/register',
        method: 'POST',
        body: userData

      }),
    }),
    getProfile: builder.query<UserResponse, void>({
      query: () => "/user/me",
      providesTags: ["User"], 
    }),
    updatePerfile: builder.mutation<UserResponse, UserRequest>({
      query:(data) =>({
        url:"/user/me/updateprofile",
        method: "PUT",
        body: data
      }),
      invalidatesTags:["User"]
    })
  }),
});

export const { useLoginMutation, useUpdatePerfileMutation , useGetProfileQuery} = authApi;