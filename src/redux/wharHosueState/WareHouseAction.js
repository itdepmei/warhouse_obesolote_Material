import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BackendUrl } from "../api/axios";
import { getToken } from "../../utils/handelCookie";
// Helper to refresh token

const getAllWarehouse = createAsyncThunk(
  "auth/getAllWarehouse",
  async (
    { minister_id, entity_id, lab_id, factory_id },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios({
        method: "get",
        url: `${BackendUrl}/api/warehouse/getWarehouseData?entity_id=${entity_id}&ministry_id=${minister_id}&lab_id=${lab_id}&factory_id=${factory_id}`,
        headers: {
          authorization: getToken(),
        },
      });

      if (response?.data?.data) {
        return response.data.data;
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
export { getAllWarehouse };
