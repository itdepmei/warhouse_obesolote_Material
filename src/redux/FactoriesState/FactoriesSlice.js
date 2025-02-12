import { createSlice } from "@reduxjs/toolkit";
import { getAllFactory } from "./FactoriesAction";
export const factorySlice = createSlice({
  name: "factory",
  initialState: {
    loading: false,
    factoryData: [],
    currentPage: 1,
    itemsPerPage:10,
    totalPages: 0,
    totalItems: 0,
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
      .addCase(getAllFactory.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getAllFactory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.factoryData = payload?.data;
        state.page=payload.pagination?.currentPage;
        state.limit=payload.pagination?.itemsPerPage;
        state.totalPages=payload.pagination?.totalPages;
        state.totalItems=payload.pagination?.totalItems
      })
      .addCase(getAllFactory.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
      });
  },
});
export default factorySlice.reducer;
export const { clearState } = factorySlice.actions;
export const factorySelector = (state) => state.factory;
