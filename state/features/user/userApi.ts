// src/api/userApi.ts

import apiSlice from "../api/api";
import { setUser } from "./userSlice";
import { store } from "../../store";
import { User, UserResponse, UpdateUserData } from "./types";
import { generateUrlQueryString } from "@/utils/query";
import { userLoggedOut } from "../auth/authSlice";

const token = store.getState().auth?.access_token;

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UserResponse, any>({

      query: (queries: any) => {

        let url = `/api/v1/users`;

        url = generateUrlQueryString(queries, url);

        return ({
          url: url,
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
      },
      providesTags: ["Users"],
    }),

    getUserById: builder.query<UserResponse, any>({
      query: (id) => ({
        url: `/api/v1/users/token`,
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result:any = await queryFulfilled;

          dispatch(setUser(result.data.data));
        } catch (err) {
          console.log("Error fetching user data:", err);
          dispatch(userLoggedOut());
        }
      },
      providesTags: ["Users"],
      
    }),

    getUserCountsById: builder.query<any, any>({
      query: (id) => ({
        url: `/api/v1/users/counts/${id}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Users", "ProjectInvestments"],
    }),

    createNewUser: builder.mutation<any, any>({
      query: ({ data }) => ({
        url: `/api/v1/users`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/api/v1/users/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUserById: builder.mutation<any, any>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetAllUsersQuery,
  useCreateNewUserMutation,
  useDeleteUserByIdMutation,
  useGetUserCountsByIdQuery
} = userApi;
export default userApi;
