import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { getDesignTokens } from "../../components/Layout/Thime";
import CookieStatus from "middleware/cookies";
import {
  AccountBox,
  EventAvailable,
  EventAvailableTwoTone,
  Home,
  Leaderboard,
  LocalShipping,
  ManageAccounts,
  NotificationAdd,
  Settings,
  Warehouse,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import React from "react";
import Root from "../../components/Layout/Root";
import logo from "../../assets/image/1671635909.png";
export default function RootWarehouse() {
  const { roles } = useSelector((state) => state?.RolesData);
  const { t } = useTranslation();
  const Route1 = [
    {
      text: t(" الصفحة الرئيسية"),
      icon: <Home sx={{ transition: "transform 0.2s" }} />,
      path: "warehouse-home",
      checkPermission: roles?.show_main_page?._id,
    },
    {
      text: t("التقارير"),
      icon: <Leaderboard sx={{ transition: "transform 0.2s" }} />,
      path: "Warehouse-Report",
      checkPermission: roles?.general_reports?._id,
    },

    {
      text: t("المخازن"),
      icon: <Warehouse sx={{ transition: "transform 0.2s" }} />,
      path: "warehouse-store",
      checkPermission: roles?.warehouse_page?._id,
    },
  ];
  const Route2 = [
    {
      text: t("الشحنات"),
      icon: <LocalShipping sx={{ transition: "transform 0.2s" }} />,
      path: "Shipments",
      checkPermission: roles?.show_all_data_shipment?._id,
    },
    {
      text: t("layout.Notification"),
      icon: <NotificationAdd />,
      path: "Notification", // Fixed path to include a leading slash
      checkPermission: roles?.management_Nonfiction?._id,
    },
    {
      text: t("اعدادات المخزن العامة"),
      icon: <Settings sx={{ transition: "transform 0.2s" }} />,
      path: "general-Setting",
      checkPermission: roles?.store_general_setting?._id,
    },
    {
      text: t("layout.MangePermission"),
      icon: <ManageAccounts sx={{ transition: "transform 0.2s" }} />,
      path: "UserManagementFromEntities",
      checkPermission: roles?.management_user_from_entity?._id,
    },

    {
      text: t("layout.companyInformation"),
      icon: <AccountBox sx={{ transition: "transform 0.2s" }} />,
      path: "profile",
      checkPermission: roles?.show_profile?._id,
    },
    {
      text: t("layout.log"),
      icon: <EventAvailableTwoTone sx={{ transition: "transform 0.2s" }} />,
      path: "AllLog",
      checkPermission: roles?.show_log?._id,
    },
    {
      text: t("layout.logEntity"),
      icon: <EventAvailable sx={{ transition: "transform 0.2s" }} />,
      path: "logEntity",
      checkPermission: roles?.show_log_entity?._id,
    },
  ];
  const [mode, setMode] = React.useState(
    Boolean(localStorage.getItem("currentMode"))
      ? localStorage.getItem("currentMode")
      : "light"
  );
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
      <Root Route2={Route2} Route1={Route1} logo={logo} />
  );
}
