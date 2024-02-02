import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/data/userSlice";
import employerReducer from "../features/data/employerSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    employer: employerReducer,
  },
});
