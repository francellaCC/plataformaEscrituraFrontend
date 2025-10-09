import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";
import { type ChapterWithPages, type StoryRequest, type StoryResponse, type StoryWithUserInfo } from "../types/types";


export const storyApi = createApi({
  reducerPath: 'storyApi',
  baseQuery: baseQuery,
  tagTypes: ['Story'],
  endpoints: (builder) => ({
    createStory: builder.mutation<StoryResponse, StoryRequest>({
      query: (body) => ({
        url: '/stories/createStory',
        method: 'POST',
        body,
      }),
      // Al crear una historia, invalida la lista general
      invalidatesTags: [{ type: 'Story', id: 'LIST' }],
    }),
    getUserStories: builder.query<StoryResponse[], void>({
      query: () => ({
        url: '/stories/myStories',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Story' as const, id })),
              { type: 'Story', id: 'LIST' },
            ]
          : [{ type: 'Story', id: 'LIST' }],
    }),
    getStoryById: builder.query<StoryResponse, number>({
      query: (idStory) => ({
        url: `/stories/myStory/${idStory}`,
        method: 'GET',
      }),
      providesTags: (result, error, idStory) => [{ type: 'Story', id: idStory }],
    }),
    getStoryWithAuthor: builder.query<StoryWithUserInfo, number>({
      query: (idStory) => ({
        url: `/stories/storyAuthor/${idStory}`,
        method: 'GET',
      }),
      providesTags: (result, error, idStory) => [{ type: 'Story', id: idStory }],
    }),
    updateStory: builder.mutation<StoryResponse, { id: number; data: StoryRequest }>({
      query: ({ id, data }) => ({
        url: `/stories/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Story', id }],
    }),
    deleteStory: builder.mutation<string, number>({
      query: (id) => ({
        url: `/stories/delete/${id}`,
        method: 'DELETE',
      }),
      // Invalida tanto la historia eliminada como la lista general
      invalidatesTags: (result, error, id) => [
        { type: 'Story', id },
        { type: 'Story', id: 'LIST' },
      ],
    }),
    getFirstChapter: builder.query<ChapterWithPages, number>({
      query: (storyId) => ({
        url: `/chapter/${storyId}/first-chapter`,
        method: 'GET',
      }),
      providesTags: (result, error, storyId) => [{ type: 'Story', id: storyId }],
    }),
  }),
});


export const { useCreateStoryMutation, useGetUserStoriesQuery, useGetStoryByIdQuery, useUpdateStoryMutation,
  useDeleteStoryMutation, useGetFirstChapterQuery, useGetStoryWithAuthorQuery} = storyApi;