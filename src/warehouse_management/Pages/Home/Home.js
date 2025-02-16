import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Inventory, Assessment } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/image/1671635909.png";

const WelcomeSection = styled(Box)(({ theme }) => ({
  minHeight: "100vh ",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #004d40 0%, #00796b 100%)",
  color: "white",
  padding: theme.spacing(4),
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('/warehouse-pattern.png') repeat",
    opacity: 0.1,
    pointerEvents: "none",
  },
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backdropFilter: "blur(10px)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateX(-5px)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
}));
const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  width: 50,
  height: 50,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
export default function HomeWharhouse() {
  const { t } = useTranslation();
  return (
    <div style={{ height: "100vh " }} dir="rtl" className="mt-0 pt-0">
      <WelcomeSection>
        <Container className="mt-0 pt-0">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  mb: 4,
                }}
              >
                {t("مرحباً بك في نظام إدارة المخازن المتكامل")}
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.8,
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                }}
              >
                {t("نظام متكامل يساعدك في إدارة مخزونك بكفاءة عالية وتحكم كامل")}
              </Typography>

              <Box sx={{ mt: 6 }}>
                <FeatureBox>
                  <FeatureIcon>
                    <Inventory sx={{ fontSize: 28 }} />
                  </FeatureIcon>
                  <Typography variant="h6">
                    {t("إدارة شاملة للمخزون مع تتبع دقيق للكميات والمواقع")}
                  </Typography>
                </FeatureBox>

                <FeatureBox>
                  <FeatureIcon>
                    <Assessment sx={{ fontSize: 28 }} />
                  </FeatureIcon>
                  <Typography variant="h6">
                    {t("تقارير تفصيلية وتحليلات متقدمة لدعم القرارات")}
                  </Typography>
                </FeatureBox>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                    animation: "pulse 2s infinite",
                  },
                }}
              >
                <img
                  src={logo}
                  alt="Warehouse Management System"
                  style={{
                    width: "280px",
                    height: "280px",
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </WelcomeSection>
    </div>
  );
}
