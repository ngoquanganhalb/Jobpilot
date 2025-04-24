import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job } from "../../types/db";

interface JobState {
  jobs: Job[];
}

const initialState: JobState = {
  jobs: [],
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex(
        (job) => job.jobId === action.payload.jobId
      );
      if (index !== -1) {
        state.jobs[index] = { ...state.jobs[index], ...action.payload };
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((job) => job.jobId !== action.payload);
    },
  },
});

export const { setJobs, updateJob, deleteJob } = jobSlice.actions;

export default jobSlice.reducer;
