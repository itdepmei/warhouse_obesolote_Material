import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Paper,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PopupForm from "../../../components/PopupForm";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendUrl } from "../../../redux/api/axios";
import { getToken } from "../../../utils/handelCookie";
import { setLanguage } from "../../../redux/LanguageState";
import { BottomRoot, BottomSend } from "../../../utils/Content";
import { Download } from "@mui/icons-material";
import Loader from "../../../components/Loader";
import DisplayInformationComponent from "./displayData";
import "./style.css";
import {
  exportData,
  exportData2,
  InformationMaterial,
  options,
} from "./ReportData";
import { hasPermission } from "../../../utils/Function";
export default function ReportModel({
  reportEntity,
  entity_id,
  user_id,
  wareHouseData,
  labData,
  factoryData,
  permissionData,
  roles,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setIsActive] = useState([]);
  const [activeWareHouse, setIsActivateWarehouse] = useState([]);
  const [ActiveLab, setActiveLab] = useState([]);
  const [activeFactory, setActiveFactory] = useState([]);
  const [activeMaterial, setIsActiveMaterial] = useState([]);
  const [selectDate, setSelectDate] = useState({ from: null, to: null });
  const [reportFormat, setReportFormat] = useState("pdf");
  const token = getToken();
  const [includes, setIncludes] = useState([]);
  const [activeTypeReport, setActiveTypReport] = useState([]);
  const [dateFrom, setdateFrom] = useState("");
  const [dateTo, setdateTo] = useState("");
  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);
  // select type report
  const handleCheckboxChange = (id) => () => {
    // If it's a report type (1, 2, or 3)
    if (["1", "2", "3"].includes(id)) {
      // Clear previous selections when changing report type
      setIsActive((prevState) => {
        const newState = prevState.filter(
          (itemId) => !["1", "2", "3"].includes(itemId)
        );
        return [...newState, id];
      });
      // Clear material selections when changing report type
      setIsActiveMaterial([]);
    } else {
      // For other checkboxes (warehouses, labs, factories)
      setIsActive((prevState) =>
        prevState.includes(id)
          ? prevState.filter((itemId) => itemId !== id)
          : [...prevState, id]
      );
    }
  };
  // handle check ware house
  const handleCheckboxChangeWarehouse = (id) => () => {
    setIsActivateWarehouse((prevState) =>
      prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id]
    );
  };
  // handel check factory
  const handleCheckboxChangeFactory = (id) => () => {
    setActiveFactory((prevState) =>
      prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id]
    );
  };
  // handel check lab
  const handleCheckboxChangeLab = (id) => () => {
    setActiveLab((prevState) =>
      prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id]
    );
  };
  // select information material
  const handleCheckboxChangeMaterial = (id) => () => {
    setIsActiveMaterial((prevState) =>
      prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id]
    );
    // Update informationMaterial state when checkbox changes
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (active.length === 0) {
      toast.error(t("يجب أختيار تقرير واحد على الاقل"));
      return;
    }
    setLoading(true);
    try {
      const selectedReports = exportData
        .filter((item) => active.includes(item?.id))
        .map((item) => item.id);
      const requestData = {
        reports: active,
        format: reportFormat,
        ifEntity: reportEntity,
        user_id,
        entity_id,
        activeMaterial,
        activeWareHouse,
        active,
        permissionIdToAlow: false,
      };
      if (selectDate?.from && selectDate?.to) {
        requestData.dateFrom = selectDate.from;
        requestData.dateTo = selectDate.to;

        setdateFrom(selectDate.from);
        setdateTo(selectDate.to);
      }
      if (hasPermission(roles?.allow_to_see_reports?._id, permissionData)) {
        requestData.activeFactory = activeFactory;
        requestData.ActiveLab = ActiveLab;
        requestData.permissionIdToAlow = true;
      }
      if (reportFormat === "displayData") {
        const response = await axios.get(
          `${BackendUrl}/api/getDataINforamaitionReportWarehouse`,
          {
            params: {
              ...requestData,
              activeMaterial,
            },
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response?.data) {
          const { includes, warehouseData, labInformation, factoryData } =
            response.data;
          setIncludes(includes || []);
          setIsActivateWarehouse(warehouseData || []);
          setActiveLab(labInformation || []);
          setActiveFactory(factoryData || []);
        } else {
          toast.error(t("Failed to fetch report data."));
        }
      } else {
        const endpoint = `${BackendUrl}/api/exportDataWarehouse`;
        const response = await axios.post(endpoint, requestData, {
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        });
        if (response?.data) {
          const fileType =
            reportFormat === "pdf"
              ? "application/pdf"
              : reportFormat === "word"
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : "application/vnd.ms-excel";
          const fileExtension =
            reportFormat === "pdf"
              ? ".pdf"
              : reportFormat === "word"
              ? ".docx"
              : ".xlsx";
          const blob = new Blob([response.data], { type: fileType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `report_${new Date().toISOString()}${fileExtension}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          toast.success(t("Report downloaded successfully!"));
        } else {
          toast.error(t("Failed to generate report."));
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const hasData =
    includes.length > 0 ||
    activeFactory.length > 0 ||
    activeMaterial.length > 0 ||
    activeTypeReport.length > 0 ||
    activeWareHouse.length > 0 ||
    ActiveLab.length > 0;
  const renderFormContent = () => (
    <Box elevation={3} sx={{ p: 3, m: 2 }} dir="rtl">
      <Grid container spacing={3}>
        {/* Report Format Selection */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("صيغ التقرير")}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option?.value}
                    value={option?.value}
                    control={<Radio />}
                    label={option?.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
        {/* Report Type Selection */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("نوع التقرير")}
            </Typography>
            <FormGroup>
              {exportData2?.map((item) => (
                <FormControlLabel
                  key={item?.id}
                  control={
                    <Checkbox
                      checked={active?.includes(item?.id)}
                      onChange={handleCheckboxChange(item?.id)}
                    />
                  }
                  label={item?.label}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        {/* Conditional Rendering based on Report Type */}
        {active.includes("1") && (
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t("المخازن المتاحة")}
              </Typography>
              <FormGroup>
                {wareHouseData?.map((item) => (
                  <FormControlLabel
                    key={item?.id}
                    control={
                      <Checkbox
                        checked={activeWareHouse?.includes(item?.id)}
                        onChange={handleCheckboxChangeWarehouse(item?.id)}
                      />
                    }
                    label={item?.name}
                  />
                ))}
              </FormGroup>
            </Paper>
          </Grid>
        )}

        {active.includes("2") &&
          hasPermission(roles.allow_to_see_reports._id, permissionData) && (
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t("المعامل المتاحة")}
                </Typography>
                <FormGroup>
                  {labData?.map((item) => (
                    <FormControlLabel
                      key={item?.id}
                      control={
                        <Checkbox
                          checked={ActiveLab?.includes(item?.id)}
                          onChange={handleCheckboxChangeLab(item?.id)}
                        />
                      }
                      label={item?.Laboratory_name}
                    />
                  ))}
                </FormGroup>
              </Paper>
            </Grid>
          )}

        {active.includes("3") &&
          hasPermission(roles?.allow_to_see_reports?._id, permissionData) && (
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t("المصانع المتاحة")}
                </Typography>
                <FormGroup>
                  {factoryData?.map((item) => (
                    <FormControlLabel
                      key={item?.factory_id}
                      control={
                        <Checkbox
                          checked={activeFactory?.includes(item?.factory_id)}
                          onChange={handleCheckboxChangeFactory(
                            item?.factory_id
                          )}
                        />
                      }
                      label={item?.Factories_name}
                    />
                  ))}
                </FormGroup>
              </Paper>
            </Grid>
          )}

        {/* Information Material Section */}
        {active.length > 0 && (
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t("معلومات المواد")}
              </Typography>
              <FormGroup>
                {InformationMaterial?.map((item) => (
                  <FormControlLabel
                    key={item?.id}
                    control={
                      <Checkbox
                        checked={activeMaterial?.includes(item?.id)}
                        onChange={handleCheckboxChangeMaterial(item?.id)}
                      />
                    }
                    label={item?.label}
                  />
                ))}
              </FormGroup>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>
      </Grid>
    </Box>
  );

  const renderFormActions = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        width: "100%",
        p: 2,
      }}
    >
      <BottomSend
        type="submit"
        onClick={handleSubmit}
        sx={{ minWidth: "120px" }}
      >
        {t("تنزيل التقارير")} <Download sx={{ ml: 1 }} />
      </BottomSend>

      {hasData && (
        <DisplayInformationComponent
          includes={includes}
          activeFactory={factoryData}
          activeTypeReport={activeTypeReport}
          ActiveLab={ActiveLab}
          activeMaterial={activeMaterial}
          activeWareHouse={activeWareHouse}
        />
      )}
      <BottomRoot onClick={() => setOpen(false)} sx={{ minWidth: "120px" }}>
        {t("close")}
      </BottomRoot>
    </Box>
  );
  return (
    <div>
      {loading && <Loader />}
      <BottomSend
        onClick={() => setOpen(true)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          mb: 2,
        }}
      >
        {t("التقرير")} <Download />
      </BottomSend>

      <PopupForm
        title={t("dashboard.DownloadReport")}
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        width="100%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
