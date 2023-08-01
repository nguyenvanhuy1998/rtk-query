import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'

export const blogApi = createApi({
  reducerPath: 'blogApi', // Tên field trong Redux state
  tagTypes: ['Posts'], // Những kiểu tag cho phép dùng trong blogApi
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
  endpoints: (build) => ({
    // Generic type theo thu tu la kieu response tra ve va argument
    getPosts: build.query<Post[], void>({
      query: () => 'posts', // method khong co argument
      // providesTags có thể là array hoặc callback return array
      // Nếu có bất kỳ một invalidatesTag nào match với providesTag này
      // thì sẽ làm cho getPosts method chạy lại
      // và cập nhật lại danh sách các bài post cũng như tags phía dưới
      providesTags(result) {
        // Cái callback này sẽ chạy mỗi khi getPosts chạy
        // Mong muốn là sẽ return về một mảng kiểu
        // interface Tags: {
        //    type: "Posts";
        //    id: string;
        // }[]
        // vì thế phải thêm as const vào để báo hiệu type là Read only, không thể mutate
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        const final = [{ type: 'Posts' as const, id: 'LIST' }]
        return final
      }
    }),
    // Chúng ta dùng mutation đối với các trường hợp POST, PUT, DELETE
    // Post là response trả về và Omit<Post, 'id'> là body gửi lên
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        return {
          url: 'posts',
          method: 'POST',
          body
        }
      },
      // invalidatedTags cung cấp các tag để báo hiệu cho những method nào có providesTags
      // match với nó sẽ bị gọi lại
      // Trong trường hợp này getPosts sẽ chạy lại
      invalidatesTags: (result, error, body) => [{ type: 'Posts', id: 'LIST' }]
    }),
    getPost: build.query<Post, string>({
      query: (id) => `posts/${id}`
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query(data) {
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      // Trong trường hợp này getPosts sẽ chạy lại
      invalidatesTags: (result, error, data) => [{ type: 'Posts', id: data.id }]
    }),
    deletePost: build.mutation<{}, string>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      // Trong trường hợp này getPosts sẽ chạy lại

      invalidatesTags: (result, error, id) => [{ type: 'Posts', id }]
    })
  })
})
export const { useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
