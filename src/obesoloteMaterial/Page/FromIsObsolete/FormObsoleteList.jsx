import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/HeaderComponent.jsx";
import { Box, Button, Divider } from "@mui/material";
import { setLanguage } from "../../../redux/LanguageState.js";
import { useTranslation } from "react-i18next";
import GridTemplate from "../../../components/GridTemplet.jsx";
import RefreshButtonData from "../../../components/RefreshButton.jsx";
import axios from "axios";
import { BackendUrl } from "../../../redux/api/axios.js";
import FromIsDeleted from "./FromObsolete.js";
import DropDownGrid from "../../../components/CustomMennu.jsx";
import {
  DeleteItem,
  formatDateYearsMonth,
  hasPermission,
  renderMenuItem,
} from "../../../utils/Function.jsx";
import {
  Close,
  DeleteOutlined,
  DoneOutline,
  OpenInNew,
  Search,
} from "@mui/icons-material";
import Loader from "../../../components/Loader.jsx";
import FilterData from "./FilterData.jsx";
import "../style.css";
import { getToken } from "utils/handelCookie.jsx";
import { getDataUserById } from "../../../redux/userSlice/authActions.js";
import { getRoleAndUserId } from "../../../redux/RoleSlice/rolAction.js";
import HandelExcelFile from "./excelForm/HandelExcell.js";
import { useApi } from "../../../hooks/useApi.js";
const FormDeletedList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { rtl } = useSelector((state) => state.language);
  const { dataUserById } = useSelector((state) => {
    return state.user;
  });
  const [deleteItem, setDelete] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [refreshButton, setRefreshButton] = useState(false);
  const [loading, setLoading] = useState(null);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataMainClass, setDataMainClass] = useState([]);
  const [dataSubClass, setDataSubClass] = useState([]);
  const [dataUnitMeasuring, setDataUnitMeasuring] = useState([]);
  const [totalPages, setTotalPages] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const [filterDataMainClass, setFilterDataMainClass] = useState([]);
  const { roles, Permission } = useSelector((state) => state.RolesData);
  const [dataMaterials, setDataMaterials] = useState([]);
  const [permissionData, setPermissionData] = useState([]);

  const { t } = useTranslation();
  const navigate = useNavigate();
  let token = getToken();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDataUserById(token));
    dispatch(getRoleAndUserId(token));
    dispatch(setLanguage());
  }, [dispatch, token]);
  useEffect(() => {
    if (filterDataMainClass.length > 0) {
      setDataMaterials(filterDataMainClass);
    } else {
      setDataMaterials(dataProduct);
    }
  }, [filterDataMainClass, dataProduct]);
  useEffect(() => {
    if (Permission?.permission_id) {
      try {
        const parsedData = JSON.parse(Permission.permission_id);
        setPermissionData(parsedData);
      } catch (error) {
        console.error("Error parsing permission_id:", error);
      }
    }
  }, [Permission]);
  useEffect(() => {
    const hasDirectPermission = hasPermission(
      roles?.show_all_data_obsolete_material?._id,
      permissionData
    );
    const url = hasDirectPermission
      ? "getDataStagnantMaterialsPa"
      : "getDataStagnantMaterialsByUserId";
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const fetchMainClassData = axios.get(
          `${BackendUrl}/api/getDataMainClass`,
          { headers: { authorization: token } }
        );
        const fetchSubClassData = axios.get(
          `${BackendUrl}/api/getDataSubClass`,
          { headers: { authorization: token } }
        );
        const fetchUnitMeasuringData = axios.get(
          `${BackendUrl}/api/getAllDataUnits`,
          { headers: { authorization: token } }
        );

        const [mainClassResponse, subClassResponse, unitMeasuringResponse] =
          await Promise.allSettled([
            fetchMainClassData,
            fetchSubClassData,
            fetchUnitMeasuringData,
          ]);
        // Set data or handle failures
        if (mainClassResponse.status === "fulfilled") {
          setDataMainClass(mainClassResponse.value?.data?.response || []);
        } else {
          console.error(
            "Failed to fetch main class data:",
            mainClassResponse.reason
          );
        }
        if (subClassResponse.status === "fulfilled") {
          setDataSubClass(subClassResponse.value?.data?.response || []);
        } else {
          console.error(
            "Failed to fetch sub class data:",
            subClassResponse.reason
          );
        }
        if (unitMeasuringResponse.status === "fulfilled") {
          setDataUnitMeasuring(
            unitMeasuringResponse.value?.data?.response || []
          );
        } else {
          console.error(
            "Failed to fetch unit measuring data:",
            unitMeasuringResponse.reason
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [
    dataUserById,
    deleteItem,
    refreshButton,
    page,
    limit,
    token,
    roles?.view_data_obsolete?._id,
    permissionData,
    roles?.show_all_data_obsolete_material?._id,
  ]);
  const { loading: apiLoading, error, fetchData } = useApi();
  const fetchDataByProjectId = useCallback(async () => {
    try {
      const hasDirectPermission = hasPermission(
        roles?.show_all_data_obsolete_material?._id,
        permissionData
      );
      const url = hasDirectPermission
        ? "getDataStagnantMaterialsPa"
        : "getDataStagnantMaterialsByUserId";

      await fetchData({
        endpoint: `/api/${url}`,
        method: "GET",
        params: {
          page,
          limit,
          entities_id: dataUserById?.entity_id,
          checkPermissionUser: roles?.view_data_obsolete?._id,
        },
        onSuccess: (data) => {
          if (data?.response) {
            setDataProduct(data.response);
            setTotalPages(data.pagination?.totalPages || 0);
            setTotalItems(data.pagination?.totalItems || 0);
          } else {
            setDataProduct([]);
            setTotalPages(0);
            setTotalItems(0);
          }
        },
        onError: (err) => {
          console.error("Error fetching data:", err);
          setDataProduct([]);
          setTotalPages(0);
          setTotalItems(0);
        },
      });
    } catch (error) {
      console.error("Error in fetchDataByProjectId:", error);
      setDataProduct([]);
      setTotalPages(0);
      setTotalItems(0);
    }
  }, [
    fetchData,
    page,
    limit,
    dataUserById?.entity_id,
    roles?.view_data_obsolete?._id,
    roles?.show_all_data_obsolete_material?._id,
    permissionData,
    hasPermission,
  ]);
  useEffect(() => {
    fetchDataByProjectId();
  }, [
    fetchDataByProjectId,
    page,
    limit,
    roles?.view_data_obsolete?._id,
    roles?.show_all_data_obsolete_material?._id,
    permissionData,
    hasPermission,
  ]);
  const columns = [
    { field: "stagnant_id", headerName: "ID", hideable: false, width: 70 },
    {
      field: "index",
      headerName: "#",
      width: 33,
      renderCell: (params) => params.index,
    },
    {
      field: "main_Class_name",
      headerName: t("Stagnant.mainClass"),
      flex: 1, // Use flex to make the column width flexible
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "sub_class_name",
      headerName: t("Stagnant.subClass"),
      flex: 1.5, // Adjust flex value according to preference
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "name_material",
      headerName: t("Stagnant.nameMaterial"),
      flex: 1.5, // Adjust flex value according to preference
    },
    {
      field: "measuring_unit",
      headerName: t("Stagnant.measuringUnit"),
      flex: 1, // Adjust flex value according to preference
    },
    {
      field: "Quantity",
      headerName: t("Stagnant.quantity"),
      flex: 1, // Adjust flex value according to preference
    },
    {
      field: "puchase_date",
      headerName: t("MaterialOverview.purchase date"),
      flex: 1, // Adjust flex value according to preference
      renderCell: (params) => (
        <p>{formatDateYearsMonth(params.row.puchase_date)}</p>
      ),
    },
    {
      field: "approved_admin",
      headerName: t("MaterialOverview.order status"),
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {params?.row?.approved_admin ? (
              <DoneOutline color="success" />
            ) : (
              <Close color="error" />
            )}
          </div>
        );
      },
    },
    {
      field: "approve_super_user_root",
      headerName: t("MaterialOverview.Technical support approval"),
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {params?.row?.approve_super_user_root ? (
              <DoneOutline color="success" />
            ) : (
              <Close color="error" />
            )}
          </div>
        );
      },
    },
    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => (
        <DropDownGrid>
          <FromIsDeleted
            dataUserById={dataUserById}
            dataSubClass={dataSubClass}
            dataMainClass={dataMainClass}
            dataUnitMeasuring={dataUnitMeasuring}
            setRefreshButton={setRefreshButton}
            label={"EditData"}
            DataProject={params?.row}
            token={token}
          />
          <Divider sx={{ my: 0.5 }} />
          {renderMenuItem(
            "delete",
            () =>
              DeleteItem(
                params?.row?.stagnant_id,
                setDelete,
                setAnchorEl,
                token,
                "deleteProjectById"
              ),
            DeleteOutlined,
            "حذف"
          )}
          {renderMenuItem(
            "informationProduct",
            () => openProduct(params?.row?.stagnant_id),
            OpenInNew,
            "معلومات المنتج"
          )}
          <Divider />
          {/* <BookingForm
            obsoleteMaterial={params?.row?.stagnant_id}
            Quantity={params?.row?.Quantity}
            dataUserById={dataUserById}
          /> */}
        </DropDownGrid>
      ),
    },
  ];
  const rows = dataMaterials?.map((item, index) => ({
    index: index + 1,
    ...item,
  }));
  const openProduct = (id) => {
    navigate(`Material-Overview/${id}`);
  };
  const handleAddDataModel = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);
  return (
    <>
      {apiLoading && <Loader />}
      <Box
        dir={rtl?.dir}
        sx={{ marginLeft: "20px", marginRight: "20px", minWidth: "999px" }}
      >
        <Header title={t("Stagnant.title")} dir={rtl?.dir} />
        <div className="d-flex flex-wrap w-100 gap-3 mb-3">
          <FromIsDeleted
            dataUserById={dataUserById}
            dataSubClass={dataSubClass}
            dataMainClass={dataMainClass}
            dataUnitMeasuring={dataUnitMeasuring}
            setRefreshButton={setRefreshButton}
            token={token}
          />
          {hasPermission(
            roles?.allow_to_users_to_save_material_from_file_excel?._id,
            permissionData
          ) && (
            <HandelExcelFile
              dataUserById={dataUserById}
              dataSubClass={dataSubClass}
              dataMainClass={dataMainClass}
              dataUnitMeasuring={dataUnitMeasuring}
              setRefreshButton={setRefreshButton}
              token={token}
            />
          )}

          {!open && (
            <Button variant="outlined" onClick={handleAddDataModel}>
              <Search />
              <span>{t("search")}</span>
            </Button>
          )}
          <RefreshButtonData setRefreshButton={setRefreshButton} />
        </div>
        <FilterData
          dataUserById={dataUserById}
          dataSubClass={dataSubClass}
          dataMainClass={dataMainClass}
          open={open}
          limit={limit}
          page={page}
          setOpen={setOpen}
          setTotalItems={setTotalItems}
          setTotalPages={setTotalPages}
          setRefreshButton={setRefreshButton}
          setFilterDataMainClass={setFilterDataMainClass}
          setDataProduct={setDataProduct}
          token={token}
        />
        <GridTemplate
          rows={rows}
          columns={columns}
          setLimit={setLimit}
          setPage={setPage}
          page={page}
          limit={limit}
          totalItems={totalItems}
          totalPages={totalPages}
        />
      </Box>
    </>
  );
};
export default FormDeletedList;
