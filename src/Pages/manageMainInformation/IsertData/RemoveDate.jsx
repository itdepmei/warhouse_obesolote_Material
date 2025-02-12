import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import Header from "../../../components/HeaderComponent";
import { BottomSend } from "../../../utils/Content";
import axios from "axios";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "../../../components/CustomDatePicker";
import ShowRemoveDate from "../ShowData/showRemoveDate";
import { getToken } from "../../../utils/handelCookie";
import CustomTextField from "../../../components/CustomTextField";
import Loader from "../../../components/Loader";
function RemoveDate({ BackendUrl }) {
  const { rtl } = useSelector((state) => state?.language);
  const { t } = useTranslation();
  // State management
  const [removeDate, setRemoveDate] = useState("");
  const [loading, setLoading] = useState(false);
  // Handling form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Post day to the backend
      const response = await axios.post(
        `${BackendUrl}/api/RemoveRegister`,
        { day: removeDate }, // Send only the day
        {
          headers: {
            "Content-Type": "application/json",
            authorization: getToken(),
          },
        }
      );
      if (response && response.data) {
        toast.success(response.data.message);
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
  return (
    <div>
      {loading&&<Loader/>}
      <Header title={t("مدة الحذف ")} dir={rtl?.dir} />
      {/* Input fields */}
      <Box
        sx={{ mb: "20px", mt: "20px", display: "flex", gap: "10px" }}
        dir={rtl?.dir}
      >
        {/* Custom Date Picker */}

        <CustomTextField
          label={"عدد أيام الحذف"}
          haswidth={true}
          value={removeDate}
          required
          customWidth="100%"
          hasMultipleLine={false}
          paddingHorizontal={"0px"}
          readOnly={false}
          onChange={(e) => {
            setRemoveDate(e.target.value);
          }}
          onClearClick={() => {
            setRemoveDate("");
          }}
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
        <BottomSend className="me-3" onClick={handleSubmit} disabled={loading}>
          {loading ? t("loading") : t("save")}
        </BottomSend>
        <ShowRemoveDate BackendUrl={BackendUrl} />
      </div>
    </div>
  );
}
export default RemoveDate;
