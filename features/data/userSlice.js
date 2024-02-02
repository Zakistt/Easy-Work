import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: "64925c58cf1ddfe6f3bb337d",
    email: "dazdzafzaf@gmail.com",
    name: "Zaki",
    job: "Full stack dev",
    pfp: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et dui purus. Donec augue nibh, tempor in facilisis id, aliquet in enim. Donec sagittis massa nec mi ornare bibendum. Ut odio neque, convallis in lacus ac, malesuada viverra ex.",
    work: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et dui purus. Donec augue nibh, tempor in facilisis id, aliquet in enim. Donec sagittis massa nec mi ornare bibendum. Ut odio neque, convallis in lacus ac, malesuada viverra ex.",
    education:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et dui purus. Donec augue nibh, tempor in facilisis id, aliquet in enim. Donec sagittis massa nec mi ornare bibendum. Ut odio neque, convallis in lacus ac, malesuada viverra ex.",
    skills: [
      { key: 0, title: "ffqqg", value: 80 },
      { key: 1, title: "ffqqg", value: 80 },
      { key: 2, title: "ffqqg", value: 80 },
      { key: 3, title: "ffqqg", value: 80 },
    ],
    contacts: {
      apps: [
        { name: "facebook", value: "www.facebook.com/user/1", key: 0 },
        { name: "instagram", value: "www.instagram.com/user/1", key: 1 },
        { name: "twitter", value: "www.twitter.com/user/1", key: 2 },
        { name: "linkedin", value: "www.linkedin.com/user/1", key: 3 },
      ],
      physical: [
        { name: "phone", value: "+21354891328", key: 0 },
        { name: "mail", value: "www.gmail.com/user/1", key: 1 },
        {
          name: "address",
          value: "30 street Maddison Square Garden, NY",
          key: 2,
        },
      ],
    },
    contactedAgencies: [],
    acceptedBy: [],
  },
  reducers: {
    updateUser: (state, action) => {
      const value = action.payload.value;
      state._id = value._id;
      state.acceptedBy = value.acceptedBy;
      state.bio = value.bio;
      state.contactedAgencies = value.contactedAgencies;
      state.contacts = value.contacts;
      state.education = value.education;
      state.email = value.email;
      state.job = value.job;
      state.name = value.name;
      state.pfp = value.pfp;
      state.skills = value.skills;
      state.work = value.work;
    },
    updatePfp: (state, action) => {
      const value = action.payload.value;
      state.pfp = value;
    },

    updateContactValue: (state, action) => {
      const i = action.payload.index;
      const value = action.payload.value;
      const category = action.payload.category;

      if (category == "apps") {
        (state.contacts = { ...state.contacts }),
          (state.contacts.apps[i] = {
            ...state.contacts.apps[i],
            value: value,
          });
      } else {
        (state.contacts = { ...state.contacts }),
          (state.contacts.physical[i] = {
            ...state.contacts.physical[i],
            value: value,
          });
      }
    },
    updateSkills: (state, action) => {
      const skills = action.payload.data;

      state.skills = skills;
    },
    updateField: (state, action) => {
      const data = action.payload.data;
      const label = action.payload.label;

      switch (label) {
        case "name":
          state.name = data;
          break;
        case "job":
          state.job = data;
          break;
        case "bio":
          state.bio = data;
          break;
        case "work":
          state.work = data;
          break;
        case "education":
          state.education = data;
          break;

        default:
          break;
      }
    },
  },
});

export const {
  updateContactValue,
  updateSkills,
  updateField,
  updatePfp,
  updateUser,
} = userSlice.actions;

export default userSlice.reducer;
