import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'

export const blogApi = createApi({
  reducerPath: 'blogApi', // Tên field trong Redux state
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
  endpoints: (build) => ({
    // Generic type theo thu tu la kieu response tra ve va argument
    getPosts: build.query<Post[], void>({
      query: () => 'posts' // method khong co argument
    })
  })
})
export const { useGetPostsQuery } = blogApi
