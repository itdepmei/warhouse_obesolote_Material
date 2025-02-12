import React from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Email,
  Phone,
  LocationOn,
  Inventory,
  Assessment,
  LocalShipping,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
// import logo from "../../../assets/image/images.jpg";
import logo from "../../../assets/image/1671635909.png";

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: "80vh",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
  color: "white",
  padding: theme.spacing(4),
  textAlign: "right",
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

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "right",
  height: "100%",
  borderRadius: theme.spacing(2),
  transition: "all 0.3s ease-in-out",
  border: "1px solid #e0e0e0",
  backgroundColor: "#E3F2FD",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 20px rgba(26, 35, 126, 0.2)",
    borderColor: "#0D47A1",
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: "#E3F2FD",
  color: "#1976D2",
  width: 60,
  height: 60,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  marginLeft: "auto",
}));

const StatsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: "#E3F2FD",
  textAlign: "center",
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  height: "100%",
  borderRadius: theme.spacing(2),
  background: "white",
  boxShadow: "none",
  border: "1px solid #e0e0e0",
}));

const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: "#0D47A1",
  color: "white",
  marginTop: "auto",
  textAlign: "right",
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  flexDirection: "row-reverse",
  "& .MuiSvgIcon-root": {
    color: "#90CAF9",
  },
}));

const SocialIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.1)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255,255,255,0.2)",
    transform: "translateY(-3px)",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
    fontSize: "20px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontSize: "1.2rem",
  textTransform: "none",
  background: "linear-gradient(45deg, #1976D2 30%, #2196F3 90%)",
  boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "linear-gradient(45deg, #0D47A1 30%, #1976D2 90%)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
  },
}));

export default function HomeWharhouse() {
  const { t } = useTranslation();

  const stats = [
    { number: "1000+", label: t("عميل نشط") },
    { number: "50+", label: t("مخزن مُدار") },
    { number: "99.9%", label: t("دقة في الجرد") },
    { number: "24/7", label: t("دعم فني") },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        paddingTop: "0px",
        marginTop: "0px",
      }}
      dir="rtl"
    >
      <HeroSection>
        <Container maxWidth="lg" >
          <Box
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ width: { xs: "70%", md: "50%" } }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                {t("نظام إدارة المخازن المتكامل")}
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.8,
                }}
              >
                {t(
                  "حل متكامل لإدارة المخازن بكفاءة عالية وتحكم كامل، يساعدك في تنظيم وإدارة مخزونك بطريقة ذكية وفعالة"
                )}
              </Typography>
              <StyledButton variant="contained" color="primary">
                {t("ابدأ الآن")}
              </StyledButton>
            </Box>
            <Box sx={{}}>
              <img
                src={logo}
                alt="logo"
                style={{
                  width: "250px",
                  height: "250px",
                  borderRadius: "10px",
                }}
              />
            </Box>
          </Box>
        </Container>
      </HeroSection>

      <StatsSection>
        {/* <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatCard>
                  <Typography
                    variant="h3"
                    color="primary"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </StatCard>
              </Grid>
            ))}
          </Grid>
        </Container> */}
      </StatsSection>

      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="right"
          gutterBottom
          fontWeight="bold"
          sx={{
            color: "#0D47A1",
            mb: 6,
          }}
        >
          {t("مميزات النظام")}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={0}>
              <FeatureIcon>
                <Inventory sx={{ fontSize: 32 }} />
              </FeatureIcon>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                color="#0D47A1"
              >
                {t("إدارة المخزون")}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                {t(
                  "إدارة شاملة للمخزون مع تتبع دقيق للكميات والمواقع وحركة البضائع"
                )}
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={0}>
              <FeatureIcon>
                <Assessment sx={{ fontSize: 32 }} />
              </FeatureIcon>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                color="#0D47A1"
              >
                {t("التقارير والتحليلات")}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                {t("تقارير تفصيلية وتحليلات متقدمة لاتخاذ قرارات مدروسة")}
              </Typography>
            </FeatureCard>
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <FeatureCard elevation={0}>
              <FeatureIcon>
                <LocalShipping sx={{ fontSize: 32 }} />
              </FeatureIcon>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                color="#0D47A1"
              >
                {t("إدارة الشحنات")}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                {t(
                  "تتبع وإدارة الشحنات بكفاءة عالية من نقطة الانطلاق حتى التسليم"
                )}
              </Typography>
            </FeatureCard>
          </Grid> */}
        </Grid>
      </Container>

      <Footer component="footer">
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                color="#90CAF9"
              >
                {t("عن النظام")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, opacity: 0.9, lineHeight: 1.8 }}
              >
                {t(
                  "نظام إدارة المخازن المتكامل هو حل متطور يساعد الشركات في إدارة مخزونها بكفاءة عالية"
                )}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <SocialIcon>
                  <Facebook />
                </SocialIcon>
                <SocialIcon>
                  <Twitter />
                </SocialIcon>
                <SocialIcon>
                  <LinkedIn />
                </SocialIcon>
                <SocialIcon>
                  <Instagram />
                </SocialIcon>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                color="#90CAF9"
              >
                {t("روابط سريعة")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": { color: "#90CAF9" },
                }}
              >
                {t("الرئيسية")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": { color: "#90CAF9" },
                }}
              >
                {t("المميزات")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": { color: "#90CAF9" },
                }}
              >
                {t("الأسعار")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": { color: "#90CAF9" },
                }}
              >
                {t("اتصل بنا")}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                color="#90CAF9"
              >
                {t("اتصل بنا")}
              </Typography>
              <ContactItem>
                <Typography>{t("support@warehouse-system.com")}</Typography>
                <Email />
              </ContactItem>
              <ContactItem>
                <Typography>+966 123 456 789</Typography>
                <Phone />
              </ContactItem>
              <ContactItem>
                <Typography>{t("العراق - بغداد")}</Typography>
                <LocationOn />
              </ContactItem>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

          <Typography
            variant="body2"
            textAlign="center"
            sx={{
              opacity: 0.8,
            }}
          >
            {t("جميع الحقوق محفوظة")} &copy; {new Date().getFullYear()}{" "}
            {t("نظام إدارة المخازن")}
          </Typography>
        </Container>
      </Footer>
    </Box>
  );
}
