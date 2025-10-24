// !!!!!!! Note: this is investor request api file

import apiSlice from "../api/api";
import { store } from "../../store";
import { generateUrlQueryString } from "@/utils/query";

const token = store.getState().auth?.access_token;

const investorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvestors: builder.query({
      query: (queries: any) => {
        let url = `/api/v1/investors`;

        url = generateUrlQueryString(queries, url);

        return {
          url: url,
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["Investors"],
    }),

    getInvestorsCounts: builder.query({
      query: () => ({
        url: `/api/v1/investors/counts`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Investors"],
    }),

    getSingleInvestorById: builder.query<any, any>({
      query: (id) => ({
        url: `/api/v1/investors/${id}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Investors"],
    }),

    createNewInvestor: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: `/api/v1/investors`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Investors"],
    }),

    updateInvestorById: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/investors/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Investors"],
    }),

    deleteInvestorById: builder.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/api/v1/investors/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Investors"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllInvestorsQuery,
  useGetInvestorsCountsQuery,
  useGetSingleInvestorByIdQuery,
  useCreateNewInvestorMutation,
  useUpdateInvestorByIdMutation,
  useDeleteInvestorByIdMutation,
} = investorApi;
export default investorApi;
