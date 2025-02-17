import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BackendUrl } from "../api/axios";
import { getToken } from "../../utils/handelCookie";
const getAllWarehouse = createAsyncThunk(
  "auth/getAllWarehouse",
  async (
    { minister_id, entity_id, lab_id, factory_id },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${BackendUrl}/api/warehouse/getWarehouseData`,
        params: {
          entity_id,
          ministry_id: minister_id,
          lab_id,
          factory_id
        },
        headers: {
          authorization: getToken(),
        },
      });

      if (response?.data?.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export { getAllWarehouse };
