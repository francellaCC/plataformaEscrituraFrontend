import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";


export const s3Api = createApi({
  reducerPath: 's3Api',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    uploadImagePresigned: builder.query<{ uploadUrl: string; publicUrl: string }, { filename: string; contentType: string }>({
      query: ({ filename, contentType }) =>
        `/upload/presigned?filename=${filename}&contentType=${contentType}`,
    }),
    getImagePresigned: builder.query<{ key: string; url: string }[], string[]>({
      query: (keys) => ({
        url: "/upload/presigned/read/batch",
        method: "POST",
        body: keys
      }),
    })
  })
})

export const { useUploadImagePresignedQuery, useGetImagePresignedQuery } = s3Api