import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userSlice";
import { sidenavReducer } from "./sidenavSlice";

const store = configureStore({
    reducer: {
        userState: userReducer,
        sidenavState: sidenavReducer,
    },
})
 
export default store;