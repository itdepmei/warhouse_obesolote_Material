import { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
  Typography,
  Tooltip,
  List,
  Divider,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import {
  AccountBox,
  Archive,
  Autorenew,
  Bookmarks,
  ChecklistRtl,
  ContentPasteOff,
  Dashboard,
  EventAvailable,
  Grading,
  GroupAdd,
  Home,
  Info,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ManageAccounts,
  NotificationAdd,
  Refresh,
  Rule,
  Settings,
  Streetview,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { setLanguage } from "../redux/LanguageState";
import { useTranslation } from "react-i18next";
import { getRoleAndUserId } from "../redux/RoleSlice/rolAction";
import { hasPermission } from "../utils/Function";
import { getToken } from "utils/handelCookie";
import { getDataUserById, logoutUser } from "../redux/userSlice/authActions";
const drawerWidth = 300;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const SideBar = ({ open, handleDrawerClose }) => {
  const { dataUserById } = useSelector((state) => {
    return state?.user;
  });
  const [info, setInfo] = useState(() =>
    JSON.parse(localStorage?.getItem("user"))
  );
  const { rtl } = useSelector((state) => state?.language);
  const { Permission, roles } = useSelector((state) => state?.RolesData);
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [permissionData, setPermissionData] = useState([]);
  const location = useLocation(); // Use location hook to get the current pathname
  const { t } = useTranslation();
  const token = getToken();
  useEffect(() => {
    dispatch(setLanguage());
    dispatch(getDataUserById(token));
  }, [dispatch, token]);
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
    const userId = dataUserById?.user_id;
    if (userId) {
      dispatch(getRoleAndUserId({ token, userId }));
    }
  }, [location, dispatch, dataUserById?.user_id, token]);
  const [openPage, setOpenPage] = useState(false);
  const Route1 = [
    {
      text: t("layout.nationalBank"),
      icon: <Home />,
      path: "/",
      checkPermission: roles?.Show_obSolete?._id,
    },
    {
      text: t("layout.Main class"),
      icon: <Streetview />,
      path: "/All-Category", // Fixed path to include a leading slash
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
      path: "/help-platform", // Fixed path to include a leading slash
      checkPermission: roles?.show_profile?._id,
    },
  ];

  return (
    <Drawer variant="permanent" open={open} anchor={rtl?.anchor}>
      <DrawerHeader>
        <IconButton
          sx={{
            color: "#1e6a99",
            cursor: "pointer",
            backgroundColor: "#ebebeba0",
            borderRadius: "50%",
            border: "1px solid #1e6a99",
          }}
          onClick={handleDrawerClose}
        >
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <div className="right-section pt-3">
          <div className="logo-circle">
            <div className="">
              <div
                className="circleLogo yellow mb-2 "
                style={{
                  // mx: "auto",
                  width: open ? 44 : 22,
                  height: open ? 44 : 22,
                  transition: "0.25s",
                }}
              ></div>
              <div
                className="circleLogo light-purple"
                style={{
                  // mx: "auto",
                  width: open ? 44 : 22,
                  height: open ? 44 : 22,
                  transition: "0.25s",
                }}
              ></div>
            </div>
            <div className="">
              <div
                className="circleLogo purple mb-2"
                style={{
                  // mx: "auto",
                  width: open ? 44 : 22,
                  height: open ? 44 : 22,
                  transition: "0.25s",
                }}
              ></div>
              <div
                className="circleLogo light-yellow"
                style={{
                  // mx: "auto",
                  width: open ? 44 : 22,
                  height: open ? 44 : 22,
                  transition: "0.25s",
                }}
              ></div>
            </div>
          </div>
        </div>
        {open && (
          <Typography sx={{ textAlign: "center", mb: "10px" }}>
            {rtl?.dir === "ltr" ? (
              <>
                The <span style={{ color: "orange" }}>National</span> Bank{" "}
                <br /> for Obsolete and Slow-Moving Materials
              </>
            ) : (
              <>
                البنك <span style={{ color: "orange" }}>الوطني</span> <br />{" "}
                للمواد الراكدة وبطيئة الحركة
              </>
            )}
          </Typography>
        )}
      </Box>
      <Typography
        align="center"
        sx={{ fontSize: open ? 17 : 0, transition: "0.25s" }}
      >
        {dataUserById?.user_name}
      </Typography>
      <Divider />
      <List dir={rtl.dir}>
        {Route1?.map((item) => {
          const hasAccess = hasPermission(
            item?.checkPermission,
            permissionData
          );
          return (
            hasAccess && (
              <ListItem
                key={item.path}
                disablePadding
                sx={{ display: "block" }}
                dir={rtl.dir}
              >
                <Tooltip title={open ? null : item?.text} placement="left">
                  <ListItemButton
                    onClick={() => navigate(item?.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      dir: rtl?.dir,
                      marginLeft: "10px",
                      marginRight: "10px",
                      borderRadius: "5px",
                      bgcolor:
                        location.pathname === `/${item.path}` ||
                        location.pathname === item.path
                          ? theme.palette.mode === "dark"
                            ? grey[800] // Active state for dark mode
                            : grey[300] // Active state for light mode
                          : null,
                      "&:hover": {
                        bgcolor:
                          location.pathname === `${item.path}` ||
                          location.pathname === item.path
                            ? theme.palette.mode === "dark"
                              ? grey[700] // Hover state when active in dark mode
                              : grey[400] // Hover state when active in light mode
                            : theme.palette.action.hover, // Default hover state
                      },
                      "&.Mui-selected": {
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? grey[800] // Active state for dark mode
                            : grey[300], // Active state for light mode
                        "&:hover": {
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? grey[700] // Hover state when active in dark mode
                              : grey[400], // Hover state when active in light mode
                        },
                      },
                    }}
                    selected={location.pathname === `${item.path}`} // Active state condition
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        textAlign: "center",
                        fontSize: "20px",
                        color:
                          theme.palette.mode === "dark"
                            ? ""
                            : maintheme?.mainColor,
                        // border: `1px solid ${maintheme?.mainColor}`,
                      }}
                    >
                      {item?.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: open ? 1 : 0,
                        textAlign: rtl.dir === "rtl" ? "start" : "",
                        marginRight: rtl.dir === "rtl" ? "10px" : "",
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          );
        })}
      </List>
      <Divider />
      {permissionData?.length <= 0 && (
          <List dir={rtl.dir}>
            <ListItem disablePadding sx={{ display: "block" }} dir={rtl.dir}>
              <Tooltip
                title={open ? null : "أعادة تنشيط المنصة"}
                placement="left"
              >
                <ListItemButton
                  onClick={() => navigate("refresh-token")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    dir: rtl?.dir,
                    borderRadius: "5px",
                    bgcolor:
                      location.pathname === `/refresh-token` ||
                      location.pathname === "refresh-token"
                        ? theme.palette.mode === "dark"
                          ? grey[800] // Active state for dark mode
                          : grey[300] // Active state for light mode
                        : null,
                    "&:hover": {
                      bgcolor:
                        location.pathname === `refresh-token` ||
                        location.pathname === "refresh-token"
                          ? theme.palette.mode === "dark"
                            ? grey[700] // Hover state when active in dark mode
                            : grey[400] // Hover state when active in light mode
                          : theme.palette.action.hover, // Default hover state
                    },
                    "&.Mui-selected": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? grey[800] // Active state for dark mode
                          : grey[300], // Active state for light mode
                      "&:hover": {
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? grey[700] // Hover state when active in dark mode
                            : grey[400], // Hover state when active in light mode
                      },
                    },
                  }}
                  selected={location.pathname === `refresh-token`} // Active state condition
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      textAlign: "center",
                      fontSize: "20px",
                      color:
                        theme.palette.mode === "dark"
                          ? ""
                          : maintheme?.mainColor,
                    }}
                  >
                    <Autorenew />
                  </ListItemIcon>
                  <ListItemText
                    primary={"أعادة تنشيط الصفحة"}
                    sx={{
                      opacity: open ? 1 : 0,
                      textAlign: rtl.dir === "rtl" ? "start" : "",
                      marginRight: rtl.dir === "rtl" ? "10px" : "",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>
      )}
      <List dir={rtl?.dir}>
        <ListItem disablePadding sx={{ display: "block" }} dir={rtl.dir}>
          <Tooltip title={open ? null : `${t("More")}`} placement="left">
            <ListItemButton
              onClick={() => {
                setOpenPage((prv) => !prv); // Toggle the openPage state
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                marginLeft: "10px",
                marginRight: "10px",
                borderRadius: "5px",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: open ? "center" : "center",
                }}
              >
                {openPage ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </ListItemIcon>
              <ListItemText
                primary={t("More")}
                sx={{
                  opacity: open ? 1 : 0,
                  textAlign: rtl?.dir === "rtl" ? "start" : "",
                  marginRight: rtl?.dir === "rtl" ? "10px" : "",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
        {openPage && (
          <>
            {Route2?.map((item) => {
              const hasAccess = hasPermission(
                item?.checkPermission,
                permissionData
              );
              return (
                hasAccess && (
                  <ListItem
                    disablePadding
                    key={item.path}
                    sx={{ display: "block" }}
                    dir={rtl?.dir}
                  >
                    <Tooltip title={open ? null : item?.text} placement="left">
                      <ListItemButton
                        onClick={() => {
                          // Navigate to the item's path
                          navigate(item?.path);
                          // setOpenPage(false); // Close the menu after clicking an item
                        }}
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                          dir: rtl?.dir,
                          marginLeft: "10px",
                          marginRight: "10px",
                          borderRadius: "5px",
                          bgcolor:
                            location.pathname === `/${item.path}` ||
                            location.pathname === item.path
                              ? theme.palette.mode === "dark"
                                ? grey[800] // Active state for dark mode
                                : grey[300] // Active state for light mode
                              : null,
                          "&:hover": {
                            bgcolor:
                              location.pathname === `${item.path}` ||
                              location.pathname === item.path
                                ? theme.palette.mode === "dark"
                                  ? grey[700] // Hover state when active in dark mode
                                  : grey[400] // Hover state when active in light mode
                                : theme.palette.action.hover, // Default hover state
                          },
                          "&.Mui-selected": {
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? grey[800] // Active state for dark mode
                                : grey[300], // Active state for light mode
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? grey[700] // Hover state when active in dark mode
                                  : grey[400], // Hover state when active in light mode
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            fontSize: "20px",
                            color:
                              theme.palette.mode === "dark"
                                ? ""
                                : maintheme?.mainColor,
                          }}
                        >
                          {item?.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            opacity: open ? 1 : 0,
                            textAlign: rtl.dir === "rtl" ? "start" : "",
                            marginRight: rtl.dir === "rtl" ? "10px" : "",
                          }}
                        />
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                )
              );
            })}
          </>
        )}
      </List>
      <Button
        sx={{
          mb: "10px",
          marginLeft: "10px",
          marginRight: "10px",
          backgroundColor: "#E1342A",
          color: "white",
        }}
        onClick={() => {
          const userId = info?.user_id;
          dispatch(logoutUser(userId));
        }}
      >
        <ExitToAppIcon />
      </Button>
    </Drawer>
  );
};

export default SideBar;
