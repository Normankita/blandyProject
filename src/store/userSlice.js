import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userState: null,
    token: null,
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.userState = action.payload.userState;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    removeUser: (state) => {
      state.userState = null;
      state.token = null;
      state.isLoggedIn = false;
    }
  },
});

export const { setUser, removeUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
