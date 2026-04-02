import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { userLoggedOut } from "../auth/authSlice";
import { baseUrl } from "../../../utils/baseUrl";
import { RootState } from "../../store"; // Adjust the import path to where your RootState is defined
import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as RootState; // Type the getState function
    const token = state?.auth?.access_token; // Ensure this matches the correct key in your state
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // headers.set("Access-Control-Allow-Origin", "*");
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Handle 401 errors, e.g., log out the user
    // api.dispatch(userLoggedOut());
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Blogs",
    "Users",
    "Projects",
    "ProjectInvestments",
    "Investors"
  ],
  endpoints: (builder) => ({}), // Define your endpoints here
});

export default apiSlice;
