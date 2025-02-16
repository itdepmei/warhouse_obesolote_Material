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
import { Minimize, ModeEditOutlined } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";
import CustomDatePicker from "../../../components/CustomDatePicker";
export default function InventoryModel(props) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dataMaterial, setDataMaterial] = useState({
    code: "",
    name: "",
    balance: "",
    minimum_stock_level: "",
    specification: "",
    origin: "",
    measuring_id: "",
    production_date: null,
    materialId: "",
  });
  const [formData, setFormData] = useState({
    quantity_incoming_outgoing: "",
    expiry_date: null,
    purchase_date: null,
    document_date: null,
    document_number: "",
    beneficiary: "",
    state_id: "",
    price: "",
  });
  useEffect(() => {
    if (props?.typeOption === "outgoing") {
      setFormData((prev) => ({ ...prev, document_type: "مستند صادر" }));
    } else {
      setFormData((prev) => ({ ...prev, document_type: "مستند وارد" }));
    }
  }, [props?.typeOption]);
  const handleCodeChange = async (e) => {
    const code = e.target.value;
    setDataMaterial((prev) => ({ ...prev, code }));
    if (code && props?.dataUserById) {
      const entity_id = props?.dataUserById.entity_id;
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();
        searchParams.append("search_term", code.trim());
        searchParams.append("entity_id", entity_id);
        searchParams.append("warehouse_id", props?.warehouseId);
        const response = await axios.get(
          `${BackendUrl}/api/warehouse/inventoryGetDataByCode?${searchParams.toString()}`,
          {
            headers: {
              authorization: props?.token,
            },
          }
        );
        if (response?.data) {
          setDataMaterial({
            code: response.data?.data?.cod_material || "",
            name: response.data?.data?.name_of_material || "",
            balance: response.data?.data?.balance || "",
            minimum_stock_level: response.data?.data?.minimum_stock_level || "",
            specification: response.data?.data?.specification || "",
            origin: response.data?.data?.origin || "",
            measuring_id: response.data?.data?.measuring_id || "",
            materialId: response.data?.data?.id || "",
          });
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("حدث خطأ أثناء البحث");
        }
        // Clear the material data on error
        setDataMaterial({
          code: code,
          name: "",
          balance: "",
          minimum_stock_level: "",
          specification: "",
          origin: "",
          measuring_id: "",
          materialId: "",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (props?.addInventory === "addInventory" && props?.storeData) {
      setDataMaterial({
        code: props?.storeData.cod_material || "",
        name: props?.storeData.name_of_material || "",
        balance: props?.storeData.balance || "",
        specification: props?.storeData.specification || "",
        origin: props?.storeData.origin || "",
        measuring_id: props?.storeData.measuring_id || "",
        production_date: props?.storeData.production_date || null,
        minimum_stock_level: props?.storeData.minimum_stock_level || "",
        materialId: props?.storeData.id || "",
      });
    }
  }, [props?.addInventory, props?.storeData]);

  useEffect(() => {
    if (props?.editMode) {
     
      setDataMaterial({
        code: props?.InventoryData.cod_material,
        name: props?.InventoryData.name_of_material,
        balance: props?.InventoryData.balance,
        specification: props?.InventoryData?.specification,
        state_id: props?.InventoryData.state_id,
        origin: props?.InventoryData.origin,
        measuring_id: props?.InventoryData.measuring_id,
        production_date: props?.InventoryData.production_date,
        minimum_stock_level: props?.InventoryData.minimum_stock_level,
        materialId: props?.InventoryData.material_id,
      });

      setFormData({
        document_number: props?.InventoryData.document_number,
        quantity_incoming_outgoing:
          props?.InventoryData.quantity_incoming_outgoing,
        price: props?.InventoryData.price,
        beneficiary: props?.InventoryData?.beneficiary,
        state_id: props?.InventoryData?.state_id,
        document_type: props?.InventoryData?.document_type,
        expiry_date: dayjs(props?.InventoryData?.expiry_date),
        purchase_date: dayjs(props?.InventoryData?.purchase_date),
        document_date: dayjs(props?.InventoryData?.document_date),
        production_date: dayjs(props?.InventoryData?.production_date),
      });
    }
  }, [props?.editMode, props?.InventoryData]);
  const handleDateChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ? value.format("YYYY-MM-DD") : null,
    }));
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = props?.editMode ? `inventoryEdit` : "inventoryRegister";
      const response = await axios({
        method: "post",
        url: `${BackendUrl}/api/warehouse/${url}`,
        headers: {
          Accept: "application/json",
          authorization: props?.token,
          "Content-Type": "application/json",
        },
        data: {
          formData,
          entity_id: props?.dataUserById?.entity_id,
          user_id: props?.dataUserById?.user_id,
          ministry_id: props?.dataUserById?.minister_id,
          warehouse_id: props?.warehouseId,
          lab_id: props?.dataUserLab?.lab_id,
          factory_id: props?.dataUserLab.factory_id,
          material_id: dataMaterial?.materialId && dataMaterial?.materialId,
          inventory_id: props?.InventoryData?.inventory_id,
          typeOption: props?.typeOption,
          originQuantity:
            props?.editMode && props?.InventoryData.quantity_incoming_outgoing,
        },
      });
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
      {props?.storeData ? (
        <Typography variant="h6" gutterBottom>
          {props?.storeData?.name_of_material}
        </Typography>
      ) : (
        <Typography variant="h6" gutterBottom></Typography>
      )}
      {props?.InventoryData?.id}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* Fetched Information Section */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="code"
            label="رقم رمزي"
            value={dataMaterial.code}
            onChange={handleCodeChange}
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
            value={dataMaterial.name}
            fullWidth
            required
            disabled
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="balance"
            label="الرصيد"
            value={dataMaterial.balance}
            fullWidth
            required
            disabled
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required disabled>
            <InputLabel>الوحدة</InputLabel>
            <Select
              name="measuring_id"
              value={dataMaterial.measuring_id}
              label="الوحدة"
              InputProps={{
                readOnly: true,
              }}
            >
              {props?.dataUnitMeasuring?.map((item) => (
                <MenuItem key={item?.unit_id} value={item?.unit_id}>
                  {item?.measuring_unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="specification"
            label="المواصفة الفنية"
            type="text"
            value={dataMaterial.specification}
            fullWidth
            multiline
            rows={4}
            disabled
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="origin"
            label="المنشأ"
            type="text"
            value={dataMaterial.origin}
            fullWidth
            disabled
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="minimum_stock_level"
            label="الحد الادنى للمخزون"
            type="number"
            value={dataMaterial.minimum_stock_level}
            fullWidth
            disabled
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  {" "}
                  الحد الادنا كمن المخزون
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="price"
            label="السعر"
            type="number"
            value={formData.price}
            fullWidth
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">دينار</InputAdornment>
              ),
            }}
          />
        </Grid>
        {/* User Input Section */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="document_number"
            label="رقم المستند"
            value={formData.document_number}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.document_number}
            helperText={errors.document_number}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>حالة المادة</InputLabel>
            <Select
              name="state_id"
              value={formData.state_id}
              onChange={handleInputChange}
              label="حالة المادة"
            >
              {props?.stateMaterial.map((item) => (
                <MenuItem key={item?.id} value={item?.id}>
                  {item.state_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="beneficiary"
            label=" الجهة المستفيدة"
            value={formData.beneficiary}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.beneficiary}
            helperText={errors.beneficiary}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="quantity_incoming_outgoing"
            label={
              props?.typeOption === "incoming"
                ? "الكمية واردة"
                : "الكمية صادرة  "
            }
            type="number"
            value={formData?.quantity_incoming_outgoing}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.quantity_incoming_outgoing}
            helperText={errors.quantity_incoming_outgoing}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <TextField
            name="quantity_outgoing"
            label="الكمية صادر"
            type="number"
            value={formData.quantity_outgoing}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.quantity_outgoing}
            helperText={errors.quantity_outgoing}
          />
        </Grid> */}

        {/* Date Pickers Section */}
        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            haswidth={true}
            label={"تاريخ المستند"}
            format="YYYY/MM/DD"
            placeholder="تاريخ المستند"
            customWidth="100%"
            customPadding="0px"
            paddingHorizontal={"0px"}
            required={true}
            value={formData.document_date ? formData.document_date : null}
            CustomFontSize="12px"
            borderPosition="right"
            is_dateTime={false}
            error={errors.document_date !== ""}
            textError={errors.document_date}
            setValue={(value) => handleDateChange("document_date", value)}
            is_Time={false}
            minDate={null}
            maxDate={null}
            borderColor="inherit"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            haswidth={true}
            label={"تاريخ الانتاج "}
            format="YYYY/MM/DD"
            placeholder="تاريخ الانتاج "
            customWidth="100%"
            customPadding="0px"
            paddingHorizontal={"0px"}
            required={true}
            value={formData.production_date ? formData.production_date : null}
            CustomFontSize="12px"
            borderPosition="right"
            is_dateTime={false}
            error={errors.production_date !== ""}
            textError={errors.production_date}
            setValue={(value) => handleDateChange("production_date", value)}
            is_Time={false}
            minDate={null}
            maxDate={null}
            borderColor="inherit"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            haswidth={true}
            label={"تاريخ نفاذ الصلاحية "}
            format="YYYY/MM/DD"
            placeholder="تاريخ نفاذ الصلاحية "
            customWidth="100%"
            customPadding="0px"
            paddingHorizontal={"0px"}
            required={true}
            value={formData.expiry_date ? formData.expiry_date : null}
            CustomFontSize="12px"
            borderPosition="right"
            is_dateTime={false}
            error={errors.expiry_date !== ""}
            textError={errors.expiry_date}
            setValue={(value) => handleDateChange("expiry_date", value)}
            is_Time={false}
            minDate={null}
            maxDate={null}
            borderColor="inherit"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            haswidth={true}
            label={"تاريخ شراء المادة"}
            format="YYYY/MM/DD"
            placeholder="تاريخ شراء المادة"
            customWidth="100%"
            customPadding="0px"
            paddingHorizontal={"0px"}
            required={true}
            value={formData.purchase_date ? formData.purchase_date : null}
            CustomFontSize="12px"
            borderPosition="right"
            is_dateTime={false}
            error={errors.purchase_date !== ""}
            textError={errors.purchase_date}
            setValue={(value) => handleDateChange("purchase_date", value)}
            is_Time={false}
            minDate={null}
            maxDate={null}
            borderColor="inherit"
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
      {props?.addInventory === "addInventory" ? (
        <>
          {props?.typeOption === "outgoing" ? (
            <MenuItem onClick={handleOpen} disableRipple>
              <Minimize sx={{ fontSize: "20px" }} />
              <span className="ms-2">صرف المادة</span>
            </MenuItem>
          ) : (
            <MenuItem onClick={handleOpen} disableRipple>
              <AddIcon sx={{ fontSize: "20px" }} />
              <span className="ms-2">أستلام المادة</span>
            </MenuItem>
          )}
        </>
      ) : !props?.editMode ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ p: 1 }}
          onClick={handleOpen}
        >
          أستمارة الجرد إضافة مادة
        </Button>
      ) : (
        <MenuItem onClick={handleOpen} disableRipple>
          <ModeEditOutlined sx={{ fontSize: "20px" }} />
          <span className="ms-2">تعديل</span>
        </MenuItem>
      )}

      <PopupForm
        title={
          props?.editMode
            ? props?.typeOption === "outgoing"
              ? "أستمارة تعديل مستند صادر"
              : "أستمارة تعديل مستند وارد"
            : props?.typeOption === "outgoing"
            ? "أستمارة إضافة مستند صادر"
            : "أستمارة إضافة مستند وارد"
        }
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
