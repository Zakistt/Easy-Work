import { createSlice } from "@reduxjs/toolkit";

export const employerSlice = createSlice({
  name: "employer",
  initialState: {
    _id: "",
    email: "",
    name: "",
    background: "",
  },
  reducers: {
    updateBackground: (state, action) => {
      const value = action.payload.value;
      state.background = value;
    },
    updateName: (state, action) => {
      const name = action.payload.value;
      state.name = name;
    },
    updateAgency: (state, action) => {
      const value = action.payload.value;
      state._id = value._id;
      state.email = value.email;
      state.name = value.name;
      state.background = value.background;
    },
  },
});

export const { updateName, updateBackground, updateAgency } =
  employerSlice.actions;

export default employerSlice.reducer;
