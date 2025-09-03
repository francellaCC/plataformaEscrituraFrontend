import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";
import type { ChapterWithPages, PageRequest, PageResponse, PaginatedPages } from "../types/types";



export const pageApi = createApi({
  reducerPath: 'pageApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createPage: builder.mutation<PageResponse, { storyId: number; chapterId: number; data: PageRequest }>({
      query: ({ storyId, chapterId, data }) => ({
        url: `/pages/createPage/${storyId}/${chapterId}`,
        method: "POST",
        body: data
      })
    }),
    getPagesByChapterId: builder.query<PaginatedPages, { storyId: number; chapterId: number; limit: number; offset: number }>({
      query: ({ storyId, chapterId, limit, offset }) => ({
        url: `/pages/getPages/${storyId}/${chapterId}/pagesLoad?limit=${limit}&offset=${offset}`,
        method: 'GET'
      })
    }),
    updatePage: builder.mutation<PageResponse, {storyId: number; chapterId: number; pageId: number; data: PageRequest }>({
      query:({ storyId, chapterId, pageId, data })=>({
        url:`/pages/update/${storyId}/${chapterId}/${pageId}`,
        method: "PUT",
        body: data
      })
    }),
    uploadImagePage: builder.mutation<{url:string}, File>({
      query: (file)=>{
        const formData = new FormData()
        formData.append("file", file)
        return{
          url:"/upload/image",
          method: "POST",
          body: formData
        }
      }
    })
  })
})

export const { useCreatePageMutation, useGetPagesByChapterIdQuery , useUpdatePageMutation, useUploadImagePageMutation} = pageApi;