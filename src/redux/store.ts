import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import exampleReducer from "./slices/exampleSlice";
import userReducer from "./slices/userSlice";
export const store = configureStore({
  reducer: {
    example: exampleReducer,
    user: userReducer,
  },
});

// Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
