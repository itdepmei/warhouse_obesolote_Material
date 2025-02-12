import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
} from "@mui/material";
import { DeleteOutlined, Monitor } from "@mui/icons-material";
import GridTemplate from "../../../components/GridTemplet";
import {
  DeleteItem,
  formatDateYearsMonth,
  renderMenuItem,
} from "../../../utils/Function";
import DropDownGrid from "../../../components/CustomMennu";
import AddLabForm from "./addLabForm";
import Header from "../../../components/HeaderComponent";
import { useNavigate } from "react-router-dom";
import RefreshButtonData from "../../../components/RefreshButton";
const LabsEntity = ({
  dataUserById,
  wareHouseData,
  dataUser,
  token,
  rtl,
  theme,
  t,
  loading,
  setLoading,
  refreshKey,
  setRefreshKey,
  totalItems,
  totalPages,
  limit,
  page,
  setPage,
  deleteItem,
  setDelete,
  anchorEl,
  setAnchorEl,
  setLimit,
  setTotalItems,
  setTotalPages,
  factoryData,
  labData,
  dataUserFactor,
  factory_id,
  ...props
}) => {
  const navigate = useNavigate();
  const columns = [
    { field: "id", headerName: "ID", hideable: false, width: 70 },
    {
      field: "index",
      headerName: "#",
      width: 33,
      renderCell: (params) => params?.index,
    },
    {
      field: "Laboratory_name",
      headerName: t("أسم المعمل"),
      flex: 1,
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "user_name",
      headerName: t("مدير المخزن"),
      flex: 1,
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "specialization",
      headerName: t("التخصص "),
      flex: 1.5,
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "location",
      headerName: t("الموقع"),
      flex: 1.5,
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "factories",
      headerName: t("الحالة"),
      flex: 1.5,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor:
              params?.row?.status === "نشط"
                ? theme.palette.success.light
                : theme.palette.error.light,
            color:
              params?.row?.status === "نشط"
                ? theme.palette.success.dark
                : theme.palette.error.dark,
            padding: "4px 8px",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          {t(params?.row?.status)}
        </Box>
      ),
    },
    {
      field: "warehouse_count",
      headerName: t("عدد المخازن المتوفرة"),
      flex: 1.5,
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "created_at",
      headerName: t("تاريخ الادخال"),
      flex: 1,
      renderCell: (params) => (
        <p>{formatDateYearsMonth(params.row.created_at)}</p>
      ),
    },
    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => (
        <DropDownGrid>
          {renderMenuItem(
            "delete",
            () =>
              DeleteItem(
                params?.row?.id,
                setDelete,
                setAnchorEl,
                token,
                "deleteLaboratoriesById"
              ),
            DeleteOutlined,
            "حذف"
          )}
          <Divider sx={{ my: 0.5 }} />
          <AddLabForm
            editMode={true}
            factoryData={factoryData}
            labData={params?.row}
            dataUser={dataUser}
            wareHouseData={wareHouseData}
            dataUserFactor={dataUserFactor}
            setRefreshButton={setRefreshKey}
          />
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => {
              navigate(
                `follow-up-labs?lab_id=${params?.row?.id}&factory_id=${factory_id}`
              );
            }}
          >
            <Monitor /> الاطلاع على المخازن
          </MenuItem>
        </DropDownGrid>
      ),
    },
  ];
  const rows = labData?.map((item, index) => ({
    index: index + 1,
    ...item,
  }));
  return (
    <Box dir="rtl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 0, display: "flex", alignItems: "center", gap: 1 }}>
          <AddLabForm
            editMode={false}
            factoryData={factoryData}
            labData={labData}
            dataUserById={dataUserById}
            refreshKey={refreshKey}
            setRefreshButton={setRefreshKey}
            dataUser={dataUser}
            dataUserFactor={dataUserFactor}
          />
          <RefreshButtonData
            refreshButton={refreshKey}
            setRefreshButton={setRefreshKey}
          />
        </Box>
        <Header title={t("أضافة المعامل")} typeHeader={"h5"} />
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box dir={rtl?.dir} sx={{ minWidth: "999px" }}>
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
      )}
    </Box>
  );
};

export default LabsEntity;
