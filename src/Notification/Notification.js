import * as React from "react";
import { Paper, Typography, IconButton, Box } from "@mui/material";
import { Delete, Done, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import { BackendUrl } from "../redux/api/axios";
import { getToken } from "../utils/handelCookie";
import { useDispatch, useSelector } from "react-redux";
import { getDataUserById } from "../redux/userSlice/authActions";
import { useEffect } from "react";
import { BottomClose, BottomSend } from "../utils/Content";
import HeaderCenter from "../components/HeaderCenterComponent";
import { CustomNoRowsOverlay, getTimeAgo } from "../utils/Function";
import { useNavigate } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
export default function Notification({ urlApi }) {
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const [refresh, setRefresh] = React.useState(false);
  const [notification, setNotification] = React.useState([]); // Initialize as empty array
  const [displayCount, setDisplayCount] = React.useState(6); // Number of notifications to display
  const [loading, setLoading] = React.useState(false);
  const token = getToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePath = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BackendUrl}/api/EditNotificationById`,
        { dataId: data?.id },
        { headers: { authorization: token } }
      );
      if (response) {
        navigate(data?.url);
      }
    } catch (error) {
      console.error("Failed to update notification:", error);
    } finally {
      setLoading(false);
    }
  };

  const { dataUserById } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getDataUserById(token));
  }, [dispatch, token]);

  const fetchDataBooked = async () => {
    setLoading(true);
    if (!dataUserById?.entity_id) return;
    try {
      const response = await axios.get(
        `${BackendUrl}/api/${urlApi}/${dataUserById.entity_id}`,
        { headers: { authorization: token } }
      );
      // Ensure we're setting an array, use empty array as fallback
      const notificationData = Array.isArray(response?.data?.response)
        ? response.data.response
        : [];
      setNotification(notificationData);
    } catch (error) {
      console.error("Failed to fetch booked data:", error);
      setNotification([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataBooked();
  }, [refresh, dataUserById?.entity_id]);

  // Ensure we have an array before slicing
  const displayedNotifications = Array.isArray(notification)
    ? notification.slice(0, displayCount)
    : [];

  const handleSeeMore = () => {
    setDisplayCount((prevCount) => prevCount + 4);
  };

  const handleDeleteItem = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BackendUrl}/api/deleteNotificationById?id=${id}`,
        { headers: { authorization: token } }
      );
      if (response) {
        toast.success(response?.data?.message);
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handelDeleteAll = async (isRead) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success ms-3",
        cancelButton: "btn btn-danger",
        popup: "custom-swal-popup", // Add this line
      },
      buttonsStyling: false,
    });
    try {
      const result = await swalWithBootstrapButtons.fire({
        title: "هل انت متأكد من الحذف الاشعارات المقروئة ؟",
        text: "! لن تتمكن من التراجع عن الحذف ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "موافق",
        cancelButtonText: "لا , تراجع!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        // @ts-ignore
        const response = await axios({
          method: "get",
          url: `${BackendUrl}/api/deleteNotificationById?isRead=${isRead}&&id=${dataUserById?.entity_id}`,
          headers: {
            authorization: token,
          },
        });
        if (response) {
          setRefresh((prv) => !prv);
        }
        swalWithBootstrapButtons.fire({
          title: "! تم الحذف ",
          text: "تم حذف القيد",
          icon: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "تم التراجع",
          text: "",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      {loading && <Loader />}
      <Box
        className="mt-4"
        sx={{
          backgroundColor: maintheme?.backgroundColor || "#f5f5f5",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <HeaderCenter
          title={t("Notification.platform Notification")}
          typeHeader={"h4"}
        />

        <Box
          className="container"
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              mb: 3,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              direction: "rtl",
            }}
          >
            <BottomSend
              onClick={() => handelDeleteAll(true)}
              sx={{
                backgroundColor: maintheme?.primaryColor || "#126A99",
                color: "#fff",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: maintheme?.primaryColor
                    ? `${maintheme.primaryColor}dd`
                    : "#0d4c6e",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {t("Notification.Delete all read notifications")}
              <Delete />
            </BottomSend>
            <BottomClose
              onClick={() => handelDeleteAll(false)}
              sx={{
                backgroundColor: maintheme?.errorColor || "#dc3545",
                color: "#fff",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: maintheme?.errorColor
                    ? `${maintheme.errorColor}dd`
                    : "#c82333",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {t("Notification.Delete all unread notifications")}
              <Delete />
            </BottomClose>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {displayedNotifications.length > 0 ? (
              displayedNotifications?.map((item, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: item?.is_read
                      ? (maintheme?.backgroundColor || "#f8f9fa") + "80"
                      : "#ffffff",
                    border: "1px solid",
                    borderColor: item?.is_read
                      ? "transparent"
                      : (maintheme?.primaryColor || "#126A99") + "20",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                      borderColor: item?.is_read
                        ? "transparent"
                        : maintheme?.primaryColor || "#126A99",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Cairo-Medium",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: maintheme?.primaryColor || "#126A99",
                          flex: 1,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item?.title || ""}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Cairo",
                          fontSize: "12px",
                          color: "text.secondary",
                          backgroundColor:
                            (maintheme?.backgroundColor || "#f8f9fa") + "80",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          direction: "rtl",
                        }}
                      >
                        {item?.created_at ? getTimeAgo(item?.created_at) : ""}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Cairo-Medium",
                          fontSize: "14px",
                          color: "text.secondary",
                          flex: 1,
                          mr: 2,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item?.message || t("Notification.noNotifications")}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {item?.is_read ? (
                          <>
                            <IconButton
                              onClick={() => handlePath(item)}
                              sx={{
                                color: maintheme?.primaryColor || "#126A99",
                                "&:hover": {
                                  backgroundColor:
                                    (maintheme?.primaryColor || "#126A99") +
                                    "20",
                                },
                              }}
                            >
                              <Done />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteItem(item.id)}
                              sx={{
                                color: maintheme?.errorColor || "#dc3545",
                                "&:hover": {
                                  backgroundColor:
                                    (maintheme?.errorColor || "#dc3545") + "20",
                                },
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            onClick={() => handlePath(item)}
                            sx={{
                              color: maintheme?.primaryColor || "#126A99",
                              "&:hover": {
                                backgroundColor:
                                  (maintheme?.primaryColor || "#126A99") + "20",
                              },
                            }}
                          >
                            <ReplyIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))
            ) : (
              <CustomNoRowsOverlay />
            )}
          </Box>
        </Box>

        {displayCount < notification?.length && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 3,
            }}
          >
            <BottomSend
              sx={{
                width: "200px",
                backgroundColor: maintheme?.primaryColor || "#126A99",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: maintheme?.primaryColor
                    ? `${maintheme.primaryColor}dd`
                    : "#0d4c6e",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={handleSeeMore}
            >
              {t("Notification.See More")}
              <ExpandMore />
            </BottomSend>
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
}
