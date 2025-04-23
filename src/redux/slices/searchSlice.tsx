// store/slices/searchSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  keyword: string;
  location: string;
}

const initialState: SearchState = {
  keyword: "",
  location: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    },
    setLocation(state, action: PayloadAction<string>) {
      state.location = action.payload;
    },
  },
});

export const { setKeyword, setLocation } = searchSlice.actions;
export default searchSlice.reducer;
