import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidenavOpen: localStorage.getItem("sideNav") || true,
};

const sidenavSlice = createSlice({
  name: 'sidenav',
  initialState,
  reducers: {
    toggleSidenav: (state) => {
      state.isSidenavOpen = !state.isSidenavOpen;
      localStorage.setItem("sideNav", state.isSidenavOpen);
      console.log("I am executed sidenav")
    },
  },
});

export const { toggleSidenav } = sidenavSlice.actions;
export const sidenavReducer= sidenavSlice.reducer;