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
import {
  Autorenew,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { setLanguage } from "../../redux/LanguageState";
import { useTranslation } from "react-i18next";
import { getRoleAndUserId } from "../../redux/RoleSlice/rolAction";
import { hasPermission } from "../../utils/Function";
import { getToken } from "utils/handelCookie";
import { getDataUserById, logoutUser } from "../../redux/userSlice/authActions";
import { Drawer, DrawerHeader } from "../../utils/drawerFuction";

const SideBar = ({ open, handleDrawerClose, Route1, Route2, logo }) => {
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
  return (
    <Drawer
      variant="permanent"
      open={open}
      anchor={rtl?.anchor}
      sx={{
        "& .MuiDrawer-paper": {
          background: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
        },
      }}
    >
      <DrawerHeader
        sx={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: rtl?.dir === "rtl" ? "flex-start" : "flex-end",
        }}
      >
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            color: theme.palette.primary.main,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.04)",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 8px",
          gap: 1,
        }}
      >
        <div className="logo-container" style={{ position: "relative" }}>
          {!logo ? (
            <div
              className="logo-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
                transition: "transform 0.3s ease",
              }}
            >
              {["yellow", "light-purple", "purple", "light-yellow"].map(
                (color, index) => (
                  <div
                    key={color}
                    className={`circleLogo ${color}`}
                    style={{
                      width: open ? "36px" : "20px",
                      height: open ? "36px" : "20px",
                      transition: "all 0.3s ease",
                      transform: `scale(${open ? 1 : 0.8})`,
                      opacity: open ? 1 : 0.7,
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <div>
              <img
                loading="lazy"
                src={logo}
                alt="Logo"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}
        </div>
        {open && (
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: "0.9rem",
              lineHeight: 1.4,
              opacity: open ? 1 : 0,
              transition: "opacity 0.3s ease",
              mt: 1,
            }}
          >
            {rtl?.dir === "ltr" ? (
              <>
                The{" "}
                <span style={{ color: theme.palette.warning.main }}>
                  National
                </span>{" "}
                Bank
                <br /> for Obsolete and Slow-Moving Materials
              </>
            ) : (
              <>
                البنك{" "}
                <span style={{ color: theme.palette.warning.main }}>
                  الوطني
                </span>
                <br /> للمواد الراكدة وبطيئة الحركة
              </>
            )}
          </Typography>
        )}
      </Box>

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          fontSize: open ? "0.9rem" : 0,
          opacity: open ? 0.9 : 0,
          transition: "all 0.3s ease",
          color: theme.palette.text.secondary,
          mb: 2,
        }}
      >
        {dataUserById?.user_name}
      </Typography>

      <Divider sx={{ mb: 1 }} />

      <List
        dir={rtl.dir}
        sx={{
          px: 1,
          "& .MuiListItem-root": {
            mb: 0.5,
          },
        }}
      >
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
              >
                <Tooltip
                  title={open ? null : item?.text}
                  placement={rtl?.dir === "rtl" ? "left" : "right"}
                >
                  <ListItemButton
                    onClick={() => navigate(item?.path)}
                    selected={location.pathname === `${item.path}`}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      borderRadius: "10px",
                      px: 2,
                      backgroundColor:
                        location.pathname === `/${item.path}` ||
                        location.pathname === item.path
                          ? theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)"
                          : "transparent",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "rgba(0, 0, 0, 0.08)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        color: theme.palette.primary.main,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {item?.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        "& .MuiTypography-root": {
                          fontSize: "0.9rem",
                          fontWeight:
                            location.pathname === `${item.path}` ? 500 : 400,
                        },
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
                      theme.palette.mode === "dark" ? "" : maintheme?.mainColor,
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
                          borderRadius: "10px",
                          px: 2,
                          backgroundColor:
                            location.pathname === `/${item.path}` ||
                            location.pathname === item.path
                              ? theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.08)"
                                : "rgba(0, 0, 0, 0.04)"
                              : "transparent",
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(0, 0, 0, 0.08)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        // sx={{
                        //   minHeight: 48,
                        //   justifyContent: open ? "initial" : "center",
                        //   px: 2.5,
                        //   dir: rtl?.dir,
                        //   marginLeft: "10px",
                        //   marginRight: "10px",
                        //   borderRadius: "5px",
                        //   bgcolor:
                        //     location.pathname === `/${item.path}` ||
                        //     location.pathname === item.path
                        //       ? theme.palette.mode === "dark"
                        //         ? grey[800] // Active state for dark mode
                        //         : grey[300] // Active state for light mode
                        //       : null,
                        //   "&:hover": {
                        //     bgcolor:
                        //       location.pathname === `${item.path}` ||
                        //       location.pathname === item.path
                        //         ? theme.palette.mode === "dark"
                        //           ? grey[700] // Hover state when active in dark mode
                        //           : grey[400] // Hover state when active in light mode
                        //         : theme.palette.action.hover, // Default hover state
                        //   },
                        //   "&.Mui-selected": {
                        //     bgcolor:
                        //       theme.palette.mode === "dark"
                        //         ? grey[800] // Active state for dark mode
                        //         : grey[300], // Active state for light mode
                        //     "&:hover": {
                        //       bgcolor:
                        //         theme.palette.mode === "dark"
                        //           ? grey[700] // Hover state when active in dark mode
                        //           : grey[400], // Hover state when active in light mode
                        //     },
                        //   },
                        // }}
                      >
                        <ListItemIcon
                          sx={{
                            mr: open ? 2 : "auto",
                            color: theme.palette.primary.main,
                            transition: "all 0.2s ease",
                            minWidth: 0,
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
      <Box
        sx={{
          mt: "auto",
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          color="error"
          startIcon={<ExitToAppIcon />}
          onClick={() => {
            const userId = info?.user_id;
            dispatch(logoutUser(userId));
          }}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            py: 1,
          }}
        >
          {open && t("تسجيل الخروج")}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ExitToAppIcon />}
          onClick={() => navigate("/")}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            py: 1,
          }}
        >
          {open && t("الصفحة الرئيسية")}
        </Button>
      </Box>
    </Drawer>
  );
};
export default SideBar;
