import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";
import type { ChapterResponse, ChapterRequest } from "../types/types";


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
    updateChapter: builder.mutation<ChapterResponse, { storyId: number; chapterId : number;  data: ChapterRequest }>({
      query: ({ storyId,chapterId, data }) => ({
        url: `/chapter/update/${storyId}/${chapterId}`,
        method: 'PUT',
        body: data
      })
    })
  })
})

export const { useCreateChapterMutation, useUpdateChapterMutation } = chapterApi;