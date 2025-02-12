import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import PopupForm from "../../../components/PopupForm";
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { BackendUrl } from "../../../redux/api/axios";
import { toast } from "react-toastify";
import { ModeEditOutlined } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";

export default function StoreFormModel(props) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    minimum_stock_level: "",
    specification: "",
    state_id: "",
    origin: "",
    measuring_id: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (props?.editMode) {
      setFormData({
        code: props?.storeData?.cod_material,
        name: props?.storeData?.name_of_material,
        specification: props?.storeData?.specification,
        state_id: props?.storeData?.state_id,
        origin: props?.storeData?.origin,
        measuring_id: props?.storeData?.measuring_id,
        minimum_stock_level: props?.storeData?.minimum_stock_level,
      });
    }
  }, [props?.editMode, props?.storeData]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.code) newErrors.code = "كود المنتج مطلوب";
    if (!formData.name) newErrors.name = "اسم المنتج مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const url = props?.editMode ? "StorDataEdit" : "storeDataRegister";
      const response = await axios.post(
        `${BackendUrl}/api/warehouse/${url}`,
        {
          formData,
          entity_id: props?.dataUserById?.entity_id,
          user_id: props?.dataUserById?.user_id,
          ministry_id: props?.dataUserById?.minister_id,
          storeData_id: props?.storeData?.id,
          warehouse_id: props?.warehouseId,
          lab_id: props?.dataUserLab?.lab_id,
          factory_id: props?.dataUserLab.factory_id,
        },
        {
          headers: { authorization: props?.token },
        }
      );
      if (response) {
        toast.success(response?.data?.message);
        props?.setRefreshButton((prev) => !prev); // Trigger data refresh
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const renderFormContent = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        {props?.dataUserLab?.Laboratory_name}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="code"
            label="رقم رمزي"
            value={formData?.code}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.code}
            helperText={errors.code}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label="اسم المنتج"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>الوحدة</InputLabel>
            <Select
              name="measuring_id"
              value={formData?.measuring_id}
              onChange={handleInputChange}
              label="الوحدة"
            >
              {props?.dataUnitMeasuring.map((item) => (
                <MenuItem key={item?.unit_id} value={item?.unit_id}>
                  {item?.measuring_unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="minimum_stock_level"
            label="الحد الادنى للمخزون"
            type="number"
            value={formData.minimum_stock_level}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.minimum_stock_level}
            helperText={errors.minimum_stock_level}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="specification"
            label="المواصفة الفنية"
            type="text"
            value={formData.specification}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="origin"
            label="المنشأ"
            type="text"
            value={formData.origin}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
  const renderFormActions = () => (
    <>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        startIcon={<SaveIcon />}
      >
        {props?.editMode ? t("saveChange") : t("save")}
      </Button>
      <Button onClick={handleClose} variant="outlined" disabled={loading}>
        {t("close")}
      </Button>
    </>
  );
  return (
    <div>
      {!props?.editMode && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          إضافة مخزن
        </Button>
      )}
      {props?.editMode && (
        <MenuItem onClick={handleOpen} disableRipple>
          <ModeEditOutlined sx={{ color: "", fontSize: "20px" }} />
          <span className="ms-2">تعديل</span>
        </MenuItem>
      )}
      <PopupForm
        title={props?.editMode ? "تعديل منتج" : "إضافة منتج جديد"}
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="100%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
