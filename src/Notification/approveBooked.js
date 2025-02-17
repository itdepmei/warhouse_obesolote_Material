import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { ChatOutlined, Delete } from "@mui/icons-material";
import { getToken } from "../utils/handelCookie";
import { BackendUrl } from "../redux/api/axios";
import axios from "axios";
import { CustomNoRowsOverlay, DeleteItem, getTimeAgo } from "../utils/Function";
import ApproveComponent from "./ApproveComponent";
import MoreOption from "./MoreObtion";
import { useDispatch, useSelector } from "react-redux";
import { getDataUserById } from "../redux/userSlice/authActions";
import Loader from "../components/Loader";
import { useApi } from "../hooks/useApi";

export default function ApproveBooked() {
  const { roles } = useSelector((state) => state.RolesData);
  const token = getToken();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const [openChat, setOpenChat] = useState(null); // Store the opened chat ID
  const [message, setMessage] = useState([]);
  const [dataBooked, setBooked] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { dataUserById } = useSelector((state) => {
    return state?.user;
  });
  useEffect(() => {
    dispatch(getDataUserById(token));
  }, [dispatch]);
  const { loading: apiLoading, error, fetchData } = useApi();

  const fetchDataByProjectId = useCallback(async () => {
    if (!dataUserById?.entity_id) return;
    try {
      await fetchData({
        endpoint: "/api/getDataBookedFalse",
        method: "GET",
        params: {
          entities_id: dataUserById?.entity_id,
          checkPermissionUser: roles?.Booking_requests?._id,
        },
        onSuccess: (data) => {
          setBooked(data?.response || []);
        },
        onError: (err) => {
          console.error("Error fetching booked data:", err);
          setBooked([]);
        },
      });
    } catch (error) {
      console.error("Error in fetchDataByProjectId:", error);
      setBooked([]);
    }
  }, [fetchData, dataUserById?.entity_id, roles?.Booking_requests?._id]);

  useEffect(() => {
    fetchDataByProjectId();
  }, [fetchDataByProjectId , dataUserById?.entity_id, roles?.Booking_requests?._id]);

  const fetchMessages = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BackendUrl}/api/getDataMessageById/${id}`,
        { headers: { authorization: token } }
      );
      setMessage(response?.data?.response || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
    setIsLoading(false);
  };

  const handleOpenChat = async (id) => {
    if (openChat === id) {
      setOpenChat(null); // Close chat if it's already open
    } else {
      setOpenChat(id); // Open the clicked chat
      await fetchMessages(id); // Fetch messages for the selected item
    }
  };

  const handleDeleteItem = async (id) => {
    await DeleteItem(
      id,
      () => setRefresh((prev) => !prev),
      null,
      token,
      "cancelRequest"
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: 3,
      }}
    >
      {isLoading && <Loader />}
      <Box>
        {dataBooked?.length > 0 ? (
          dataBooked?.map((item) => (
            <React.Fragment key={item?.book_id}>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  marginBottom: 2,
                  borderRadius: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    marginBottom: 1,
                    color: "text.secondary",
                  }}
                >
                  {getTimeAgo(item?.created_book_at)}
                </Typography>

                <Typography
                  dir="rtl"
                  sx={{
                    marginBottom: 2,
                    fontWeight: 500,
                  }}
                >
                  {`${item?.user_name} من ${item?.Entities_name} طلب حجز ${item?.quantity} عناصر من مادة ${item?.name_material}`}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={() => handleDeleteItem(item?.book_id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenChat(item?.book_id)}
                      color="primary"
                    >
                      <ChatOutlined />
                    </IconButton>
                  </Box>
                  <ApproveComponent
                    book_id={item?.book_id}
                    material_id={item?.material_id}
                    path={"ApproveBooked"}
                    setRefresh={setRefresh}
                    edit={false}
                  />
                </Box>
              </Paper>

              {openChat === item?.book_id && (
                <Box sx={{ paddingLeft: 2 }}>
                  {message.map((msg) => (
                    <Paper
                      key={msg?.message_id}
                      variant="outlined"
                      sx={{
                        padding: 2,
                        marginBottom: 1.5,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography>{msg?.message}</Typography>
                        <MoreOption
                          msgId={msg?.id}
                          messageDe={msg?.message}
                          setRefresh={setRefresh}
                          setOpenChat={setOpenChat}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </React.Fragment>
          ))
        ) : (
          <Box sx={{ marginTop: 4 }}>
            <CustomNoRowsOverlay />
          </Box>
        )}
      </Box>
    </Box>
  );
}
