import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";
import { type StoryRequest, type  StoryResponse } from "../types/types";


export const storyApi = createApi({
  reducerPath: 'storyApi',
  baseQuery: baseQuery,
  endpoints: (builder)=>({
    createStory: builder.mutation<StoryResponse, StoryRequest>({
      query: (body) => ({
        url: '/stories',
        method: 'POST',
        body
      })
    })
  })
})

export const { useCreateStoryMutation } = storyApi;