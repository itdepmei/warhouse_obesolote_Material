import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  styled,
  useTheme,
  Button,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import LoginIcon from "@mui/icons-material/Login";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../utils/handelCookie";
import OtherApplication from "./Appliction";
import { getDataUserById } from "../redux/userSlice/authActions";
import { setLanguage } from "../redux/LanguageState";
import DrobMenueAuth from "../components/Layout/DrobMenueAuth";
import LisItem from "../components/Layout/LisItem";
const drawerWidth = 300;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, rtl, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(18, 18, 18, 0.9)"
      : "rgba(255, 255, 255, 0.9)",
  color: theme.palette.mode === "dark" ? "#fff" : "#121212",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 2px 8px rgba(0,0,0,0.15)"
      : "0 2px 8px rgba(0,0,0,0.1)",
  backdropFilter: "blur(8px)",
  transition: theme.transitions.create(
    ["width", "margin", "background-color"],
    {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }
  ),
  ...(open && {
    marginLeft: rtl?.flexDirection === "row" ? drawerWidth : null,
    marginRight: rtl?.flexDirection === "row-reverse" ? drawerWidth : null,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0, 3),
  },
  minHeight: 64,
}));

const AppbarHeader = ({ open, handleDrawerOpen, setMode }) => {
  const { rtl } = useSelector((state) => {
    // @ts-ignore
    return state.language;
  });
  const { dataUserById } = useSelector((state) => {
    return state?.user;
  });
  let token = getToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  // Dispatch actions on component mount
  useEffect(() => {
    dispatch(getDataUserById(token));
    dispatch(setLanguage());
  }, [dispatch, token, location]);
  return (
    <AppBar position="fixed" open={open} rtl={rtl}>
      <StyledToolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: "20px",
              fontWeight: 500,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              color: "inherit",
              transition: "opacity 0.2s",
              "&:hover": {
                opacity: 0.8,
              },
              "@media (max-width: 600px)": {
                fontSize: "16px",
              },
            }}
          >
            {t("appBar.userName", { name: dataUserById?.Entities_name })}
          </Typography>
        </Box>
        {
          !token && <LisItem rtl={rtl} navigate={navigate} />
        }
        <Stack direction="row" spacing={2} alignItems="center">
          {!token ? (
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
                transition: "all 0.2s",
              }}
            >
              {t("تسجيل الدخول")}
            </Button>
          ) : (
            <>
              <IconButton
                color="inherit"
                onClick={() => {
                  localStorage.setItem(
                    "currentMode",
                    theme.palette.mode === "dark" ? "light" : "dark"
                  );
                  setMode((prevMode) =>
                    prevMode === "light" ? "dark" : "light"
                  );
                }}
                sx={{
                  color: "inherit",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.04)",
                  },
                }}
              ></IconButton>
              <DrobMenueAuth dispatch={dispatch} navigate={navigate} />
              <OtherApplication navigate={navigate} />
            </>
          )}
        </Stack>
      </StyledToolbar>
    </AppBar>
  );
};

export default AppbarHeader;
