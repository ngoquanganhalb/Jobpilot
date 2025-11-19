// /redux/slices/authSlice.ts
import { User } from "@/dtos/user/user.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: User | null;
  permissions: any[];
  error: string | null;
  isLoading: boolean;
}
type UserProfilePayload = {
  user: User;
  permissions: any[];
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  permissions: [],
  error: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfilePayload>) {
      state.user = action.payload.user;
      state.permissions = action.payload.permissions ?? [];
      state.error = null;
      state.isLoading = false;
    },
    clearAuth() {
      return initialState;
    },
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
