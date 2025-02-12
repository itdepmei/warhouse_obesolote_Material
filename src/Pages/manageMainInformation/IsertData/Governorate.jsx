import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import CustomTextField from "../../../components/CustomTextField";
import Header from "../../../components/HeaderComponent";
import { BottomSend } from "../../../utils/Content";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ShowGovernorate from "../ShowData/showGovernorate";
import { getToken } from "../../../utils/handelCookie";
import Loader from "../../../components/Loader";
function Governorate({ BackendUrl }) {
  const { rtl } = useSelector((state) => state?.language);
  const [governorateData, setGovernorateData] = useState({
    governorate_name: "",
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BackendUrl}/api/governorateRegister`,
        governorateData,
        { headers: { "Content-Type": "application/json",
          authorization:getToken() 
        }, }
      );
      if (response && response.data) {
        toast.success(response.data.message);
        setGovernorateData({ governorate_name: "" });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("unexpected_error"));
      }
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setGovernorateData({ ...governorateData, governorate_name: e.target.value });
  };
  return (
    <div>
      {loading&&<Loader/>}
      <Header title={t("enter_governorate")} dir={rtl?.dir} />
      <form onSubmit={handleSubmit}>
        <Box
          sx={{ mb: "20px", mt: "20px", display: "flex", gap: "10px" }}
          dir={rtl?.dir}
        >
          <CustomTextField
            label={t("governorate_name")}
            haswidth={true}
            value={governorateData.governorate_name}
            required
            customWidth="100%"
            hasMultipleLine={false}
            onChange={handleChange}
            onClearClick={() => setGovernorateData({ governorate_name: "" })}
          />
        </Box>
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
          <BottomSend
            className="me-3"
            type="submit"
            disabled={loading}
          >
            {loading ? t("loading") : t("save")}
          </BottomSend>
          <ShowGovernorate/>
        </div>
      </form>
    </div>
  );
}

export default Governorate;
