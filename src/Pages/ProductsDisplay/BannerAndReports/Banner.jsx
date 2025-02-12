import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import logoUr from "../../../assets/image/image.png";
import logoEgcs from "../../../assets/image/Picture2.jpg";
function Banner({ BackendUrl }) {
  const [bannerData, setBannerData] = useState([]);
  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataBanner`);
      setBannerData(response?.data?.response || []);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    fetchBannerData();
  }, []);
  return (
    <div className="banner-container mt-0 pt-0">
      <div className="banner-content">
        <Box className="banner-slide" dir="rtl">
          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                sm: "16px",
              },
              color: "black",
              fontWeight: "build",
            }}
          >
            <span>
              <img src={logoUr} width={"30px"} style={{ marginLeft: "5px" }} />
            </span>
            مرحبًا بكم في البنك الوطني للمواد الراكدة وبطيئة الحركة
            <span className="" style={{ color: "#F9C74F" }}></span>
            <img src={logoEgcs} width={"30px"} style={{ marginRight: "5px" }} />
          </Typography>
        </Box>
        {bannerData &&
          bannerData?.map((item, index) => (
            <Box key={index} className="banner-slide" dir="rtl">
              <Typography
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "16px",
                  },
                  color: "black",
                  fontWeight: "build",
                }}
              >
                <span className="" style={{ color: "#F9C74F" }}>
                  {item?.title}
                </span>
                {item?.description_banner}
              </Typography>
            </Box>
          ))}
      </div>
    </div>
  );
}

export default Banner;
