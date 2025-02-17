import { Architecture, Archive, HdRounded, Home, Info, InfoOutlined, PersonAddAlt1, Warehouse } from "@mui/icons-material";
import {
  IconButton,
  Menu,
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiSolidCategory } from "react-icons/bi";
import AppsIcon from "@mui/icons-material/Apps";
function OtherApplication({ navigate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuItems = [
    { label: t("نظام المخازن"), path: "warehouse-management", iconName: <Warehouse /> },
    {
      label: t("نظام المواد الراكدة وبطيئة الحركة"),
      path: "stagnant-materials",
      iconName: <BiSolidCategory style={{ fontSize: "24px" }} />,
    },
    // { label: t("نظام الارشفة"), path: "archive-management", iconName: <Archive /> },
    // {
    //   label: t(" نظام اموارد البشرية"),
    //   path: "human-resources",
    //   iconName: <PersonAddAlt1 style={{ fontSize: "24px" }} />,
    // },
    // { label: t("نظام الرواتب"), path: "salary-management", iconName: <Archive /> },
  
  ];

  return (
    <>
      <IconButton
        id="apps-button"
        aria-controls={open ? "apps-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          borderRadius: "12px",
          padding: "8px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <AppsIcon />
      </IconButton>

      <Menu
        id="apps-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "apps-button",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            padding: 2,
            borderRadius: 2,
            width: "320px",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Grid container spacing={1}>
          {menuItems.map(
            (page, index) =>
              page.label &&
              page.path && (
                <Grid item xs={6} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={() => {
                      // window.location.href = page.path;
                      navigate(page.path);
                      handleClose();
                    }}
                  >
                    <Box sx={{ mb: 1 }}>{page.iconName}</Box>
                    <Typography variant="body2" align="center">
                      {page.label}
                    </Typography>
                  </Paper>
                </Grid>
              )
          )}
        </Grid>
      </Menu>
    </>
  );
}

export default OtherApplication;
