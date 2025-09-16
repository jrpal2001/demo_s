import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: '',
  phoneNumber: '',
  email: '',
  fullName: '',
  userType: '',
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { _id, phoneNumber, email, fullName, userType, isAuthenticated } = action.payload;

      state._id = _id;
      state.phoneNumber = phoneNumber;
      state.email = email;
      state.fullName = fullName;
      state.userType = userType;
      state.isAuthenticated = isAuthenticated;
    },
    resetAuth: (state, action) => {
      state._id = '';
      state.phoneNumber = '';
      state.email = '';
      state.fullName = '';
      state.userType = '';
      state.isAuthenticated = '';
    },
  },
});

export const { setAuth, resetAuth } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectUserType = (state) => state.auth.userType;

export const selectCurrentUserType = (state) => {
  const role = state.auth.userType?.[0];
  console.log("🚀 ~ selectCurrentUserType ~ role:", role)
  if (role === 'superAdmin' || role === 'SuperAdmin') return 'admin';
  return role ? role.toLowerCase() : undefined;
};



export default authSlice.reducer;
