import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserResponse } from '../../types/types';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
}

const savedAuth = localStorage.getItem("auth");
const initialState: AuthState = savedAuth
  ? JSON.parse(savedAuth)
  : {
    user: null,
    token: null,
    isAuthenticated: false,
  };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{ user: UserResponse; token: string }>
    ) => {
      console.log(action.payload.user)
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("auth", JSON.stringify({
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true
      }));

    },
    updateUser: (state, action: PayloadAction<UserResponse>) => {

      state.user = action.payload
      localStorage.setItem(
        "auth", JSON.stringify({
          ...state,
          user: action.payload
        }))
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth")
    },
  },
});

export const { setAuthState, updateUser , logout } = authSlice.actions;
export default authSlice.reducer;
