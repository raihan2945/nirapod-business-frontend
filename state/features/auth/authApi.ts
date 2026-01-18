// authApi.ts
import apiSlice from "../api/api";
import { userLoggedIn, User } from "./authSlice";
import { LoginResponse } from "./types";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (data: any) => ({
        url: `/api/v1/auth/user/login`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(
        arg: any,
        {
          queryFulfilled,
          dispatch,
        }: {
          queryFulfilled: Promise<{ data: LoginResponse }>;
          dispatch: (action: any) => void;
        },
      ) {
        try {
          const result = await queryFulfilled;

          const { data } = result?.data;

          dispatch(
            userLoggedIn({
              access_token: data?.access_token,
              id: data.id,
            }),
          );
        } catch (err) {
          // Handle error
        }
      },
      invalidatesTags: ["Users"],
    }),
    userSignUp: builder.mutation({
      query: (data: any) => ({
        url: `/api/v1/auth/user/signup`,
        method: "POST",
        body: data,
      }),

      async onQueryStarted(
        arg: any,
        {
          queryFulfilled,
          dispatch,
        }: {
          queryFulfilled: Promise<{ data: LoginResponse }>;
          dispatch: (action: any) => void;
        },
      ) {
        try {
          const result = await queryFulfilled;

          const { data } = result?.data;

          dispatch(
            userLoggedIn({
              access_token: data?.access_token,
              id: data.id,
            }),
          );
        } catch (err) {
          // Handle error
        }
      },
      invalidatesTags: ["Users"],
    }),

    sendOtp: builder.mutation<any, { data: any }>({
      query: ({ data }: { data: any }) => ({
        url: `/api/v1/auth/send-otp`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${data?.token || ""}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    verifyOtp: builder.mutation<any, { data: any }>({
      query: ({ data }: { data: any }) => ({
        url: `/api/v1/auth/verify-otp`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${data?.token || ""}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    updateForgotPassword: builder.mutation<any, { data: any }>({
      query: ({ data }: { data: any }) => ({
        url: `/api/v1/auth/update-forgot-password`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${data?.token || ""}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    updatePassword: builder.mutation<any, { data: any }>({
      query: ({ data }: { data: any }) => ({
        url: `/api/v1/auth/update-password`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${data?.token || ""}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useUserLoginMutation,
  useUserSignUpMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUpdateForgotPasswordMutation,
  useUpdatePasswordMutation,
} = authApi;

export default authApi;
