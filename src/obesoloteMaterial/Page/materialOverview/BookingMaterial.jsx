import { useState, useEffect, useCallback } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PopupForm from "../../../components/PopupForm";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendUrl } from "../../../redux/api/axios";
import { getToken } from "../../../utils/handelCookie";
import { setLanguage } from "../../../redux/LanguageState";
import { BottomRoot, BottomSend } from "utils/Content";
import { getRoleAndUserId } from "../../../redux/RoleSlice/rolAction";
import { hasPermission } from "utils/Function";
export default function BookingFormUser({
  Quantity,
  obsoleteMaterial,
  entity_id,
  setRefresh,
  user_id,
  dataUserById,
}) {
  const dispatch = useDispatch();
  const { Permission, roles } = useSelector((state) => state.RolesData);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [permissionData, setPermissionData] = useState([]);
  const token = getToken();
  // Fetch roles and permissions on component mount
  useEffect(() => {
    dispatch(getRoleAndUserId(token));
    dispatch(setLanguage());
  }, [dispatch, token]);
  // Parse permission data if available
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
  // Handle form submission
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      // Validate the quantity
      const parsedQuantity = parseInt(quantity, 10);
      if (
        isNaN(parsedQuantity) ||
        parsedQuantity <= 0 ||
        parsedQuantity > Quantity
      ) {
        toast.error(
          t("يجب ان تكون الرقم المدخل من نطاق الكمية الموجودة من 1 فما فوق")
        );
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("material_id", obsoleteMaterial);
      formData.append("entities_id_buy", dataUserById?.entity_id);
      formData.append("entities_id", entity_id);
      formData.append("Quantity", parsedQuantity);
      formData.append("originalQuantity", Quantity);
      const hasDirectPermission = hasPermission(
        roles?.allow_to_users_to_send_directly_request_and_upload?._id,
        permissionData
      );
      formData.append("approveSendRequest", hasDirectPermission);
      formData.append("approveSendRequestUploadBook", hasDirectPermission);
      try {
        const response = await axios.post(
          `${BackendUrl}/api/bookRegister`,
          formData,
          {
            headers: {
              token,
              "Content-Type": "application/json",
              authorization: token,
            },
          }
        );
        toast.success(response?.data?.message);
        setRefresh((prev) => !prev);
        setOpen(false); // Close the form on success
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error.message;
        toast.error(errorMessage);
        console.error("Error booking material:", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [
      dataUserById,
      quantity,
      token,
      t,
      Quantity,
      obsoleteMaterial,
      entity_id,
      user_id,
      setRefresh,
      roles,
      permissionData,
    ]
  );

  // Render form content
  const renderFormContent = () => (
    <Box component="form" sx={{ margin: "10px" }} onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          mb: 2,
          mt: 2,
        }}
        dir="rtl"
      >
        <TextField
          value={Quantity}
          id="outlined-required"
          label={t("الكمية المتوفرة")}
          disabled
        />
        <TextField
          label={t(" الكمية المراد حجزها")}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </Box>
    </Box>
  );

  // Render form actions
  const renderFormActions = () => (
    <>
      <BottomRoot onClick={() => setOpen(false)}>{t("close")}</BottomRoot>
      <BottomSend type="submit" onClick={handleSubmit} disabled={loading}>
        {loading ? t("loading") : t("save")}
      </BottomSend>
    </>
  );

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant="contained" color="primary">
        {t("حجز")}
      </Button>
      <PopupForm
        title={t("أستمارة الحجز")}
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        width="50%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
