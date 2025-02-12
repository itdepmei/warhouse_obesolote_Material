import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BottomSend } from "../../../utils/Content";
import { Box } from "@mui/material";
import CustomTextField from "../../../components/CustomTextField";
import Header from "../../../components/HeaderComponent";
import axios from "axios";
import { BackendUrl } from "../../../redux/api/axios";
import ShowDataBanner from "../ShowData/ShowBanner";
import { getToken } from "../../../utils/handelCookie";
import Loader from "../../../components/Loader";
function Banner() {
  const { rtl } = useSelector((state) => state?.language);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerData,setBannerData]=useState([])
  const [loading,setLoading]=useState(false)
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    try {
      const response = await axios({
        method: "post",
        url: `${BackendUrl}/api/BannerRegister`,
        headers: {
          "Content-Type": "application/json",
          authorization:getToken()
        },
        data: formData,
      });
      if (response && response.data) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }finally{
      setLoading(false)
    }
  };
  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataBanner`,{
        header:{
          authorization:getToken()
        }
      });
      setBannerData(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    fetchBannerData();
  }, []);
  return (
    <div>
      {loading&&<Loader/>}
      <Header title="أدخال أعلان" dir={rtl?.dir} />
      <form onSubmit={(e) => handleSubmit(e)}>
        <Box
          sx={{ mb: "20px", mt: "20px", display: "flex", gap: "10px" }}
          dir={"rtl"}
        >
          <CustomTextField
            label={"عنوان الاعلان"}
            haswidth={true}
            value={title}
            required
            customWidth="100%"
            hasMultipleLine={false}
            paddingHorizontal={"0px"}
            readOnly={false}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            onClearClick={() => {
              setTitle("");
            }}
          />
          <CustomTextField
            label={"الوصف"}
            haswidth={true}
            value={description}
            required
            customWidth="100%"
            hasMultipleLine={true}
            paddingHorizontal={"0px"}
            readOnly={false}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            onClearClick={() => {
              setDescription("");
            }}
          />
        </Box>
      </form>
      <div
        className="mt-3"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {
          bannerData.length !==2 &&
          <BottomSend className="me-3" onClick={(e) => handleSubmit(e)}>
          أدخال معلومات
        </BottomSend>
        }
        <ShowDataBanner />
      </div>
    </div>
  );
}
export default Banner;
