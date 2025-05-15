import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountType } from "@types";
interface UserState {
  id: string | null;
  name: string | null;
  isAdmin: boolean;
  accountType: AccountType;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  id: null,
  name: null,
  isAdmin: false,
  accountType: "candidate",
  isLoggedIn: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload, isLoggedIn: true };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
