import { persistor } from "@/state/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  // Add any other user properties here
}

interface AuthState {
  access_token?: string;
  id?: string;
}

const initialState: AuthState = {
  access_token: undefined,
  id: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (
      state,
      action: PayloadAction<{ access_token: string; id: string }>
    ) => {
      state.access_token = action.payload.access_token;
      state.id = action.payload.id;
    },
    userLoggedOut: () => {
      return initialState;
    },
    // updateUserState: (state, action: PayloadAction<User>) => {
    //   state.user = action.payload;
    // },
  },
});

export const selectToken = (state: { auth: AuthState }) =>
  state.auth.access_token;

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
