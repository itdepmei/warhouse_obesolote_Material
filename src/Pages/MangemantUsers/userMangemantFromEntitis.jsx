import React, { useCallback, useEffect, useState } from "react";
import ManagementUsers from "./ManagemantUsersList";
import { BackendUrl } from "../../redux/api/axios";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getDataUserById } from "../../redux/userSlice/authActions";
import { getToken } from "../../utils/handelCookie";
import { useTranslation } from "react-i18next";
import { useApi } from "../../hooks/useApi";
function UserManagementFromEntities() {
  const { roles } = useSelector((state) => state.RolesData);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false); // Changed to false for better handling
  const [dataUser, setDataUser] = useState([]);
  const [deleteItem, setDelete] = useState([]); // Updated to match expected type (Array)
  const [totalPages, setTotalPages] = useState(0); // Set initial value to 0 for consistency
  const [totalItems, setTotalItems] = useState(0); // Set initial value to 0 for consistency
  const token = getToken();
  const [refreshButton, setRefreshButton] = useState(false);
  const { t } = useTranslation();
  const { dataUserById } = useSelector((state) => {
    return state?.user;
  });
  const dispatch = useDispatch();
  const { loading: apiLoading, error, fetchData } = useApi(); // Using the new API hook
  useEffect(() => {
    console.log("Dispatching getDataUserById");
    dispatch(getDataUserById(token));
  }, [dispatch, token]);
  const fetchDataByProjectId = useCallback(async () => {
    console.log("fetchDataByProjectId called with:", {
      page,
      limit,
      checkPermissionUser: roles?.Add_Data_Users?._id,
    });
    try {
      const response = await fetchData({
        endpoint: "/api/getDataUserManageByIdEntities",
        method: "GET",
        params: {
          page,
          limit,
          id: dataUserById.entity_id,
          checkPermissionUser: roles?.Add_Data_Users?._id,
        },
        onSuccess: (data) => {
          console.log("Data fetched successfully:", data);
          setDataUser(data?.response);
          setTotalPages(data?.pagination?.totalPages);
          setTotalItems(data?.pagination?.totalItems);
        },
        onError: (err) => {
          console.error("Error in fetchDataByProjectId:", err);
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  }, [fetchData, page, limit, roles?.Add_Data_Users?._id]);
  // Added fetchDataByProjectId to dependencies
  useEffect(() => {
    fetchDataByProjectId();
  }, [page, limit, roles?.Add_Data_Users?._id]);
  return (
    <div>
      <ManagementUsers
        dataUser={dataUser}
        totalPages={totalPages}
        totalItems={totalItems}
        setDelete={setDelete}
        page={page}
        setPage={setPage} // Ensure setPage is passed for pagination
        limit={limit}
        setLimit={setLimit}
        allUser={false}
        setRefreshButton={setRefreshButton}
        pathLink={"SetPermissionFromEntities"}
        loading={loading} // Optionally pass loading state to child
        title={`${t("userManager.user management")} ${
          dataUserById?.Entities_name
        }`}
        info={dataUserById}
      />
    </div>
  );
}

export default UserManagementFromEntities;
