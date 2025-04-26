import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobType } from "@/types/db";

type FilterState = {
  location?: string;
  tags?: string[];
  jobTypes?: JobType[];
  minSalary?: number | null
  maxSalary?: number | null
  isRemote?: boolean | null
};

const initialState: FilterState = {
  location: "",
  tags: [],
  jobTypes: [],
  minSalary: null,
  maxSalary: null,
  isRemote: null,
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
