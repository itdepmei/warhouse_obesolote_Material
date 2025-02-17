import React, { useCallback, useEffect, useState } from "react";
import ManagementUsers from "./ManagemantUsersList";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../utils/handelCookie";
import {
  getDataUserById,
} from "../../redux/userSlice/authActions";
import { useTranslation } from "react-i18next";
import { useApi } from '../../hooks/useApi'; // Assuming useApi hook is imported from here

function UserManagementAllUsers() {
  const { dataUserById } = useSelector((state) => {
    return state.user;
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dataUser, setDataUser] = useState([]);
  const [deleteItem, setDelete] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { t } = useTranslation();
  const token = getToken();
  const [refreshButton, setRefreshButton] = useState(false);
  const { roles } = useSelector((state) => state.RolesData);
  const dispatch = useDispatch();
  const { loading: apiLoading, error, fetchData } = useApi(); // Using the new API hook
  useEffect(() => {
    console.log('Dispatching getDataUserById');
    dispatch(getDataUserById(token));
  }, [dispatch, token]);
  const fetchDataByProjectId = useCallback(async () => {
    console.log('fetchDataByProjectId called with:', {
      page,
      limit,
      checkPermissionUser: roles?.Add_Data_Users?._id
    });
    try {
      const response = await fetchData({
        endpoint: '/api/getDataUserManage',
        method: 'GET',
        params: {
          page,
          limit,
          checkPermissionUser: roles?.Add_Data_Users?._id
        },
        onSuccess: (data) => {
          console.log('Data fetched successfully:', data);
          setDataUser(data?.response);
          setTotalPages(data?.pagination?.totalPages);
          setTotalItems(data?.pagination?.totalItems);
        },
        onError: (err) => {
          console.error('Error in fetchDataByProjectId:', err);
        }
      });
      return response;
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  }, [fetchData, page, limit, roles?.Add_Data_Users?._id]);

  useEffect(() => {
    console.log('Effect triggered with:', { refreshButton, deleteItem, page, limit });
    fetchDataByProjectId();
  }, [fetchDataByProjectId, refreshButton, deleteItem, page, limit]);

  return (
    <div>
      <ManagementUsers
        dataUser={dataUser}
        totalPages={totalPages}
        totalItems={totalItems}
        setRefreshButton={setRefreshButton}
        setDelete={setDelete}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        allUser={true}
        pathLink={"Permission"}
        loading={apiLoading} // Using the loading state from the API hook
        title={t("userManager.Authorized personnel information management")}
        info={dataUserById}
      />
    </div>
  );
}

export default UserManagementAllUsers;
