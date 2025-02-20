import React, { useEffect, useRef, useState, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import { LocalPrintshopOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/handelCookie";
import { setLanguage } from "../../../redux/LanguageState";
import { getDataUserById } from "../../../redux/userSlice/authActions";
import { getDataUserWithWareHouseDataById } from "../../../redux/getDataProjectById/getActions";
import { BackendUrl } from "../../../redux/api/axios";
import { typeDocument } from "../../../utils/arrayFuction";
import {
  FormatDataNumber,
  formatDateYearsMonth,
  StyledTableCell,
  StyledTableRow,
} from "../../../utils/Function";

const commonCellStyles = {
  fontSize: "11px",
  padding: "4px",
  borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
  height: "25px",
  lineHeight: "15px",
};
const tableCellStyles = {
  ...commonCellStyles,
  whiteSpace: "normal",
  wordBreak: "break-word",
  transition: "background-color 0.2s",
};
const getTableHeaders = (filterDocument) => [
  { id: 1, label: "الرقم الرمزي", align: "right", width: "5%" },
  { id: 2, label: "أسم المادة", align: "right",width: "9%" },
  { id: 3, label: "وحدة القياس", align: "center", width: "5%" },
  { id: 4, label: "رقم المستند", align: "right", width: "5%" },
  { id: 5, label: "تاريخ المستند", align: "center",width: "8%" },
  { id: 6, label: "نوع المستند", align: "center",width: "6%" },
  {
    id: 7,
    label:
      filterDocument === "مستند صادر"
        ? "الكمية الصادرة"
        : filterDocument === "مستند وارد"
        ? "الكمية الواردة"
        : "الكمية",
    align: "center",
    width: "5%",
  },
  { id: 8, label: "الرصيد", align: "center", width: "5%" },
  { id: 9, label: "الموصفة الفنية", align: "center", width: "12%" },
  { id: 10, label: "تاريخ الانتاج", align: "center" ,width: "8%"},
  { id: 11, label: "تاريخ نفاذ الصلاحية", align: "center" ,width: "8%"},
  { id: 12, label: "المنشأ", align: "center",width: "7%" },
  { id: 13, label: "تاريخ شراء المادة", align: "center" ,width: "8%" },
  { id: 14, label: "قيمة الشراء الوحدة الواحدة", align: "center", width: "5%" },
  {
    id: 15,
    label: "أجمالي قيمة الشراء الوحدة المشتراه",
    align: "center",
    width: "10%",
  },
  { id: 16, label: "الحد الادنى للمخزون", align: "center",width: "5%" },
  {
    id: 17,
    label: "حالة المخزون ( تالف , متقادم , منتهي لصلاحية,راكد)",
    align: "center",
    width: "9%",
  },
];

const TableHeader = ({ filterDocument }) => {
  const headers = useMemo(
    () => getTableHeaders(filterDocument),
    [filterDocument]
  );

  return (
    <TableHead>
      <StyledTableRow>
        {headers.map((header) => (
          <StyledTableCell
            key={header.id}
            align={header.align}
            width={`${header.width}%`}
            className="header"
            dir="rtl"
            sx={{
              ...commonCellStyles,
              height: "25px",
              lineHeight: "15px",
            }}
          >
            {header.label}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
};

const InfoRow = ({ label, value }) => (
  <li style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
    <Typography component="span" sx={{ color: "#666" }}>
      {label}:
    </Typography>{" "}
    <Typography component="span" sx={{ color: "#000" }}>
      {value || "---"}
    </Typography>
  </li>
);
const PrintInventory = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const componentRef = useRef();
  const [dataStore_id, setDataStore_id] = useState({});
  const [dataMaterials, setDataMaterials] = useState([]);
  const [filterDocument, setFilterDocument] = useState("الكل");
  const [loading, setLoading] = useState(false);

  const store_id = searchParams.get("store_id");
  const token = getToken();

  const { dataUserById } = useSelector((state) => state.user);
  const { dataUserLab } = useSelector((state) => state.dataHandelUserAction);

  useEffect(() => {
    if (token) {
      dispatch(getDataUserById(token));
      dispatch(setLanguage());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (dataUserById?.user_id && dataUserById?.entity_id) {
      dispatch(
        getDataUserWithWareHouseDataById({
          user_id: dataUserById.user_id,
          entity_id: dataUserById.entity_id,
        })
      );
    }
  }, [dispatch, dataUserById, store_id]);

  const fetchInventoryData = async () => {
    if (!dataUserById?.entity_id || !store_id) return;

    try {
      setLoading(true);
      const searchParams = new URLSearchParams({
        entity_id: dataUserById.entity_id,
        warehouse_id: store_id,
        ...(filterDocument && { document_type: filterDocument }),
      });

      const response = await axios.get(
        `${BackendUrl}/api/warehouse/inventoryGetData?${searchParams.toString()}`,
        {
          headers: { authorization: token },
        }
      );
      setDataMaterials(response.data.response || []);
    } catch (error) {
      setDataMaterials([]);
      const errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء البحث";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchInventoryData, 300);
    return () => clearTimeout(timeoutId);
  }, [dataUserById, filterDocument, store_id, token]);

  useEffect(() => {
    const getDataStoreById = async () => {
      if (!store_id) return;

      try {
        const response = await axios.get(
          `${BackendUrl}/api/warehouse/getWarehouseDataById?store_id=${store_id}`,
          {
            headers: { Authorization: token },
          }
        );
        setDataStore_id(response?.data?.data || {});
      } catch (error) {
        console.error(
          "Error fetching store data:",
          error?.response?.data?.message
        );
      }
    };

    getDataStoreById();
  }, [store_id, token]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      document.body.classList.add("printing");
    },
    onAfterPrint: () => {
      document.body.classList.remove("printing");
    },
  });

  const handleRefresh = () => {
    fetchInventoryData();
  };

  return (
    <Box className="m-3">
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          startIcon={<LocalPrintshopOutlined />}
          sx={{
            minWidth: "150px",
            height: "40px",
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          طباعة الجرد
        </Button>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>نوع المستند</InputLabel>
            <Select
              value={filterDocument}
              onChange={(e) => setFilterDocument(e.target.value)}
              label="نوع المستند"
            >
              <MenuItem value="">الكل</MenuItem>
              {typeDocument?.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Button
          variant="outlined"
          onClick={handleRefresh}
          sx={{
            minWidth: "100px",
            height: "40px",
            marginLeft: "auto",
          }}
        >
          تحديث
        </Button>
      </Box>

      <Box
        sx={{
          padding: "16px",
          margin: "16px auto",
          maxWidth: "297mm",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          "@media print": {
            padding: "0",
            margin: "0",
            maxWidth: "none",
            boxShadow: "none",
            width: "100%",
            height: "100%"
          },
        }}
        ref={componentRef}
      >
        <Box
          className="d-flex justify-content-between align-items-center mb-4"
          dir="rtl"
          sx={{
            borderBottom: "2px solid #eee",
            paddingBottom: "16px",
            "@media print": {
              borderBottom: "2px solid #000",
            },
          }}
        >
          <Box>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <InfoRow label="الشركة" value={dataUserById?.Entities_name} />
              <InfoRow label="المصنع" value={dataUserLab?.Factories_name} />
              <InfoRow label="المعمل" value={dataUserLab?.Laboratory_name} />
              <InfoRow label="الخزن" value={dataStore_id?.name} />
            </ul>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                margin: 0,
                color: "#1976d2",
              }}
            >
              أستمارة نظام الموجودات المخزنية
            </Typography>
          </Box>
          <Box />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : dataMaterials.length === 0 ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography color="text.secondary">لا توجد بيانات متاحة</Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            dir="rtl"
            sx={{
              boxShadow: "none",
              border: "1px solid #eee",
              borderRadius: "4px",
              overflow: "hidden",
              maxHeight: "calc(100vh - 300px)",
              "@media print": {
                maxHeight: "none",
                border: "none",
                overflow: "visible",
                breakInside: "avoid",
                pageBreakInside: "avoid"
              },
            }}
          >
            <Table
              className="print-table"
              sx={{
                tableLayout: "fixed",
                width: "100%",
                minWidth: 650,
              }}
            >
              <TableHeader filterDocument={filterDocument} />
              <TableBody>
                {dataMaterials?.map((item, index) => (
                  <StyledTableRow
                    key={item?.id || index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      "@media print": {
                        backgroundColor: index % 2 === 0 ? "#f8f8f8" : "#fff",
                        "&:hover": {
                          backgroundColor: "inherit",
                        },
                      },
                    }}
                  >
                    <StyledTableCell
                      sx={{
                        ...tableCellStyles,
                      }}
                      align="right"
                      dir="rtl"
                    >
                      {item?.cod_material}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={tableCellStyles}
                      align="right"
                      dir="rtl"
                    >
                      {item?.name_of_material}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={tableCellStyles}
                      align="center"
                      dir="rtl"
                    >
                      {item?.measuring_unit}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={tableCellStyles}
                      align="right"
                      dir="rtl"
                    >
                      {item?.document_number}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {formatDateYearsMonth(item?.document_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {item?.document_type}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {item?.quantity_incoming_outgoing}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {item?.balance}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {item?.specification}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {formatDateYearsMonth(item?.production_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {formatDateYearsMonth(item?.expiration_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {item?.origin}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {formatDateYearsMonth(item?.purchase_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {item?.price}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {FormatDataNumber(
                        item?.price * item?.quantity_incoming_outgoing
                      )}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {item?.minimum_stock_level}
                    </StyledTableCell>
                    <StyledTableCell sx={tableCellStyles} align="center">
                      {item?.state_name}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 4mm;
            }
            html, body {
              height: 100%;
              width: 100%;
              margin: 0;
              padding: 0;
            }
            .print-table {
              width: 100% !important;
              border-collapse: collapse !important;
              font-size: 8px !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .print-table th,
            .print-table td {
              border: 1px solid #ddd !important;
              padding: 4px !important;
              color: #333 !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            }
            .header {
              background-color: #f5f5f5 !important;
              font-weight: bold !important;
              color: #333 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background-color: white !important;
            }
            body.printing * {
              color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }
            .MuiPaper-root {
              box-shadow: none !important;
            }
            .MuiTableContainer-root {
              max-height: none !important;
              overflow: visible !important;
              break-inside: auto !important;
              page-break-inside: auto !important;
            }
            .MuiTableRow-root {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }
            button, 
            .MuiFormControl-root,
            .MuiSelect-select {
              display: none !important;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default PrintInventory;
