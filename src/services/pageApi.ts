import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";
import type { PageRequest, PageResponse } from "../types/types";



export const pageApi = createApi({
  reducerPath: 'pageApi',
  baseQuery: baseQuery,
  endpoints: (builder)=>({
      createPage : builder.mutation<PageResponse, {storyId: number; chapterId : number;  data:PageRequest}>({
        query: ({storyId,chapterId, data }) =>({
          url: `/pages/createPage/${storyId}/${chapterId}`,
          method: "POST",
        body: data
        })
      })
  })
})

export const {useCreatePageMutation} = pageApi;