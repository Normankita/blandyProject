import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userState: JSON.parse(localStorage.getItem("userData")) || null,
    token: localStorage.getItem("token") || null,
    isLoggedIn: localStorage.getItem("userData") ? true : false,
  },
  reducers: {
    setUser: (state, action) => {
      state.userState = action.payload.userState;
      state.token = action.payload.token;
      state.isLoggedIn = action.payload.isLoggedIn;
      // Persist user data and token in localStorage
      localStorage.setItem("userData", JSON.stringify(action.payload.userState));
      localStorage.setItem("token", action.payload.token);
    },
    removeUser: (state) => {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      state.userState = null;
      state.token = null;
      state.isLoggedIn = false;
    }
  },
});

export const { setUser, removeUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
