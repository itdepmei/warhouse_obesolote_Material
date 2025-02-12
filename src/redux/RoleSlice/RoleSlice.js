import { createSlice } from "@reduxjs/toolkit";
import { getRoleAndUserId } from "./rolAction";
const initialState = {
  Permission: [],
  isError: false,
  isSuccess: false,
  loading: false,
  roles: {
    Add_Data_Users: {
      value: false,
      _id: 5,
    },
    Add_main_class: {
      value: false,
      _id: 6,
    },
    view_data_obsolete: {
      value: false,
      _id: 7,
    },
    Show_obSolete: {
      value: false,
      _id: 8,
    },
    setting_information: {
      value: false,
      _id: 9,
    },
    management_permission: {
      value: false,
      _id: 10,
    },
    Insert_obsolete_materials: {
      value: false,
      _id: 12,
    },
    show_log: {
      value: false,
      _id: 13,
    },
    show_profile: {
      value: false,
      _id: 14,
    },
    management_user_from_entity: {
      value: false,
      _id: 15,
    },
    show_log_entity: {
      value: false,
      _id: 16,
    },
    show_archive: {
      value: false,
      _id: 17,
    },
    show_all_data_obsolete_material: {
      value: false,
      _id: 18,
    },
    show_statistics_entity: {
      value: false,
      _id: 19,
    },
    show_statistics: {
      value: false,
      _id: 20,
    },
    admin_insert_user: {
      value: false,
      _id: 21,
    },
    approve_Super_admin_root_to_request: {
      value: false,
      _id: 22,
    },
    approve_admin_to_request: {
      value: false,
      _id: 23,
    },
    management_order_entity: {
      value: false,
      _id: 24,
    },
    management_Nonfiction: {
      value: false,
      _id: 25,
    },
    Booking_requests: {
      value: false,
      _id: 26,
    },
    allow_to_users_to_send_directly_request_and_upload: {
      value: false,
      _id: 27,
    },
    allow_to_users_to_save_material_from_file_excel: {
      value: false,
      _id: 28,
    },
    management_factory: {
      value: false,
      _id: 31,
    },
    show_all_data_inventory_material: {
      value: false,
      _id: 32,
    },
    management_store: {
      value: false,
      _id: 33,
    },
    store_general_setting: {
      value: false,
      _id: 29,
    },
    add_factory: {
      value: false,
      _id: 34,
    },
    add_lab: {
      value: false,
      _id: 35,
    },
    add_store: {
      value: false,
      _id: 36,
    },
    allow_to_see_reports_warehouse: {
      value: false,
      _id: 37,
    },
    show_main_page: {
      value: false,
      _id: 38,
    },
    management_lab: {
      value: false,
      _id: 39,
    },
    warehouse_page: {
      value: false,
      _id: 40,
    },
    general_reports: {
      value: false,
      _id: 41,
    },
    show_all_data_shipment: {
      value: false,
      _id: 42,
    },
  },
};
export const RolesReducer = createSlice({
  name: "RolesData",
  initialState: initialState,
  reducers: {
    setRolesRedux: (state, action) => {
      state.roles = action.payload;
    },
    getRoleRedux: (state) => {
      return state.roles;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoleAndUserId.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getRoleAndUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true; // registration isSuccessful
        state.Permission = action.payload;
      })
      .addCase(getRoleAndUserId.rejected, (state, action) => {
        state.loading = false;
        state.isError = action.payload;
        state.message = action.payload;
      });
  },
});
export const { setRolesRedux, getRoleRedux } = RolesReducer.actions;
export default RolesReducer.reducer;
export const userSelector = (state) => state.RolesData;
