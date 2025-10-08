import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";
import type { ChapterResponse, ChapterRequest, ChapterWithPages } from "../types/types";


export const chapterApi = createApi({
  reducerPath: 'chapterApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createChapter: builder.mutation<ChapterResponse, { storyId: number; data: ChapterRequest }>({
      query: ({ storyId, data }) => ({
        url: `/chapter/create/${storyId}`,
        method: "POST",
        body: data
      })
    }),
    updateChapter: builder.mutation<ChapterResponse, { storyId: number; chapterId: number; data: ChapterRequest }>({
      query: ({ storyId, chapterId, data }) => ({
        url: `/chapter/update/${storyId}/${chapterId}`,
        method: 'PUT',
        body: data
      })
    }),
    getAllChapters: builder.query<ChapterResponse[], number>({
      query: (storyId) => ({
        url: `/chapter/getChapters/${storyId}`,
        method: 'GET'
      })
    }),
    getChapterById: builder.query<ChapterResponse, { storyId: number; chapterId: number }>({
      query: ({ storyId, chapterId }) => ({
        url: `/chapter/getChapter/${storyId}/${chapterId}`,
        method: 'GET'
      })
    }),
    getNextChapter: builder.query<ChapterResponse, { storyId: number, currentChapter: number }>({
      query: ({ storyId, currentChapter }) => ({
        url: `/chapter/next/${storyId}/${currentChapter}`,
        method: 'GET'
      })
    }),
    getPreviousChapter: builder.query<ChapterResponse, { storyId: number, currentChapter: number }>({
      query: ({ storyId, currentChapter }) => ({
        url: `/chapter/previous/${storyId}/${currentChapter}`,
        method: 'GET'
      })
    }),
  })
})

export const { useCreateChapterMutation, useUpdateChapterMutation, useGetAllChaptersQuery, useGetChapterByIdQuery,
  useGetNextChapterQuery, useLazyGetNextChapterQuery,
  useLazyGetPreviousChapterQuery } = chapterApi;