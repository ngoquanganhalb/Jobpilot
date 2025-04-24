//redux persist
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // lưu vào localStorage
import exampleReducer from "./slices/exampleSlice";
import userReducer from "./slices/userSlice";
import searchReducer from "./slices/searchSlice"
import { useDispatch } from "react-redux";
import jobReducer from './slices/jobSlice'

const rootReducer = combineReducers({
  example: exampleReducer,
  user: userReducer,
  search: searchReducer,
  jobs: jobReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // chỉ persist slice "user"
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // để tránh lỗi với redux-persist
    }),
});

export const persistor = persistStore(store);

// Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();


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



// // Type hỗ trợ
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();


