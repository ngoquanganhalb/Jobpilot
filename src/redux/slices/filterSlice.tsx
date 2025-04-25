import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobType } from "@/types/db";

type FilterState = {
  location?: string;
  tags?: string[];
  jobTypes?: JobType[];
  minSalary?: number;
  maxSalary?: number;
  isRemote?: boolean;
};

const initialState: FilterState = {
  location: "",
  tags: [],
  jobTypes: [],
  minSalary: 0,
  maxSalary: 200000,
  isRemote: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FilterState>) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
