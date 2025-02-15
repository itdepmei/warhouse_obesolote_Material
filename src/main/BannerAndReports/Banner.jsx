import { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import logoUr from "../../assets/image/image.png";
import logoEgcs from "../../assets/image/Picture2.jpg";
import "./style.css";
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
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          className="banner-content"
          sx={{
            width: '100%',
            sx: { p: { xs: 2, md: 3 } },
          }}
        >
          <Box
            className="banner-header"
            dir="rtl"
            sx={{
              width: '100%',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              borderBottom: "2px solid rgba(0,0,0,0.06)",
              pb: 2,
              pt: 2,
            }}
          >
            <img
              src={logoUr}
              alt="Logo UR"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
            <Typography
              variant="h5"
              sx={{
                width: '100%',
                fontSize: {
                  xs: "16px",
                  sm: "20px",
                  md: "24px",
                },
                color: "text.primary",
                fontWeight: 700,
                textAlign: "center",
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              مرحبًا بكم في البنك الوطني للمواد الراكدة وبطيئة الحركة
            </Typography>
            <img
              src={logoEgcs}
              alt="Logo EGCS"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
          </Box>
          <Box 
            sx={{
              width: '100%',
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {bannerData?.map((item, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  width: '100%',
                  background: "rgba(0,0,0,0.02)",
                  borderRadius: "8px",
                  p: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(0,0,0,0.04)",
                    transform: "translateX(-4px)",
                  },
                }}
              >
                <Typography
                  dir="rtl"
                  sx={{
                    width: '100%',
                    fontSize: {
                      xs: "14px",
                      sm: "16px",
                      md: "18px",
                    },
                    color: "text.secondary",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  {item.content}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Banner;
