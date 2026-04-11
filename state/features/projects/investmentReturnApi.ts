// src/api/userApi.ts

import apiSlice from "../api/api";
import { store } from "../../store";
import { generateUrlQueryString } from "@/utils/query";
// import {} from "./types";

const token = store.getState().auth?.access_token;

const projectInvestmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjectInvestmentReturns: builder.query({
      query: (queries: any) => {
        let url = `/api/v1/projects/investments/returns`;

        
        url = generateUrlQueryString(queries, url);
        
        console.log("url si : ", queries)
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

    getProjectInvestmentReturnCounts: builder.query({
      query: () => ({
        url: `/api/v1/projects/returns/counts`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["ProjectInvestments"],
    }),

    getSingleProjectInvestmentReturnById: builder.query<any, any>({
      query: (id) => ({
        url: `/api/v1/projects/investments/returns/${id}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["ProjectInvestments"],
    }),

    createNewProjectInvestmentReturn: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: `/api/v1/projects/investments/returns`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["ProjectInvestments"],
    }),

    updateProjectInvestmentReturnById: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/projects/investments/returns/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["ProjectInvestments"],
    }),

    deleteProjectInvestmentReturnById: builder.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/api/v1/projects/investments/returns/${id}`,
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
useGetAllProjectInvestmentReturnsQuery,
useGetSingleProjectInvestmentReturnByIdQuery,
useCreateNewProjectInvestmentReturnMutation,
useUpdateProjectInvestmentReturnByIdMutation,
useDeleteProjectInvestmentReturnByIdMutation
} = projectInvestmentApi;
export default projectInvestmentApi;
