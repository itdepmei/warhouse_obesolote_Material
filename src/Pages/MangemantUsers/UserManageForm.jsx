// Core imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

// MUI Components
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Slide,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

// Icons
import { Add, Edit, ModeEditOutlined } from "@mui/icons-material";
import { GridCloseIcon } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";

// Custom Components
import CustomeSelectField from "../../components/CustomeSelectField";
import CustomTextField from "../../components/CustomTextField";
import Header from "../../components/HeaderComponent";
import Loader from "../../components/Loader";

// Redux Actions
import { getDataMinistries } from "../../redux/MinistriesState/MinistresAction";
import { getDataEntities } from "../../redux/EntitiesState/EntitiesAction";

// Utils and Config
import { BackendUrl } from "../../redux/api/axios";
import { getToken } from "../../utils/handelCookie";
import {
  BorderLinearProgress,
  BottomSend,
  FormContainer,
  PermissionSection,
  ProgressContainer,
} from "../../utils/Content";

// Styles
import "../style.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UserMangeForm({
  editInfo,
  DataUsers,
  setRefreshButton,
  allUser,
  Ministries,
  Entities,
  DataGovernorate,
  DataJobTitle,
  dataGroup,
  DataApplicationPermission,
}) {
  const { t } = useTranslation("");
  const dispatch = useDispatch();
  const theme = useTheme();
  const token = getToken();
  
  // Redux Selectors
  const { rtl } = useSelector((state) => state?.language);
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const { roles } = useSelector((state) => state.RolesData);

  // State Management
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [active, setIsActive] = useState([]);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [ministriesId, setMinistriesId] = useState("");
  const [entitiesId, setEntitiesId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [Address_id, setAddress_id] = useState("");
  const [jopTitle, setJopTitle] = useState("");

  // Effects
  useEffect(() => {
    dispatch(getDataMinistries());
    dispatch(getDataEntities());
  }, [dispatch]);

  useEffect(() => {
    const inputs = [name, password, email, roleId, ministriesId, entitiesId, phone, jopTitle, Address_id];
    const nonEmptyCount = inputs.reduce((count, input) => count + (input ? 1 : 0), 0);
    setValue(nonEmptyCount * 11.5);
  }, [name, Address_id, password, email, roleId, ministriesId, entitiesId, phone, jopTitle]);

  useEffect(() => {
    if (editInfo) {
      setName(DataUsers?.user_name);
      setEmail(DataUsers?.email);
      setPhone(DataUsers?.phone_number);
      setPassword("");

      if (Ministries?.length && DataUsers?.ministres_id) {
        const findItem = Ministries?.find((item) => item?.id === DataUsers?.ministres_id);
        if (findItem) setMinistriesId(findItem);
      }

      if (Entities && DataUsers?.entities_id) {
        const findItem = Entities?.find((item) => item?.entities_id === DataUsers?.entities_id);
        if (findItem) setEntitiesId(findItem);
      }

      if (dataGroup?.length && DataUsers?.group_id) {
        const findItem = dataGroup?.find((item) => item?.id === DataUsers?.group_id);
        if (findItem) setRoleId(findItem);
      }

      if (DataGovernorate?.length && DataUsers?.address_id) {
        const findItem = DataGovernorate?.find((item) => item?.id === DataUsers?.address_id);
        if (findItem) setAddress_id(findItem);
      }

      if (DataJobTitle?.length && DataUsers?.job_id) {
        const findItem = DataJobTitle?.find((item) => item?.id === DataUsers?.job_id);
        if (findItem) setJopTitle(findItem);
      }
    }
  }, [open, DataGovernorate, DataJobTitle, DataUsers, Entities, dataGroup, editInfo, Ministries]);

  useEffect(() => {
    const dataFilter = Entities?.filter((item) => item?.ministries_id === ministriesId?.id);
    setFilterData(dataFilter);
  }, [Entities, ministriesId]);

  // Handlers
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleCheckboxChange = (id) => () => {
    setIsActive((prevState) =>
      prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id]
    );
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("entities_id", entitiesId?.entities_id || "");
      formData.append("ministries_id", ministriesId?.id || "");
      formData.append("name", name);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("address_id", Address_id?.id);
      formData.append("jopTitle", jopTitle?.id);
      formData.append("roleId", roleId?.id);
      formData.append("Add_Data", roles?.Add_Data_Users._id);
      formData.append("is_active", JSON.stringify(active));

      const response = await axios.post(
        `${BackendUrl}/api/registerUser`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      if (response) {
        toast(response?.data?.message);
        setName("");
        setPassword("");
        setEmail("");
        setEntitiesId("");
        setMinistriesId("");
        setPhone("");
        setRoleId("");
        setOpen(false);
        setRefreshButton((prev) => !prev);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("roleId", roleId?.id);
      formData.append("entities_id", entitiesId?.entities_id || "");
      formData.append("ministries_id", ministriesId?.id || "");
      formData.append("name", name);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("address_id", Address_id?.id);
      formData.append("dataId", DataUsers?.user_id);

      const response = await axios.post(
        `${BackendUrl}/api/userManagementEdit`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      if (response) {
        setRefreshButton((prev) => !prev);
        toast(response?.data?.message);
        setOpen(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      {isLoading && <Loader />}
      
      {editInfo ? (
        <MenuItem onClick={handleClickOpen} disableRipple>
          <ModeEditOutlined sx={{ color: "", fontSize: "20px" }} />
          <span className="ms-2">{t("edit")}</span>
        </MenuItem>
      ) : allUser ? (
        <BottomSend onClick={handleClickOpen} disableRipple>
          <Add /> {t("userManager.Authorized personnel information management")}
        </BottomSend>
      ) : (
        <BottomSend onClick={handleClickOpen} disableRipple>
          <Add /> {t("userManager.insert new user")}
        </BottomSend>
      )}

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{ padding: "0px" }}
      >
        <DialogContent>
          <AppBar sx={{ position: "absolute", background: maintheme?.iconColor }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <GridCloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" />
              <Button 
                autoFocus 
                color="inherit" 
                onClick={editInfo ? handleEdit : handleSubmit}
                startIcon={editInfo ? <Edit /> : <SaveIcon />}
              >
                {t(editInfo ? "saveChange" : "save")}
              </Button>
            </Toolbar>
          </AppBar>

          <Box sx={{ marginTop: "70px" }}>
            <Box className="container">
              <Box className="p-4">
                <PermissionSection>
                  <div className="d-flex justify-content-between">
                    <Header
                      title={t(editInfo ? "userManager.User information Edit" : "userManager.User information form")}
                      dir={rtl?.dir}
                    />
                  </div>
                  <ProgressContainer theme={theme}>
                    <BorderLinearProgress variant="determinate" value={value} />
                    <Typography variant="body2" color="text.secondary">
                      {`${Math.round(value)}%`}
                    </Typography>
                  </ProgressContainer>
                </PermissionSection>

                <FormContainer theme={theme}>
                  <Box className="mobilDisplay" sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {/* Left Column */}
                    <Box sx={{ flex: 1, minWidth: "300px", }}>
                      <CustomTextField
                        label={t("userManager.user name")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onClearClick={() => setName("")}
                        haswidth={true}
                        margin={"5px"}
                      />
                      
                      <CustomTextField
                        label={t("userManager.email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onClearClick={() => setEmail("")}
                        haswidth={true}
                        margin={"5px"}
                      />
                      
                      <CustomTextField
                        label={t("userManager.password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onClearClick={() => setPassword("")}
                        haswidth={true}
                        margin={"5px"}
                      />
                      
                      <CustomTextField
                        label={t("userManager.phon number")}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onClearClick={() => setPhone("")}
                        haswidth={true}
                        margin={"5px"}
                      />
                    </Box>

                    {/* Right Column */}
                    <Box sx={{ flex: 1, minWidth: "300px" }}>
                      <CustomeSelectField
                        label={t("userManager.Ministry name")}
                        value={ministriesId}
                        list={Ministries || []}
                        customGetOptionLabel={(option) => option?.ministries || ""}
                        onChange={(e, newValue) => setMinistriesId(newValue)}
                        onClearClick={() => setMinistriesId("")}
                        haswidth={true}
                        margin={"5px"}
                      />
                      
                      <CustomeSelectField
                        label={t("userManager.Entity name")}
                        value={entitiesId}
                        list={filterData || []}
                        customGetOptionLabel={(option) => option?.Entities_name || ""}
                        onChange={(e, newValue) => setEntitiesId(newValue)}
                        onClearClick={() => setEntitiesId("")}
                        haswidth={true}
                        margin={"5px"}
                      />
                      
                      <CustomeSelectField
                        label={t("userManager.Choosing user role")}
                        value={roleId}
                        list={dataGroup || []}
                        customGetOptionLabel={(option) => option?.group_name || ""}
                        onChange={(e, newValue) => setRoleId(newValue)}
                        onClearClick={() => setRoleId("")}
                        haswidth={true}
                        margin={"5px"}
                      />
                      
                      <CustomeSelectField
                        label={t("userManager.Entity address")}
                        value={Address_id}
                        list={DataGovernorate || []}
                        customGetOptionLabel={(option) => option?.governorate_name || ""}
                        onChange={(e, newValue) => setAddress_id(newValue)}
                        onClearClick={() => setAddress_id("")}
                        haswidth={true}
                        margin={"5px"}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <CustomeSelectField
                      label={t("userManager.Job title")}
                      value={jopTitle}
                      list={DataJobTitle || []}
                      customGetOptionLabel={(option) => option?.job_name || ""}
                      onChange={(e, newValue) => setJopTitle(newValue)}
                      onClearClick={() => setJopTitle("")}
                      haswidth={true}
                      margin={"5px"}
                    />
                  </Box>
                </FormContainer>

                <PermissionSection theme={theme} dir="rtl">
                  <Typography variant="h6" gutterBottom>
                    {t(" تحديد صلاحيات الت")}
                  </Typography>
                  
                  <FormGroup sx={{ mb: 3 }}>
                    {DataApplicationPermission?.map((item) => (
                      <FormControlLabel
                        key={item?.id}
                        control={
                          <Checkbox
                            checked={active?.includes(item?.id)}
                            onChange={handleCheckboxChange(item?.id)}
                          />
                        }
                        label={item?.name_applications}
                      />
                    ))}
                  </FormGroup>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={editInfo ? handleEdit : handleSubmit}
                      disabled={isLoading}
                      startIcon={editInfo ? <Edit /> : <SaveIcon />}
                      sx={{ flex: 1 }}
                    >
                      {t(editInfo ? "saveChange" : "save")}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      disabled={isLoading}
                      sx={{ flex: 1 }}
                    >
                      {t("close")}
                    </Button>
                  </Box>
                </PermissionSection>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default UserMangeForm;
