// src/api/userApi.ts

import apiSlice from "../api/api";
import { store } from "../../store";
import { generateUrlQueryString } from "@/utils/query";
// import {} from "./types";

const token = store.getState().auth?.access_token;

const projectInvestmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjectInvestments: builder.query({
      query: (queries: any) => {
        let url = `/api/v1/projects/investments`;

        url = generateUrlQueryString(queries, url);

        return {
          url: url,
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["ProjectInvestments"],
    }),

    getProjectInvestmentCounts: builder.query({
      query: () => ({
        url: `/api/v1/projects/counts`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["ProjectInvestments"],
    }),

    getSingleProjectInvestmentById: builder.query<any, any>({
      query: (id) => ({
        url: `/api/v1/projects/investments/${id}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["ProjectInvestments"],
    }),

    createNewProjectInvestment: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: `/api/v1/projects/investments`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["ProjectInvestments"],
    }),

    updateProjectInvestmentById: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/projects/investments/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["ProjectInvestments"],
    }),

    deleteProjectInvestmentById: builder.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/api/v1/projects/investments/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["ProjectInvestments"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllProjectInvestmentsQuery,
  useGetSingleProjectInvestmentByIdQuery,
  useGetProjectInvestmentCountsQuery,
  useCreateNewProjectInvestmentMutation,
  useUpdateProjectInvestmentByIdMutation,
  useDeleteProjectInvestmentByIdMutation,
} = projectInvestmentApi;
export default projectInvestmentApi;
