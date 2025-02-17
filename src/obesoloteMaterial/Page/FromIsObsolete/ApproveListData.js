import { useState, useEffect, useCallback } from "react";
import Header from "../../../components/HeaderComponent.jsx";
import { Box, Divider } from "@mui/material";
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
import { DeleteOutlined, MarkChatRead, OpenInNew } from "@mui/icons-material";
import Loader from "../../../components/Loader.jsx";
import "../style.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/handelCookie.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDataUserById } from "../../../redux/userSlice/authActions.js";
import { setLanguage } from "../../../redux/LanguageState.js";
import { useApi } from "../../../hooks/useApi.js";
const FormApproveToRequest = ({
  urlFetcHData,
  title,
  pathApprove,
  technicalSupport,
  approve_to_request,
  roles,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { rtl } = useSelector((state) => state.language);
  const { dataUserById } = useSelector((state) => {
    return state?.user;
  });
  const [deleteItem, setDelete] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshButton, setRefreshButton] = useState(false);
  const [loading, setLoading] = useState(null);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataMainClass, setDataMainClass] = useState([]);
  const [dataSubClass, setDataSubClass] = useState([]);
  const [dataUnitMeasuring, setDataUnitMeasuring] = useState([]);
  const [totalPages, setTotalPages] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const [filterDataMainClass, setFilterDataMainClass] = useState([]);
  const [dataMaterials, setDataMaterials] = useState([]);
  const { loading: apiLoading, error, fetchData } = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  let token = getToken();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDataUserById(token));
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
    approve_to_request,
    urlFetcHData,
  ]);
  const fetchDataByProjectId = useCallback(async () => {
    try {
      await fetchData({
        endpoint: `/api/${urlFetcHData}`,
        method: "GET",
        params: {
          page,
          limit,
          entities_id: dataUserById?.entity_id,
          checkPermissionUser: approve_to_request,
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
  }, [fetchData, page, limit, dataUserById?.entity_id, approve_to_request]);
  useEffect(() => {
    fetchDataByProjectId();
  }, [fetchDataByProjectId, page, limit, approve_to_request]);
  const rows = dataMaterials?.map((item, index) => ({
    index: index + 1,
    ...item,
  }));
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
      flex: 2, // Use flex to make the column width flexible
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "sub_class_name",
      headerName: t("Stagnant.subClass"),
      flex: 2, // Adjust flex value according to preference
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "name_material",
      headerName: t("Stagnant.nameMaterial"),
      flex: 2, // Adjust flex value according to preference
    },

    {
      field: "Quantity",
      headerName: t("Stagnant.quantity"),
      flex: 0.8, // Adjust flex value according to preference
    },
    {
      field: "puchase_date",
      headerName: t("MaterialOverview.purchase date"),
      flex: 1.5, // Adjust flex value according to preference
      renderCell: (params) => (
        <p>{formatDateYearsMonth(params.row.puchase_date)}</p>
      ),
    },
    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 0.8,
      renderCell: (params) => (
        <DropDownGrid>
          {!technicalSupport && (
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
          )}
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
          {renderMenuItem(
            "Approve request",
            () => handleApproveAdminData(params?.row?.stagnant_id),
            MarkChatRead,
            "الموافقة على رفع المادة"
          )}
        </DropDownGrid>
      ),
    },
  ];
  const openProduct = (id) => {
    navigate(`Material-Overview/${id}`);
  };
  const handleApproveAdminData = (id) => {
    Swal.fire({
      title: "هل تريد الاستمرار؟",
      icon: "question",
      confirmButtonText: "نعم",
      cancelButtonText: "لا",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await axios.post(
            `${BackendUrl}/api/${pathApprove}`,
            { dataId: id },
            {
              headers: {
                authorization: token,
              },
            }
          );
          if (response?.data) {
            toast.success(response?.data?.message);
            setRefreshButton((prev) => !prev); // Trigger refresh after update
          }
        } catch (error) {
          console.error("Error updating booked material:", error);
          toast.error("Failed to update booked material");
        } finally {
          setLoading(false);
        }
      }
    });
  };
  return (
    <>
      {loading && <Loader />}
      <Box
        dir={rtl?.dir}
        sx={{ marginLeft: "20px", marginRight: "20px", minWidth: "999px" }}
      >
        <Header title={title} dir={rtl?.dir} />
        <div className="mb-2">
          <RefreshButtonData setRefreshButton={setRefreshButton} />
        </div>
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
export default FormApproveToRequest;
