import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Factories from "./Factories";
import LabsEntity from "./LabsEntity";
import StroeData from "./StroeData";
import axios from "axios";
import { BackendUrl } from "../../../redux/api/axios";
import { getToken } from "../../../utils/handelCookie";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useCallback } from "react";
import { getAllWarehouse } from "../../../redux/wharHosueState/WareHouseAction";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material";
import { getAllFactory } from "../../../redux/FactoriesState/FactoriesAction";
import { getAllLab } from "../../../redux/LaboriesState/LabAction";
import { getRoleAndUserId } from "../../../redux/RoleSlice/rolAction";
import { hasPermission } from "../../../utils/Function";
import { getDataUserWithFactoryById } from "../../../redux/getDataProjectById/getActions";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function LabTabsWareHouse() {
  const token = getToken();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const { rtl } = useSelector((state) => state?.language);
  const { factoryData, itemsPerPage, currentPage, totalPages, totalItems } =
    useSelector((state) => state.factory);
  const { Permission, roles } = useSelector((state) => state?.RolesData);
  const { dataUserFactory } = useSelector((state) => {
    return state?.dataHandelUserAction;
  });
  const [value, setValue] = React.useState(0);
  const { wareHouseData } = useSelector((state) => state?.wareHouse);
  const { labData } = useSelector((state) => state?.lab);
  const { dataUserById } = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(false);
  const [deleteItem, setDelete] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [limit, setLimit] = useState(currentPage ? currentPage : 10);
  const [page, setPage] = useState(itemsPerPage ? itemsPerPage : 1);
  const [dataUserLab, setDataUserLab] = useState([]);

  // Fetch roles and permissions by user ID
  useEffect(() => {
    const userId = dataUserById?.user_id;
    if (userId) {
      dispatch(getRoleAndUserId({ token, userId }));
    }
  }, [dispatch, dataUserById?.user_id, token]);

  // Parse permission data
  useEffect(() => {
    if (Permission?.permission_id) {
      try {
        setPermissionData(JSON.parse(Permission.permission_id));
      } catch (error) {
        console.error("Error parsing permission_id:", error);
      }
    }
  }, [Permission]);

  // Fetch user data by entity ID
  const fetchDataUserEntityId = useCallback(async () => {
    if (!dataUserById?.entity_id) return;
    try {
      const response = await axios.get(
        `${BackendUrl}/api/getDataUserManageBIdEntityWithoutLimit/${dataUserById.entity_id}`,
        {
          headers: { authorization: token },
        }
      );
      setDataUser(response?.data?.response || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(t("errorFetchingUserData"));
    }
  }, [dataUserById?.entity_id, token, t, refreshKey]);
  // Fetch warehouse and user data
  const getWarehouseAndUserData = useCallback(async () => {
    if (!dataUserById?.entity_id) return;
    try {
      const response = await axios.get(
        `${BackendUrl}/api/warehouse/getWarehouseAndUserData?user_id=${dataUserById?.user_id}&entity_id=${dataUserById?.entity_id}`,
        {
          headers: { authorization: token },
        }
      );
      console.log("dlfkksjdf=>",response?.data);
      setDataUserLab(response?.data?.data[0] || {});
    } catch (error) {
      console.error("Error fetching warehouse and user data:", error);
      toast.error(error.response.data.message);
    }
  }, [dataUserById?.entity_id, token]);
  // Fetch data on user ID and entity ID change
  useEffect(() => {
    if (dataUserById?.user_id && dataUserById?.entity_id) {
      const { user_id, entity_id } = dataUserById;
      dispatch(getDataUserWithFactoryById({ user_id, entity_id }));
    }
  }, [dispatch, dataUserById]);
  // Call fetch functions on dependencies change
  useEffect(() => {
    fetchDataUserEntityId();
    getWarehouseAndUserData();
  }, [fetchDataUserEntityId, getWarehouseAndUserData, refreshKey]);

  // Fetch factory, lab, and warehouse data
  useEffect(() => {
    const { entity_id, minister_id } = dataUserById || {};
    const { lab_id, factory_id } = dataUserLab || {};
    const factory_idUser = dataUserFactory&&dataUserFactory?.factory_id;
    if (entity_id) {
      dispatch(getAllFactory({ entity_id, page, limit }));
      if (factory_idUser || entity_id) {
        dispatch(getAllLab({ entity_id, factory_idUser, page, limit }));
      }
      dispatch(
        getAllWarehouse({
          minister_id,
          entity_id,
          lab_id,
          factory_id,
        })
      );
    }
  }, [
    dispatch,
    dataUserById,
    dataUserLab,
    dataUserFactory,
    refreshKey,
    deleteItem,
    anchorEl,
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // Dynamic tab and panel rendering
  const tabs = [
    {
      label: t("أضافة المصنع"),
      component: (
        <Factories
          dataUserById={dataUserById}
          wareHouseData={wareHouseData}
          dataUser={dataUser}
          token={token}
          rtl={rtl}
          theme={theme}
          t={t}
          loading={loading}
          seLoading={setLoading}
          totalItems={totalItems}
          totalPages={totalPages}
          limit={limit}
          page={page}
          setLimit={setLimit}
          setPage={setPage}
          setDelete={setDelete}
          setAnchorEl={setAnchorEl}
          deleteItem={deleteItem}
          anchorEl={anchorEl}
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          factoryData={factoryData}
          hasPermission={hasPermission}
          roles={roles}
          permissionData={permissionData}
        />
      ),
      permissionKey: roles?.add_factory?._id,
    },
    {
      label: t("أضافة المعامل"),
      component: (
        <LabsEntity
          dataUserById={dataUserById}
          wareHouseData={wareHouseData}
          dataUser={dataUser}
          token={token}
          rtl={rtl}
          theme={theme}
          loading={loading}
          seLoading={setLoading}
          t={t}
          totalItems={totalItems}
          totalPages={totalPages}
          limit={limit}
          page={page}
          setLimit={setLimit}
          setPage={setPage}
          setDelete={setDelete}
          setAnchorEl={setAnchorEl}
          deleteItem={deleteItem}
          anchorEl={anchorEl}
          factoryData={factoryData}
          labData={labData}
          dataUserFactor={dataUserFactory}
          factory_id={dataUserFactory?.factory_id}
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          hasPermission={hasPermission}
          roles={roles}
          permissionData={permissionData}
        />
      ),
      permissionKey: roles?.add_lab?._id,
    },
    {
      label: t("أضافة المخازن"),
      component: (
        <StroeData
          dataUserById={dataUserById}
          wareHouseData={wareHouseData}
          dataUser={dataUser}
          token={token}
          rtl={rtl}
          theme={theme}
          t={t}
          loading={loading}
          seLoading={setLoading}
          totalItems={totalItems}
          totalPages={totalPages}
          limit={limit}
          page={page}
          setLimit={setLimit}
          setPage={setPage}
          setDelete={setDelete}
          setAnchorEl={setAnchorEl}
          deleteItem={deleteItem}
          anchorEl={anchorEl}
          factoryData={factoryData}
          labData={labData}
          dataUserLab={dataUserLab}
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          hasPermission={hasPermission}
          roles={roles}
          permissionData={permissionData}
        />
      ),
      permissionKey: roles?.add_store?._id,
    },
  ];

  const filteredTabs = tabs?.filter((tab) =>
    hasPermission(tab?.permissionKey, permissionData)
  );

  return (
    <Box sx={{ width: "100%" }} dir={rtl ? "rtl" : "ltr"}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {filteredTabs?.map((tab, index) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {filteredTabs?.map((tab, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {tab?.component}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
