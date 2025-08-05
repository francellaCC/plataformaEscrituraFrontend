import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";
import { type StoryRequest, type StoryResponse } from "../types/types";


export const storyApi = createApi({
  reducerPath: 'storyApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createStory: builder.mutation<StoryResponse, StoryRequest>({
      query: (body) => ({
        url: '/stories/createStory',
        method: 'POST',
        body: {
          ...body,
          coverImageUrl: 'fgdgdfg',
          visibility: 'private',
          status: 'in_progress',

        }
      })
    }),
    getUserStories: builder.query<StoryResponse[], void>({
      query: () => ({
        url: '/stories/myStories',
        method: 'GET'
      })
    }),
    getStoryById: builder.query<StoryResponse, number>({
      query: (idStory) => ({
        url: `/stories/myStory/${idStory}`,
        method: 'GET'
      })
    }),
    updateStory: builder.mutation<StoryResponse, { id: number; data: StoryRequest }>({
      query: ({ id, data }) => ({
        url: `/stories/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteStory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/stories/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  })
})

export const { useCreateStoryMutation, useGetUserStoriesQuery, useGetStoryByIdQuery, useUpdateStoryMutation,
  useDeleteStoryMutation } = storyApi;