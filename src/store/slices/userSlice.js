import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    preferences: {
      theme: 'light',
      notifications: true,
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateUserPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, updateUserPreferences, logout } = userSlice.actions;

export default userSlice.reducer; 