import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BackendUrl } from "../api/axios";
import { getToken } from "../../utils/handelCookie";
// Helper to refresh token
const getAllFactory = createAsyncThunk(
  "auth/getAllFactory",
  async ({ entity_id, page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "get",
        url: `${BackendUrl}/api/warehouse/getFactoriesData?entity_id=${entity_id}&page=${page}&limit=${limit}`,
        headers: {
          authorization: getToken(),
        },
      });

      if (response?.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        console.log(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export { getAllFactory };
