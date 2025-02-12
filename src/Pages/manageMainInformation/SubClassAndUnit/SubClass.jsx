import { Box, Slide } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomTextField from "../../../components/CustomTextField";
import "../style.css";
import { BottomSend } from "../../../utils/Content";
import Header from "../../../components/HeaderComponent";
import SubClassList from "./ShowDataUnitAndSubClass";
import CustomeSelectField from "../../../components/CustomeSelectField";
import { BackendUrl } from "../../../redux/api/axios";
import { getToken } from "utils/handelCookie";
import { getDataUserById } from "../../../redux/userSlice/authActions";
import Loader from "../../../components/Loader";
function SubClass({ dataSubClass, setRefreshButton }) {
  const { rtl } = useSelector((state) => state?.language);
  const [open, setOpen] = useState(false);
  const { dataUserById } = useSelector((state) => {
    return state.user;
  });
  const [dataMainClass, setDataMainClass] = useState([]);
  const token = getToken();
  const { t } = useTranslation();
  const [selectMainClass, setSelectMainClass] = useState("");
  const [subClassName, setSubClassName] = useState("");
  const [loading,setLoading]=useState(false)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDataUserById(token));
  }, [dispatch, getToken]);
  const handleSubmitSubClass = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("subClassName", subClassName);
    formData.append("entities_id", dataUserById?.entity_id);
    formData.append("mainClass_id", selectMainClass?.mainClass_id);
    try {
      const response = await axios({
        method: "post",
        url: `${BackendUrl}/api/subClassRegister`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: token,
        },
        data: formData,
      });
      if (response && response.data) {
        toast.success(response.data.message);
        setSubClassName("");
        setSelectMainClass("");
        setRefreshButton((prv) => !prv);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.log("An unexpected error occurred. Please try again later.");
      }
    }finally{
      setLoading(false)
    }
  };

  const fetchMainClassData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataMainClass`, {
        headers: {
          token: token,
        },
      });
      setDataMainClass(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  React.useEffect(() => {
    fetchMainClassData();
  }, [open]);
  return (
    <div >
      {loading&&<Loader/>}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="form-outline mb-3  w-100" dir={rtl?.dir}>
          <form onSubmit={handleSubmitSubClass} className="">
            <Header title={t("Subclass of the main class")} dir={rtl?.dir} />
            <Box sx={{ mb: "15px" }}>
              <CustomeSelectField
                label={"أختيار  الصنف الرئيسي"}
                haswidth={true}
                value={selectMainClass}
                hasMultipleLine={true}
                customPadding={"0px"}
                list={dataMainClass ? dataMainClass : []}
                customGetOptionLabel={(option) => option?.main_Class_name || ""}
                multiple={false}
                required
                readOnly={false}
                onChange={(e, newValue) => {
                  setSelectMainClass(newValue);
                }}
                onClearClick={() => {
                  setSelectMainClass("");
                }}
              />
            </Box>
            <Box sx={{ mb: "15px" }}>
              <CustomTextField
                label="الصنف الخاص بالرئيسي"
                haswidth={true}
                value={subClassName}
                hasMultipleLine={true}
                paddingHorizontal="0px"
                required
                readOnly={false}
                onChange={(e) => {
                  setSubClassName(e.target.value);
                }}
                onClearClick={() => {
                  setSubClassName("");
                }}
              />
            </Box>
          </form>
          <div className="d-flex justify-content-center gap-4">
            <BottomSend onClick={handleSubmitSubClass}>حفظ البيانات</BottomSend>
            <SubClassList
              dataSubClass={dataSubClass}
              dataMainClass={dataMainClass}
              setOpen1={setOpen}
            />
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SubClass;
