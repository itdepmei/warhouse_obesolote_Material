import { createSlice } from "@reduxjs/toolkit";
import { getAllLab } from "./LabAction";
export const LabSlice = createSlice({
  name: "lab",
  initialState: {
    loading: false,
    labData: [],
    code: false,
    isFetching: false,
    isSuccess: false,
    isSuccessMessage: false,
    isError: false,
    message: "",
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllLab.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getAllLab.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.labData = payload;
      })
      .addCase(getAllLab.rejected, (state, { payload }) => {

        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
      });
  },
});
export default LabSlice.reducer;
export const { clearState } = LabSlice.actions;
export const labSelector = (state) => state.lab;
