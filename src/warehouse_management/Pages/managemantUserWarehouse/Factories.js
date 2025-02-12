import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import { DeleteOutlined, Refresh } from "@mui/icons-material";
import GridTemplate from "../../../components/GridTemplet";
import {
  DeleteItem,
  formatDateYearsMonth,
  renderMenuItem,
} from "../../../utils/Function";
import DropDownGrid from "../../../components/CustomMennu";
import AddFactoriesForm from "./addFactoiesForm";
import Header from "../../../components/HeaderComponent";
import RefreshButtonData from "../../../components/RefreshButton";
const Factories = ({
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
  factoryData,
  permissionData,
  roles,
  hasPermission,
  ...props
}) => {
  const columns = [
    { field: "id", headerName: "ID", hideable: false, width: 70 },
    {
      field: "index",
      headerName: "#",
      width: 33,
      renderCell: (params) => params.index,
    },
    {
      field: "Factories_name",
      headerName: t("أسم المصنع"),
      flex: 1,
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "user_name",
      headerName: t(" مدير المصنع"),
      flex: 1,
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
      field: "status",
      headerName: t("الحالة"),
      flex: 1.5,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor:
              params?.row?.status === "نشط"
                ? theme.palette.success.light
                : params?.row?.status === "تحت الصيانة"
                ? theme.palette.warning.light
                : theme.palette.error.light,
            color:
              params?.row?.status === "نشط"
                ? theme.palette.success.dark
                : params?.row?.status === "تحت الصيانة"
                ? theme.palette.warning.dark
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
      renderCell: (params) =>
        hasPermission(roles.add_factory._id, permissionData) && (
          <DropDownGrid>
            {renderMenuItem(
              "delete",
              () =>
                DeleteItem(
                  params?.row?.id,
                  setDelete,
                  setAnchorEl,
                  token,
                  "deleteFactoriesById"
                ),
              DeleteOutlined,
              "حذف"
            )}
            <Divider sx={{ my: 0.5 }} />
            <AddFactoriesForm
              editMode={true}
              dataUserById={dataUserById}
              token={token}
              setRefreshButton={setRefreshKey}
              refreshButton={refreshKey}
              wareHouseData={wareHouseData}
              factoryData={params?.row}
              dataUser={dataUser}
            />
          </DropDownGrid>
        ),
    },
  ];

  const rows = factoryData?.map((item, index) => ({
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
          {hasPermission(roles?.add_factory?._id, permissionData) && (
            <AddFactoriesForm
              editMode={false}
              dataUserById={dataUserById}
              token={token}
              setRefreshButton={setRefreshKey}
              refreshButton={refreshKey}
              wareHouseData={wareHouseData}
              dataUser={dataUser}
            />
          )}
          <RefreshButtonData
            refreshButton={refreshKey}
            setRefreshButton={setRefreshKey}
          />
        </Box>
        <Header title={t("أضافة المصانع")} typeHeader={"h5"} />
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

export default Factories;
