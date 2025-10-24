import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "./types"; // Adjust the import path as necessary

const initialState: UserState = {
  data: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {

      state.data = action.payload;
    },
    // Add other reducers if needed
    // userLoggedOut: () => initialState,
    // updateUserState: (state, action: PayloadAction<User>) => {
    //   state.data = action.payload;
    // },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
