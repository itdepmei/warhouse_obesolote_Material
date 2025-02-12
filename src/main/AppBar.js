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
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoleAndUserId } from "../redux/RoleSlice/rolAction";
import { GridMenuIcon } from "@mui/x-data-grid";
import { getToken } from "../utils/handelCookie";
import { toast } from "react-toastify";
import Pusher from "pusher-js";
// import AccountMenu from "./BookedData/DropDownMenu";
import OtherApplication from "./Appliction";
import { getDataUserById } from "../redux/userSlice/authActions";
import { setLanguage } from "../redux/LanguageState";
import DropDownMenu from "./DrobMenue";
const drawerWidth = 300;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, rtl, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(18, 18, 18, 0.9)' 
    : 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.mode === 'dark' ? '#fff' : '#121212',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 2px 8px rgba(0,0,0,0.15)' 
    : '0 2px 8px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(8px)',
  transition: theme.transitions.create(["width", "margin", "background-color"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
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
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('sm')]: {
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
  const { Permission } = useSelector((state) => state?.RolesData);
  
  let token = getToken();
  
  const [permissionData, setPermissionData] = useState([]);
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const [votes, setVotes] = useState(0);
  const location = useLocation();
  // Dispatch actions on component mount
  useEffect(() => {
    dispatch(getDataUserById(token));
    dispatch(getRoleAndUserId(token));
    dispatch(setLanguage());
  }, [dispatch, token, location]);

  // Browser notification helper
  const showNotification = (title, body) => {
    if ("Notification" in window) {
      if (Notification?.permission === "granted") {
        new Notification(title, { body });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, { body });
          }
        });
      }
    } else {
      console.warn("This browser does not support notifications.");
    }
  };

  // Subscribe to Pusher events
  useEffect(() => {
    if (!dataUserById?.user_id || !dataUserById?.entity_id) {
      console.error("Missing user information.");
      return;
    }
    const pusher = new Pusher("981e65db6d4dc90983b4", {
      cluster: "us3",
      encrypted: true,
    });
    const channel = pusher.subscribe("poll");
    const voteHandler = (eventData) => {
      if ( eventData.category_id===2 &&
            eventData?.user_id === dataUserById?.user_id ||
        eventData?.entity_id === dataUserById?.entity_id 
      ) {
        setVotes((prevVotes) => prevVotes + 1);
        const notificationTitle = "تنبيه: إشعار جديد!";
        const notificationBody =
          eventData?.message || "You have received a new vote!";

        // Trigger browser notification
        showNotification(notificationTitle, notificationBody);
        // Show toast notification
        toast.success(eventData?.message || "Vote received", {
          position: "top-right",
          style: {
            backgroundColor: "black",
            color: "white",
          },
        });
      }
    };
    channel.bind("vote", voteHandler);
    return () => {
      channel.unbind("vote", voteHandler);
      pusher.unsubscribe("poll");
    };
  }, [dataUserById]);
  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().catch((error) =>
        console.error("Notification permission request failed:", error)
      );
    }
  }, []);
  return (
    <AppBar position="fixed" open={open} rtl={rtl}>
      <StyledToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {token && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                mr: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <GridMenuIcon />
            </IconButton>
          )}
          <Typography
            component="h1"
            sx={{
              fontSize: "20px",
              fontWeight: 500,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              color: 'inherit',
              transition: 'opacity 0.2s',
              '&:hover': {
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

        <Stack direction="row" spacing={2} alignItems="center">
          {!token ? (
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                transition: 'all 0.2s',
              }}
            >
              {t('login')}
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
                  color: 'inherit',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.08)' 
                      : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                {theme.palette.mode === "light" ? (
                  <LightModeOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </IconButton>
              <OtherApplication navigate={navigate} />
              <div className="showMenuList">
                <DropDownMenu navigate={navigate} />
              </div>
            </>
          )}
        </Stack>
      </StyledToolbar>
    </AppBar>
  );
};

export default AppbarHeader;
