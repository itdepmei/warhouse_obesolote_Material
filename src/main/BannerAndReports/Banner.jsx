import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import logoUr from "../../assets/image/image.png";
import logoEgcs from "../../assets/image/Picture2.jpg";

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
    <div
      className="banner-container"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        backdropFilter: "blur(5px)",
        padding: "10px 20px",
        borderRadius: "8px",
        margin: "0 20px",
      }}
    >
      <div className="banner-content">
        <Box
          className="banner-slide"
          dir="rtl"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <img
            src={logoUr}
            alt="Logo UR"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
            }}
          />
          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },
              color: "text.primary",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            مرحبًا بكم في البنك الوطني للمواد الراكدة وبطيئة الحركة
          </Typography>
          <img
            src={logoEgcs}
            alt="Logo EGCS"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
            }}
          />
        </Box>
        {bannerData?.map((item, index) => (
          <Box
            key={index}
            className="banner-slide"
            dir="rtl"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                  md: "16px",
                },
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              {item.content}
            </Typography>
          </Box>
        ))}
      </div>
    </div>
  );
}

export default Banner;
