"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import storage from "redux-persist/lib/storage";

import exampleReducer from "./slices/exampleSlice";
import userReducer from "./slices/userSlice";
import searchReducer from "./slices/searchSlice";
import jobReducer from "./slices/jobSlice";
import filterReducer from "./slices/filterSlice";
import authReducer from "./slices/authSlice"; // file bạn paste ở trên
import notificationReducer from "./slices/notificationSlice";

// GỘP reducer bình thường
const rootReducer = combineReducers({
  example: exampleReducer,
  user: userReducer,
  search: searchReducer,
  jobs: jobReducer,
  filter: filterReducer,
  auth: authReducer,
  notification: notificationReducer,
});

// CONFIG persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // chỉ persist slice user
  // LƯU Ý: KHÔNG persist accessToken trong redux để tránh lộ token
};

// wrap rootReducer bằng persistReducer
const persistedRootReducer = persistReducer(persistConfig, rootReducer);

// tạo store
export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // vì redux-persist có non-serializable
    }),
});

// ⚠️ KHÔNG tạo persistor ở đây nữa
export const makePersistor = (): Persistor => {
  // tạo persistor tương ứng với store hiện tại
  return persistStore(store);
};

// types + hook dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// only redux
// import { configureStore } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";
// import exampleReducer from "./slices/exampleSlice";
// import userReducer from "./slices/userSlice";

// export const store = configureStore({
//   reducer: {
//     example: exampleReducer,
//     user: userReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
