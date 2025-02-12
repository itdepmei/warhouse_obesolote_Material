import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BackendUrl } from "../api/axios";
import { getToken } from "../../utils/handelCookie";

const getAllLab = createAsyncThunk(
  "auth/getAllLab",
  async ({ entity_id, factory_idUser }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "get",
        url: `${BackendUrl}/api/warehouse/getLabData?entity_id=${entity_id}&factory_id=${factory_idUser}`,
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
export { getAllLab };
