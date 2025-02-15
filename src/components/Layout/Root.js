import { Box } from "@mui/material";
import ResponsiveAppBar from "../Layout/AppBar";
import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState } from "react";
import { setLanguage } from "../../redux/LanguageState";
import { useDispatch, useSelector } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../Layout/SlidBar";
import { getDesignTokens } from "../Layout/Thime";
import { getToken } from "utils/handelCookie";
import CookieStatus from "middleware/cookies";
import axios from "axios";
import { BackendUrl } from "../../redux/api/axios";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
export default function Root({ Route1, Route2, logo }) {
  const token = getToken();
  const dispatch = useDispatch();
  const { rtl } = useSelector((state) => {
    // @ts-ignore
    return state.language;
  });

  // const [open, setOpen] = React.useState(token ? true : false);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationPermission, setApplicationPermission] = useState([]);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [mode, setMode] = React.useState(
    Boolean(localStorage.getItem("currentMode"))
      ? localStorage.getItem("currentMode")
      : "light"
  );
  const fetchDataApplicationPermission = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BackendUrl}/api/getApplicationPermissionById`,
        { headers: { authorization: token } }
      );
      setApplicationPermission(response?.data?.response || []);
    } catch (error) {
      console.error("Failed to fetch booked data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  React.useEffect(() => {
    fetchDataApplicationPermission();
    dispatch(setLanguage());
  }, [dispatch, token]);
  return (
    <ThemeProvider theme={theme}>
      <CookieStatus />
      <Box sx={{ display: "flex", flexDirection: rtl?.flexDirection }}>
        <CssBaseline />
        <ResponsiveAppBar
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          setMode={setMode}
        />
        {token && (
          <SideBar
            open={open}
            handleDrawerClose={handleDrawerClose}
            Route1={Route1}
            Route2={Route2}
            logo={logo}
          />
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: "100%",
            overflowX: rtl.dir === "rtl" ? "auto" : "hidden", // Adjust overflowX based on token and rtl.dir
          }}
        >
          <DrawerHeader
          // @ts-ignore
          />
          <Outlet />
        </Box>
        <ToastContainer
          // containerId="container_toast_id"
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          transition={Slide}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Box>
    </ThemeProvider>
  );
}
