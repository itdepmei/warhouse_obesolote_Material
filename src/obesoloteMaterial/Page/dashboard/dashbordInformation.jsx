import React, { useEffect } from "react";
import Row1 from "./Row1";
import { Box, Stack, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../../redux/LanguageState";
import Header from "components/HeaderComponent";
import ReportModel from "./Report/ReportModel";
const DashboardInformation = ({ headerText, reportEntity,entity_id }) => {
  const { rtl } = useSelector((state) => {
    // @ts-ignore
    return state?.language;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <div
      style={{ width: "100%", maxWidth: "100%", marginTop: "10px" }}
      className="container"
      dir={`${rtl?.dir}`}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        dir={`${rtl?.dir}`}
      >
        <Header
          isDashboard={true}
          title={headerText}
          // subTitle={t("dashboard.subTitle")}
        />

        <Box sx={{ textAlign: "right", mb: 1.3 }}>
          <ReportModel reportEntity={reportEntity} entity_id={entity_id} />

        </Box>
      </Stack>
      <Box>
        {" "}
        <Row1 reportEntity={reportEntity} entity_id={entity_id}/>
      </Box>
      {/* <Box sx={{ mt: "10px" }}>
        <Row3 />
      </Box> */}
    </div>
  );
};

export default DashboardInformation;
