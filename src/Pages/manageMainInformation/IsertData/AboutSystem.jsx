import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import axios from "axios";
import CustomTextField from "../../../components/CustomTextField";
import Header from "../../../components/HeaderComponent";
import ShowDataAboutSystem from "../ShowData/AboutSystem";
import { BackendUrl } from "../../../redux/api/axios";
import { BottomSend } from "../../../utils/Content";
import { getToken } from "../../../utils/handelCookie";
import Loader from "../../../components/Loader";
function AboutSystem() {
  const { rtl } = useSelector((state) => state.language);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading,setLoading]=useState(false)
  const [aboutSystem, setAboutSystem] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("text", text);
      const response = await axios.post(
        `${BackendUrl}/api/aboutSystemAdd`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: getToken(),
          },
        }
      );
      if (response) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again later."
      );
    }finally{
      setLoading(false)
    }
  };
  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataAbout`, {
        headers: {
          authorization: getToken(),
        },
      });
      setAboutSystem(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    fetchAboutData();
  }, []);
  return (
    <div>
      {loading&&<Loader/>}
      <Header title="عن النظام" dir={rtl?.dir} />
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2, mt: 2, display: "flex", gap: 1 }} dir="rtl">
          <CustomTextField
            label="عنوان "
            haswidth
            value={title}
            required
            customWidth="100%"
            hasMultipleLine={false}
            paddingHorizontal="0px"
            onChange={(e) => setTitle(e.target.value)}
            onClearClick={() => setTitle("")}
          />
          <CustomTextField
            label="النص "
            haswidth
            value={text}
            required
            customWidth="100%"
            hasMultipleLine
            paddingHorizontal="0px"
            onChange={(e) => setText(e.target.value)}
            onClearClick={() => setText("")}
          />
        </Box>
      </form>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        {aboutSystem?.length !== 3 && (
          <BottomSend onClick={handleSubmit}>أدخال معلومات</BottomSend>
        )}
        <ShowDataAboutSystem />
      </Box>
    </div>
  );
}

export default AboutSystem;
