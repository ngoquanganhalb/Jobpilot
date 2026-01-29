"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import storage from "redux-persist/lib/storage";

import exampleReducer from "./slices/exampleSlice";
import userReducer from "./slices/userSlice";
import searchReducer from "./slices/searchSlice";
import jobReducer from "./slices/jobSlice";
import filterReducer from "./slices/filterSlice";
import authReducer from "./slices/authSlice"; 
import notificationReducer from "./slices/notificationSlice";

const rootReducer = combineReducers({
  example: exampleReducer,
  user: userReducer,
  search: searchReducer,
  jobs: jobReducer,
  filter: filterReducer,
  auth: authReducer,
  notification: notificationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // chỉ persist slice user
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // vì redux-persist có non-serializable
    }),
});

export const makePersistor = (): Persistor => {
  // tạo persistor tương ứng với store hiện tại
  return persistStore(store);
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


