// src/api/userApi.ts

import apiSlice from "../api/api";
import { store } from "../../store";
import { generateUrlQueryString } from "@/utils/query";
// import {} from "./types";

const token = store.getState().auth?.access_token;

const blogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: (queries: any) => {
        let url = `/api/v1/blogs`;

        url = generateUrlQueryString(queries, url);

        return {
          url: url,
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["Blogs"],
    }),

    getBlogsCounts: builder.query({
      query: () => ({
        url: `/api/v1/blogs/counts`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Blogs"],
    }),

    getSingleBlogById: builder.query<any, any>({
      query: (id) => ({
        url: `/api/v1/blogs/${id}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Blogs"],
    }),

    createNewBlog: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: `/api/v1/blogs`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Blogs"],
    }),

    updateBlogById: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/blogs/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Blogs"],
    }),

    deleteBlogById: builder.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/api/v1/blogs/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllBlogsQuery,
  useGetSingleBlogByIdQuery,
  useGetBlogsCountsQuery,
  useCreateNewBlogMutation,
  useUpdateBlogByIdMutation,
  useDeleteBlogByIdMutation,
} = blogsApi;
export default blogsApi;
