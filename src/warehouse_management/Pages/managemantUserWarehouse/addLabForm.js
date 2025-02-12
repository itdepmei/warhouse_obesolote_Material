import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import PopupForm from "../../../components/PopupForm";
import { BackendUrl } from "../../../redux/api/axios";
import SaveIcon from "@mui/icons-material/Save";
import { getToken } from "../../../utils/handelCookie";
const AddLabForm = ({
  editMode,
  dataUserById,
  setRefreshButton,
  dataUser,
  factoryData,
  dataUserFactor,
  labData,
}) => {
  console.log("factory data", factoryData);
  console.log("lab data", labData);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: "",
    status: "",
    name: "",
    location: "",
    specialization: "",
    description: "",
  });
  console.log("form data", formData, dataUserFactor);
  // Update formData when in editMode and labData is available
  useEffect(() => {
    if (labData && editMode) {
      setFormData({
        user_id: labData.user_id || "",
        status: labData.status || "نشط",
        name: labData.Laboratory_name || "",
        location: labData.location || "",
        specialization: labData.specialization || "",
        description: labData.description || "",
      });
    }
  }, [labData, editMode]);
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const payload = {
        id: labData?.id,
        name: formData.name,
        status: formData.status,
        factory_id: dataUserFactor.factory_id,
        specialization: formData.specialization,
        location: formData.location,
        description: formData.description,
        user_id: formData.user_id || dataUserById?.user_id,
        entity_id: formData.entity_id || dataUserById?.entity_id,
      };
      const endpoint = editMode
        ? `${BackendUrl}/api/warehouse/LaboratoriesEdit`
        : `${BackendUrl}/api/warehouse/LabRegister`;

      const response = await axios.post(endpoint, payload, {
        headers: {
          authorization: `${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        toast.success(response?.data?.message);
        setRefreshButton((prev) => !prev);
        handleClose();
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      user_id: dataUserById?.user_id || "",
      entity_id: dataUserById?.entity_id || "",
      name: "",
      location: "",
      status: "نشط",
      specialization: "",
      description: "",
      // factory_id: "",
    });
    setErrors({});
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  const renderFormContent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <Typography> مصنع : {dataUserFactor?.Factories_name}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label={t("أسم المعمل")}
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          margin="normal"
          required
        />
        {/* <FormControl fullWidth margin="normal">
          <InputLabel>{t("المصنع")}</InputLabel>
          <Select
            value={formData?.factory_id}
            label={t("المصنع")}
            name="factory_id"
            onChange={(e) =>
              setFormData({ ...formData, factory_id: e.target.value })
            }
          >
            {factoryData?.map((factory) => (
              <MenuItem key={factory.id} value={factory.id}>
                {factory.Factories_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        <FormControl fullWidth>
          <InputLabel>{t("الحالة")}</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            error={!!errors.status}
            required
            label={t("الحالة")}
          >
            <MenuItem value="نشط">{t("نشط")}</MenuItem>
            <MenuItem value="غير نشط">{t("غير نشط")}</MenuItem>
            <MenuItem value="تحت الصيانة">{t("تحت الصيانة")}</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>مدير المخزن</InputLabel>
          <Select
            name="user_id"
            value={formData.user_id}
            label="مدير المخزن"
            onChange={(e) =>
              setFormData({ ...formData, user_id: e.target.value })
            }
          >
            {dataUser
              ?.filter((user) => user?.group_id === 7)
              ?.map((user) => (
                <MenuItem key={user?.id} value={user?.id}>
                  {user?.user_name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label={t("التخصص")}
          name="specialization"
          value={formData.specialization}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label={t("الموقع")}
          name="location"
          value={formData?.location}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label={t("الوصف")}
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          margin="normal"
          multiline
          rows={3}
        />
      </Box>
    </Box>
  );

  const renderFormActions = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        startIcon={<SaveIcon />}
      >
        {editMode ? t("saveChange") : t("save")}
      </Button>
      <Button onClick={handleClose} variant="outlined" disabled={loading}>
        {t("close")}
      </Button>
    </Box>
  );

  return (
    <div>
      {!editMode && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          {t("أضافة معمل جديد")}
        </Button>
      )}
      {editMode && (
        <MenuItem onClick={handleOpen} color="primary">
          <EditIcon /> {t("تعديل")}
        </MenuItem>
      )}
      <PopupForm
        title={editMode ? t("تعديل المعمل") : t("أضافة المعمل")}
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="100%"
        maxWidth="sm"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
};

export default AddLabForm;
