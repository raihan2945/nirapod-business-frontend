// src/api/userApi.ts

import apiSlice from "../api/api";
import { store } from "../../store";
import { generateUrlQueryString } from "@/utils/query";
// import {} from "./types";

const token = store.getState().auth?.access_token;

const walletTransactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllWalletTransactions: builder.query({
      query: (queries: any) => {
        let url = `/api/v1/wallet/transactions`;

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
      providesTags: ["Wallet"],
    }),

    getProjectInvestmentReturnCounts: builder.query({
      query: () => ({
        url: `/api/v1/wallet/transactions`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Wallet"],
    }),

    getSingleWalletTransaction: builder.query<any, any>({
      query: (id) => ({
        url: `/api/v1/wallet/transactions/${id}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Wallet"],
    }),

    createNewWalletTransaction: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: `/api/v1/wallet/transactions`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Wallet"],
    }),

    updateWalletTransaction: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/v1/wallet/transactions/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Wallet"],
    }),

    deleteWalletTransaction: builder.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/api/v1/wallet/transactions/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllWalletTransactionsQuery,
  useGetSingleWalletTransactionQuery,
  useCreateNewWalletTransactionMutation,
  useUpdateWalletTransactionMutation,
  useDeleteWalletTransactionMutation
} = walletTransactionApi;
export default walletTransactionApi;
