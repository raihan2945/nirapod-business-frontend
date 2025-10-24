// authApi.ts
import apiSlice from "../api/api";
import { userLoggedIn, User } from "./authSlice";
import { LoginResponse } from "./types";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
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
        }
      ) {
        try {
          const result = await queryFulfilled;

          const { data } = result?.data;

          dispatch(
            userLoggedIn({
              access_token: data?.access_token,
              id: data.id,
            })
          );
        } catch (err) {
          // Handle error
        }
      },
    }),
    // ... other endpoints
  }),
  overrideExisting: true,
});

export const { useUserLoginMutation } = authApi;

export default authApi;
