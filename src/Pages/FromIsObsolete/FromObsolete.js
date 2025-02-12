import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Slide,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { BackendUrl } from "../../redux/api/axios";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomeSelectField from "../../components/CustomeSelectField";
import CustomTextField from "../../components/CustomTextField";
import "../style.css";
import { getDataMinistries } from "../../redux/MinistriesState/MinistresAction";
import { getDataEntities } from "../../redux/EntitiesState/EntitiesAction";
import { BorderLinearProgress, BottomSend } from "../../utils/Content";
import { Add, ModeEditOutlined } from "@mui/icons-material";
import Header from "../../components/HeaderComponent";
import { GridCloseIcon } from "@mui/x-data-grid";
import CustomDatePicker from "components/CustomDatePicker";
import FileUploadComponent from "components/FileUplodComponent";
import { getDataStateName } from "../../redux/StateMartrialState/stateMatrialAction";
import dayjs from "dayjs";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function FromIsDeleted({
  dataSubClass,
  dataMainClass,
  dataUnitMeasuring,
  label,
  DataProject,
  setRefreshButton,
  token,
  dataUserById,
}) {
  const { rtl } = useSelector((state) => {
    return state?.language;
  });
  const { Ministries } = useSelector((state) => {
    // @ts-ignore
    return state?.Ministries;
  });
  const { Entities } = useSelector((state) => {
    // @ts-ignore
    return state.Entities;
  });
  const { stateMaterial } = useSelector((state) => state?.StateMaterial);
  const mainTheme = useSelector((state) => state?.ThemeData?.maintheme);
  const theme = useTheme();
  const [filterDatSuClass, setFltter] = useState([]);
  const [nameMartials, setNameMartials] = useState(""),
    [status_martials, setStatus_martials] = useState(""),
    [measuring_unit, setMeasuring_unit] = useState(""),
    [fileName, setFileName] = useState([]),
    [Entities_id, setEntities_id] = useState(""),
    [ministry_id, setMinister_id] = useState(""),
    [Quantity, setQuantity] = useState(""),
    [price_materials, setPrice_martials] = useState(""),
    [main_class, setMain_class] = useState(""),
    [sub_class, setSub_class] = useState(""),
    [description, setDescription] = useState(""),
    [typMartials, setTypMartials] = useState(""),
    [purchaseDate, setPurchaseDate] = useState(dayjs()),
    [removeFile, setRemoveFile] = useState([]);
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const typeMaterilAarry = useMemo(
    () => ["مادة راكدة", "مادة بطيئة الحركة"],
    []
  );

  useEffect(() => {
    let inputs = [
      nameMartials,
      status_martials,
      measuring_unit,
      fileName,
      main_class,
      sub_class,
      price_materials,
      Quantity,
      typMartials,
    ];
    let nonEmptyCount = inputs.reduce((count, input) => {
      return count + (input ? 1 : 0);
    }, 0);

    setValue(nonEmptyCount * 11.11);
  }, [
    nameMartials,
    status_martials,
    measuring_unit,
    Entities_id,
    fileName,
    ministry_id,
    main_class,
    sub_class,
    price_materials,
    Quantity,
    typMartials,
  ]);
  const handleEditFunction = (dateString) => {
    // Convert the received date string to a Day.js object
    const parsedDate = dayjs(dateString);

    // Check if it's a valid date before setting the state
    if (parsedDate.isValid()) {
      setPurchaseDate(parsedDate);
    } else {
      console.log("sdfdsfdsfds==>failed");
    }
  };
  useEffect(() => {
    // @ts-ignore
    dispatch(getDataMinistries());
    dispatch(getDataEntities());
  }, [dispatch]);
  useEffect(() => {
    if (label === "EditData") {
      setNameMartials(DataProject?.name_material);
      setStatus_martials(DataProject?.status_material);
      setMeasuring_unit(DataProject?.measuring_unit);
      setFileName(DataProject?.images);
      // setOldFileName(DataProject?.images);
      setEntities_id(DataProject?.Entities_id);
      setQuantity(DataProject?.Quantity);
      setPrice_martials(DataProject?.price_material);
      setDescription(DataProject?.description);
      // setPurchaseDate(tempDate?(new Date(tempDate)):null);
      handleEditFunction(DataProject?.puchase_date);
      if (Ministries?.length && DataProject?.ministry_id) {
        let findItem = Ministries?.find(
          (item) => item?.id === DataProject?.ministry_id
        );
        if (findItem) setMinister_id(findItem);
      }
      if (Entities?.length && DataProject?.Entities_id) {
        let findItem = Entities?.find(
          (item) => item?.id === DataProject?.Entities_id
        );
        if (findItem) setEntities_id(findItem);
      }
      if (dataMainClass?.length && DataProject?.mainClass_id) {
        let findItem = dataMainClass?.find(
          (item) => item?.mainClass_id === DataProject?.mainClass_id
        );
        if (findItem) setMain_class(findItem);
      }
      if (dataSubClass?.length && DataProject?.subClass_id) {
        let findItem = dataSubClass?.find(
          (item) => item?.subClass_id === DataProject?.subClass_id
        );
        if (findItem) setSub_class(findItem);
      }
      if (stateMaterial?.length && DataProject?.status_id) {
        let findItem = stateMaterial?.find(
          (item) => item?.id === DataProject?.status_id
        );
        if (findItem) setStatus_martials(findItem);
      }
      if (dataUnitMeasuring?.length && DataProject?.measuring_unit_id > 0) {
        let findItem = dataUnitMeasuring?.find(
          (item) => item?.unit_id === DataProject?.measuring_unit_id
        );
        if (findItem) setMeasuring_unit(findItem);
      }
      if (typeMaterilAarry?.length && DataProject?.typ_material > 0) {
        let findItem = typeMaterilAarry?.find(
          (item) => item === DataProject?.typ_material
        );
        if (findItem) typMartials(findItem);
      }
      if (typeMaterilAarry?.length && DataProject?.typ_material) {
        let findItem = typeMaterilAarry?.find(
          (item) => item === DataProject?.typ_material
        );
        if (findItem) setTypMartials(findItem); // Use setTypMartials to update the selected value
      }
    }
  }, [
    DataProject,
    Entities,
    Ministries,
    dataMainClass,
    dataSubClass,
    dataUnitMeasuring,
    label,
    stateMaterial,
    typeMaterilAarry,
    typMartials,
  ]);
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const HandleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("nameMartials", nameMartials);
      formData.append("status_martials", status_martials?.id);
      formData.append("measuring_unit", measuring_unit?.unit_id);
      formData.append("ministry_id", dataUserById?.minister_id);
      formData.append("Entities_id", dataUserById?.entity_id);
      // formData.append("price_material", price_materials);
      formData.append("Quantity", Quantity);
      formData.append("sub_class", sub_class?.subClass_id || "");
      formData.append("main_class", main_class?.mainClass_id || "");
      formData.append("user_id", dataUserById?.user_id);
      formData.append("typMartials", typMartials);
      formData.append("description", description);
      formData.append("purchaseDate", purchaseDate);
      fileName.forEach((file) => {
        formData.append("files", file);
      });
      const response = await axios.post(
        `${BackendUrl}/api/stagnantMartialsRegister`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `${token}`,
          },
        }
      );
      if (response) {
        toast.success(response?.data?.message);
        setQuantity("");
        setEntities_id("");
        setMain_class("");
        setNameMartials("");
        setPrice_martials("");
        setStatus_martials("");
        setSub_class("");
        setMeasuring_unit("");
        setMinister_id("");
        setTypMartials(" ");
        setFileName([]);
        setDescription("");
        setOpen(false);
        setRefreshButton((prv) => !prv);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };
  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("nameMartials", nameMartials);
      formData.append("status_martials", status_martials?.id);
      formData.append("removeFile", JSON.stringify(removeFile));
      fileName.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("measuring_unit", measuring_unit?.unit_id);
      formData.append("ministry_id", dataUserById?.minister_id);
      formData.append("Entities_id", dataUserById?.entity_id);
      // formData.append("price_material", price_materials);
      formData.append("Quantity", Quantity);
      formData.append("typMartials", typMartials);
      formData.append("sub_class", sub_class?.subClass_id || "");
      formData.append("main_class", main_class?.mainClass_id || "");
      formData.append("FileName", DataProject?.fileName || "");
      formData.append("description", description);
      formData.append("id", DataProject?.stagnant_id);
      const response = await axios.post(
        `${BackendUrl}/api/stagnantMaterialsEdit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: token,
          },
        }
      );
      if (response) {
        setRefreshButton((prv) => !prv);
        toast.success(response?.data?.message);
        setOpen(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        // toast.error("An unexpected error occurred.");
      }
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    dispatch(getDataStateName());
  }, [dispatch, removeFile]);
  useEffect(() => {
    const dataFilter = dataSubClass?.filter((item) => {
      return item?.mainClass_id === main_class?.mainClass_id;
    });
    setFltter(dataFilter);
  }, [main_class, dataMainClass, dataSubClass]);

  return (
    <React.Fragment>
      {label === "EditData" ? (
        <MenuItem onClick={handleClickOpen} disableRipple>
          <ModeEditOutlined sx={{ color: "", fontSize: "20px" }} />
          <span className="ms-2">تعديل</span>
        </MenuItem>
      ) : (
        <BottomSend onClick={handleClickOpen} disableRipple>
          <Add /> {t("Stagnant.enterNewMaterial")}
        </BottomSend>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Transition}
        // sx={{ padding: "0px" }}
      >
        <DialogContent>
          <AppBar
            sx={{ position: "absolute", background: mainTheme?.iconColor }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <GridCloseIcon />
              </IconButton>
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="h6"
                component="div"
              ></Typography>
              {label === "EditData" ? (
                <Button autoFocus color="inherit" onClick={handleEdit}>
                  حفظ التعديل
                </Button>
              ) : (
                <Button autoFocus color="inherit" onClick={HandleSubmit}>
                  حفظ
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <div style={{ top: "30px", position: "relative" }} dir={rtl?.dir}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                mt: "30px",
                gap: "20px",
              }}
            >
              <Box
                className="boxContainerReportForm  p-4 mt-4 mobileWidth "
                sx={{
                  background: `${
                    theme.palette.mode === "dark"
                      ? mainTheme.lightblack
                      : mainTheme.paperColor
                  } 0% 0% no-repeat padding-box !important`,
                }}
              >
                <Header
                  title={
                    label === "EditData"
                      ? "تعديل معلومات المادة"
                      : "أدخال معلومات المادة "
                  }
                  dir={rtl?.dir}
                />
                <BorderLinearProgress variant="determinate" value={value} />
                <Box sx={{ minWidth: 35 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >{`${Math.round(value)}%`}</Typography>
                </Box>
                {/* progress */}
                <Box
                  className="mobilDisplay"
                  sx={{
                    mb: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "100%",
                  }}
                >
                  <Box sx={{ width: "100%", marginLeft: "15px" }}>
                    <Box sx={{ mb: "15px" }}>
                      <CustomeSelectField
                        label={"أختيار الصنف  الرئيسي "}
                        haswidth={true}
                        value={main_class}
                        hasMultipleLine={true}
                        customPadding={"0px"}
                        list={dataMainClass ? dataMainClass : []}
                        customGetOptionLabel={(option) =>
                          option?.main_Class_name || ""
                        }
                        multiple={false}
                        required
                        readOnly={false}
                        onChange={(e, newValue) => {
                          setMain_class(newValue);
                        }}
                        onClearClick={() => {
                          setMain_class("");
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: "15px" }}>
                      <CustomeSelectField
                        label={"أختيار الصنف الخاص بالرئيسي "}
                        haswidth={true}
                        value={sub_class}
                        hasMultipleLine={true}
                        customPadding={"0px"}
                        list={filterDatSuClass ? filterDatSuClass : []}
                        customGetOptionLabel={(option) =>
                          option?.sub_class_name || ""
                        }
                        multiple={false}
                        required
                        readOnly={false}
                        // error={true}
                        // message={[""]}
                        onChange={(e, newValue) => {
                          setSub_class(newValue);
                        }}
                        onClearClick={() => {
                          setSub_class("");
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: "15px" }}>
                      <CustomeSelectField
                        label={"اختيار نوع المادة"}
                        haswidth={true}
                        value={typMartials || ""} // Ensure typMartials is not undefined
                        hasMultipleLine={true}
                        customPadding={"0px"}
                        list={typeMaterilAarry} // Use the dynamic array
                        customGetOptionLabel={(option) => option || ""}
                        multiple={false}
                        required
                        readOnly={false}
                        onChange={(e, newValue) => {
                          setTypMartials(newValue); // Update the state when the value changes
                        }}
                        onClearClick={() => {
                          setTypMartials(""); // Clear the selected value
                        }}
                      />
                    </Box>
                    <Box sx={{}}>
                      <CustomTextField
                        label={"أسم المادة حسب الادخال الرسمي"}
                        haswidth={true}
                        value={nameMartials}
                        hasMultipleLine={false}
                        paddingHorizontal={"0px"}
                        required
                        readOnly={false}
                        onChange={(e) => {
                          setNameMartials(e.target.value);
                        }}
                        onClearClick={() => {
                          setNameMartials("");
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ width: "100%", marginLeft: "15px" }}>
                    <Box sx={{ mb: "15px" }}>
                      <CustomTextField
                        label={"الكمية"}
                        haswidth={true}
                        value={Quantity}
                        hasMultipleLine={false}
                        paddingHorizontal={"0px"}
                        // message={props?.objectData?.name?.message}
                        readOnly={false}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                        }}
                        onClearClick={() => {
                          setQuantity("");
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: "15px" }}>
                      <CustomeSelectField
                        label={"أختيار وحدة المادة"}
                        haswidth={true}
                        value={measuring_unit}
                        hasMultipleLine={true}
                        customPadding={"0px"}
                        list={dataUnitMeasuring ? dataUnitMeasuring : []}
                        customGetOptionLabel={(option) =>
                          option?.measuring_unit || ""
                        }
                        multiple={false}
                        required
                        readOnly={false}
                        onChange={(e, newValue) => {
                          setMeasuring_unit(newValue);
                        }}
                        onClearClick={() => {
                          setMeasuring_unit("");
                        }}
                      />
                    </Box>
                    {/* <Box sx={{ mb: "15px" }}>
                          <CustomTextField
                            label={"سعر المادة"}
                            haswidth={true}
                            value={price_materials}
                            hasMultipleLine={false}
                            paddingHorizontal={"0px"}
                            // message={props?.objectData?.name?.message}
                            readOnly={false}
                            onChange={(e) => {
                              setPrice_martials(e.target.value);
                            }}
                            onClearClick={() => {
                              setPrice_martials("");
                            }}
                          />
                        </Box> */}
                    <Box sx={{ mb: "15px" }}>
                      <CustomeSelectField
                        label={"أختيار  حالة المادة"}
                        haswidth={true}
                        value={status_martials}
                        hasMultipleLine={true}
                        customPadding={"0px"}
                        list={stateMaterial ? stateMaterial : []}
                        customGetOptionLabel={(option) =>
                          option?.state_name || ""
                        }
                        multiple={false}
                        required
                        readOnly={false}
                        onChange={(e, newValue) => {
                          setStatus_martials(newValue);
                        }}
                        onClearClick={() => {
                          setStatus_martials("");
                        }}
                      />
                    </Box>

                    <Box dir="ltr">
                      <CustomDatePicker
                        haswidth={true}
                        label={"تاريخ شرائها"}
                        format="YYYY/MM/DD"
                        placeholder="تاريخ الشراء"
                        customWidth="100%"
                        customPadding="0px"
                        paddingHorizontal={"0px"}
                        required={true}
                        value={purchaseDate ? purchaseDate : null}
                        CustomFontSize="12px"
                        borderPosition="right"
                        is_dateTime={false}
                        error={false}
                        textError={""}
                        setValue={(date) => {
                          setPurchaseDate(date);
                        }}
                        is_Time={false}
                        minDate={null}
                        maxDate={null}
                        // borderColor="inherit"
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ width: "99%", mb: "15px" }}>
                  <CustomTextField
                    label={"ملاحظات حول المادة "}
                    haswidth={true}
                    value={description}
                    hasMultipleLine={false}
                    paddingHorizontal={"0px"}
                    // message={props?.objectData?.name?.message}
                    readOnly={false}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    onClearClick={() => {
                      setDescription("");
                    }}
                  />
                </Box>
                {label === "EditData" ? (
                  <BottomSend sx={{ width: "99%" }} onClick={handleEdit}>
                    حفظ التعديل
                  </BottomSend>
                ) : (
                  <BottomSend sx={{ width: "99%" }} onClick={HandleSubmit}>
                    حفظ المعلومات
                  </BottomSend>
                )}
              </Box>
              <div className="container">
                {label === "EditData" ? (
                  <div style={{ position: "relative" }}>
                    <FileUploadComponent
                      fileName={fileName || DataProject?.fileName}
                      setFileName={setFileName}
                      removeFile={removeFile}
                      setRemoveFile={setRemoveFile}
                      label="edit"
                    />
                  </div>
                ) : (
                  // <FileUpload
                  //   setFile_name={setFile_name}
                  //   file_name={file_name}
                  //   label="upload"
                  // />
                  <FileUploadComponent
                    setFileName={setFileName}
                    fileName={fileName}
                    removeFile={removeFile}
                    setRemoveFile={setRemoveFile}
                    label="upload"
                  />
                )}
              </div>
            </Box>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
export default FromIsDeleted;
