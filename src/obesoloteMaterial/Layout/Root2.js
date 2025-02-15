import { ThemeProvider, createTheme} from "@mui/material/styles";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { getDesignTokens } from "../../components/Layout/Thime";
import CookieStatus from "middleware/cookies";
import Root from "../../components/Layout/Root";
import {
  AccountBox,
  Archive,
  Bookmarks,
  ChecklistRtl,
  ContentPasteOff,
  Dashboard,
  EventAvailable,
  Grading,
  GroupAdd,
  Home,
  Info,
  ManageAccounts,
  NotificationAdd,
  Rule,
  Settings,
  Streetview,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import React from "react";
export default function Root2() {
  const { roles } = useSelector((state) => state?.RolesData);
  const { t } = useTranslation();
  const Route1 = [
    {
      text: t("layout.nationalBank"),
      icon: <Home />,
      path: "stagnant-materials_home",
      checkPermission: roles?.Show_obSolete?._id,
    },
    {
      text: t("layout.Main class"),
      icon: <Streetview />,
      path: "All-Category", // Fixed path to include a leading slash
      checkPermission: roles?.Show_obSolete?._id,
    },
    {
      text: t("layout.Statistics"),
      icon: <Dashboard />,
      path: "Dashboard",
      checkPermission: roles?.show_statistics?._id,
    },
    {
      text: t("layout.StatisticsEntity"),
      icon: <Dashboard />,
      path: "dashboard-Entity",
      checkPermission: roles?.show_statistics_entity?._id,
    },
    {
      text: t("layout.MangeUser"),
      icon: <GroupAdd />,
      path: "UserManagementAllUsers", // Fixed path to include a leading slash
      checkPermission: roles?.Add_Data_Users?._id,
    },
    {
      text: t("layout.MangePermission"),
      icon: <ManageAccounts />,
      path: "UserManagementFromEntities", // Fixed path to include a leading slash
      checkPermission: roles?.management_user_from_entity?._id,
    },
    {
      text: t("layout.formObsoleteMartial"),
      icon: <ContentPasteOff />,
      path: "ListOfObsoleteItems", // Fixed path to include a leading slash
      checkPermission: roles?.view_data_obsolete?._id,
    },
    {
      text: t("layout.Authorized approval"),
      icon: <Grading />,
      path: "Obsolete-Material-Approve-Admin", // Fixed path to include a leading slash
      checkPermission: roles?.approve_admin_to_request?._id,
    },
    {
      text: t("layout.System Administrators Approval"),
      icon: <Grading />,
      path: "Obsolete-Material-Approve-Super-Admin", // Fixed path to include a leading slash
      checkPermission: roles?.approve_Super_admin_root_to_request?._id,
    },
    {
      text: t("layout.Booking requests"),
      icon: <Rule />,
      path: "Approval-reservations", // Fixed path to include a leading slash
      checkPermission: roles?.Booking_requests?._id,
    },
    {
      text: t("layout.Order management"),
      icon: <Bookmarks />,
      path: "BookObsoleteMaterial", // Fixed path to include a leading slash
      checkPermission: roles?.management_order_entity?._id,
    },
  ];
  const Route2 = [
    {
      text: t("layout.Notification"),
      icon: <NotificationAdd />,
      path: "Notification", // Fixed path to include a leading slash
      checkPermission: roles?.management_Nonfiction?._id,
    },
    {
      text: t("layout.Manage sent reservation requests"),
      icon: <ChecklistRtl />,
      path: "approve-Admin-To-send-Request-Booking", // Fixed path to include a leading slash
      checkPermission: roles?.Booking_requests?._id,
    },
    {
      text: t("layout.BasicInformation"),
      icon: <Settings />,
      path: "MainInformation", // Fixed path to include a leading slash
      checkPermission: roles?.setting_information?._id,
    },
    {
      text: t("layout.companyInformation"),
      icon: <AccountBox />,
      path: "profile", // Fixed path to include a leading slash
      checkPermission: roles?.show_profile?._id,
    },
    {
      text: t("layout.material movement"),
      icon: <Archive />,
      path: "archive", // Fixed path to include a leading slash
      checkPermission: roles?.show_archive?._id,
    },
    {
      text: t("layout.log"),
      icon: <EventAvailable />,
      path: "AllLog", // Fixed path to include a leading slash
      checkPermission: roles?.show_log?._id,
    },
    {
      text: t("layout.logEntity"),
      icon: <EventAvailable />,
      path: "logEntity", // Fixed path to include a leading slash
      checkPermission: roles?.show_log_entity?._id,
    },
    {
      text: t("layout.User Manual"),
      icon: <Info />,
      path: "help-platform", // Fixed path to include a leading slash
      checkPermission: roles?.show_profile?._id,
    },
  ];
  const [mode, setMode] = React.useState(
    Boolean(localStorage.getItem("currentMode"))
      ? localStorage.getItem("currentMode")
      : "light"
  );
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CookieStatus />
      <Root Route2={Route2} Route1={Route1} />
    </ThemeProvider>
  );
}
