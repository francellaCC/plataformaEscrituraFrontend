import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any;
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
      action: PayloadAction<{ user: any; token: string }>
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
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
