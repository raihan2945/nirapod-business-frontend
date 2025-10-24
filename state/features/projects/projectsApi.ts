// src/api/userApi.ts

import apiSlice from "../api/api";
import { store } from "../../store";
import { generateUrlQueryString } from "@/utils/query";
// import {} from "./types";

const token = store.getState().auth?.access_token;

const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: (queries: any) => {
        let url = `/api/v1/projects`;

        url = generateUrlQueryString(queries, url);

        return {
          url: url,
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["Projects"],
    }),

    getProjectsCounts: builder.query({
      query: () => ({
        url: `/api/v1/projects/counts`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Projects"],
    }),

    getSingleProjectById: builder.query<any, any>({
      query: (id) => ({
        url: `/api/v1/projects/${id}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Projects"],
    }),

    createNewProject: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: `/api/v1/projects`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Projects"],
    }),

    updateProjectById: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/projects/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Projects"],
    }),

    deleteProjectById: builder.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/api/v1/projects/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Projects"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllProjectsQuery,
  useGetSingleProjectByIdQuery,
  useGetProjectsCountsQuery,
  useCreateNewProjectMutation,
  useUpdateProjectByIdMutation,
  useDeleteProjectByIdMutation,
} = projectsApi;
export default projectsApi;
