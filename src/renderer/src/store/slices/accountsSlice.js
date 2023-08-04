import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accountType: JSON.parse(localStorage.getItem('accountType')) || 'tutor',
    email: '',
    token: null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  reducers: {
    changeAccountType(state, action) {
      state.accountType = action.payload;
      localStorage.setItem('accountType', JSON.stringify(action.payload));
    },
    changeEmail(state, action) {
      state.email = action.payload;
    },
    logout(state, action) {
      state.token = action.payload;
    },
    login(state, action) {
      state.token = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    }
  },
});

export const { changeAccountType, changeEmail, logout, login } =
  accountSlice.actions;
export const accountReducer = accountSlice.reducer;
