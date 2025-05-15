//redux persist
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // save to localStorage
import exampleReducer from "./slices/exampleSlice";
import userReducer from "./slices/userSlice";
import searchReducer from "./slices/searchSlice"
import { useDispatch } from "react-redux";
import jobReducer from './slices/jobSlice';
import filterReducer from './slices/filterSlice'

const rootReducer = combineReducers({
  example: exampleReducer,
  user: userReducer,
  search: searchReducer,
  jobs: jobReducer,
  filter: filterReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only persist slice "user"
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // prevent error with redux-persist
    }),
});

export const persistor = persistStore(store);

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



// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();


