import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PopupForm from "../../../../components/PopupForm";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendUrl } from "../../../../redux/api/axios";
import { getToken } from "../../../../utils/handelCookie";
import { setLanguage } from "../../../../redux/LanguageState";
import { BottomRoot, BottomSend } from "utils/Content";
import { Download } from "@mui/icons-material";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import Loader from "components/Loader";
import DisplayInformationComponent from "./displayData";
import { green, pink } from "@mui/material/colors";
import "./style.css";
import {
  exportData,
  exportData2,
  InformationSelectMaterial,
  InformationSelectUser,
  options,
  ReportCheckboxGroup,
} from "../../../../utils/ReportData";
export default function ReportModel({ reportEntity, entity_id, user_id }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { roles } = useSelector((state) => state?.RolesData);
  const [loading, setLoading] = useState(false);
  const [active, setIsActive] = useState([]); // Active checkboxes
  const [activeUser, setIsActiveUser] = useState([]); // Active checkboxes
  const [activeMaterial, setIsActiveMaterial] = useState([]); // Active checkboxes
  const [selectDate, setSelectDate] = useState({ from: null, to: null });
  const [reportFormat, setReportFormat] = useState("pdf");
  const [checked, setChecked] = useState([true, false]);
  const token = getToken();
  const [userData, setUserData] = useState([]);
  const [includes, setIncludes] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [materialData, seTMaterialsData] = useState([]);
  const [informationUser, setInformationUser] = useState([]);
  const [informationMaterial, setInformationMaterial] = useState([]);
  const [mainClassesDataAndSubClass, setMainClassesDataAndSubClass] = useState(
    []
  );
  const [materialOfDataWithinGivenData, setMaterialOfDataWithinGivenData] =
    useState([]);
  const [materialsBookedData, setMaterialsBookedData] = useState([]);
  const [dateFrom, setdateFrom] = useState("");
  const [dateTo, setdateTo] = useState("");
  const [AddDataPermission, SetAddDataPermission] = useState(roles.show_statistics._id);

  // Set language on mount
  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);
  let dataExport;
  switch (reportEntity) {
    case true:
      dataExport = exportData2;
      break;
    case false:
      dataExport = exportData;
      break;
    default:
      dataExport = [];
      break;
  }
  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };
  const handleCheckboxChange = (id) => () => {
    setIsActive((prevState) => {
      return prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id];
    });
  };
  const handleCheckboxChangeUser = (id) => () => {
    setIsActiveUser((prevState) => {
      return prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id];
    });
  };
  const handleCheckboxChangeMaterial = (id) => () => {
    setIsActiveMaterial((prevState) => {
      return prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id];
    });
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
        .map((item) => item.value);
      const selectedDataUser = InformationSelectUser?.filter((item) =>
        activeUser.includes(item?.id)
      ).map((item) => item.value);
      const selectedDataMaterial = InformationSelectMaterial?.filter((item) =>
        activeMaterial.includes(item?.id)
      ).map((item) => item?.value);
      const requestData = {
        reports: selectedReports,
        dataUser: selectedDataUser,
        dataMaterial: selectedDataMaterial,
        format: reportFormat,
        ifEntity: reportEntity,
        user_id,
        entity_id,
      };
      
      // Add date range if applicable
      if (selectDate?.from && selectDate?.to) {
        requestData.dateFrom = selectDate.from;
        requestData.dateTo = selectDate.to;
      }
      // If the format is to display data
      if (reportFormat === "displayData") {
        const reports = selectedReports.join(",");
        // API call to fetch report data
        const response = await axios.get(
          `${BackendUrl}/api/getDataINforamaitionReport`,
          {
            params: {
              selectedReports: reports,
              ifEntity: reportEntity,
              dateFrom: selectDate.from,
              dateTo: selectDate.to,
              entity_id: entity_id,
              dataUser: selectedDataUser,
              dataMaterial: selectedDataMaterial,
            },
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response?.data) {
          // Store fetched data in corresponding states
          setUserData(response?.data?.usersData || []);
          setMinistries(response?.data?.ministriesData || []);
          seTMaterialsData(response?.data?.materialsData || []);
          setMainClassesDataAndSubClass(response?.data?.mainClassesData || []);
          setMaterialOfDataWithinGivenData(
            response?.data?.materialOfDataWithinGivenData || []
          );
          setMaterialsBookedData(response?.data?.materialsBookedData || []);
          setIncludes(reports || []);
          setInformationMaterial(selectedDataMaterial || []);
          setInformationUser(selectedDataUser || []);
          setdateFrom(response.data.dateForm || []);
          setdateTo(response.data.dateTo || []);

          // toast.success(t("D!"));
        } else {
          toast.error(t("Failed to fetch report data."));
        }
      } else {
        // File download logic
        const endpoint = `${BackendUrl}/api/exportData`;
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
      toast.error(t("An error occurred while processing the report."));
    } finally {
      setLoading(false);
    }
  };
  const hasData =
    includes.length > 0 ||
    userData.length > 0 ||
    ministries.length > 0 ||
    materialData.length > 0 ||
    mainClassesDataAndSubClass.length > 0 ||
    materialsBookedData.length > 0 ||
    materialOfDataWithinGivenData.length > 0;
  const renderFormContent = () => (
    <Box component="form" sx={{ margin: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "10px",
        }}
        dir="rtl"
      >
        <Box>
          <FormControl>
            <RadioGroup
              aria-labelledby="report-format-radio-buttons-group-label"
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
        </Box>
        <FormGroup>
          {dataExport?.map((item) => (
            <FormControlLabel
              key={item?.id}
              control={
                <Checkbox
                  checked={active?.includes(item?.id)}
                  onChange={handleCheckboxChange(item?.id)}
                />
              }
              label={item.label}
            />
          ))}
        </FormGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          marginTop: "10px",
          flexWrap: "wrap",
          gap: "5px",
        }}
        dir="rtl"
      >
        {active?.includes("1") && (
          <ReportCheckboxGroup
            items={InformationSelectUser}
            activeItems={activeUser}
            handleChange={handleCheckboxChangeUser}
            handleChange1={handleChange1}
            checked={checked}
            setChecked={setChecked}
            color={pink}
          />
        )}
        {(active?.includes("3") || active.includes("5")) && (
          <ReportCheckboxGroup
            items={InformationSelectMaterial}
            activeItems={activeMaterial}
            handleChange={handleCheckboxChangeMaterial}
            handleChange1={handleChange1}
            checked={checked}
            setChecked={setChecked}
            color={green}
          />
        )}
        {active?.includes("5") && (
          <div style={{}} dir="ltr">
            <div className="mb-4">
              <CustomDatePicker
                label="من"
                value={selectDate.from}
                setValue={(date) =>
                  setSelectDate((prev) => ({ ...prev, from: date }))
                }
              />
            </div>
            <div>
              <CustomDatePicker
                label="الى"
                value={selectDate.to}
                setValue={(date) =>
                  setSelectDate((prev) => ({ ...prev, to: date }))
                }
              />
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
  const renderFormActions = () => (
    <div className="d-flex justify-content-between gap-2 w-100">
      <BottomSend type="submit" onClick={handleSubmit}>
        {t("تنزيل التقارير")}
      </BottomSend>
      {hasData && (
        <DisplayInformationComponent
          includes={includes}
          usersData={userData}
          ministriesData={ministries}
          materialsData={materialData}
          mainClassesData={mainClassesDataAndSubClass}
          materialsBookedData={materialsBookedData}
          materialOfDataWithinGivenData={materialOfDataWithinGivenData}
          informationMaterial={informationMaterial}
          informationUser={informationUser}
          dateForm={dateFrom}
          dateTo={dateTo}
        />
      )}
      <BottomRoot onClick={() => setOpen(false)}>{t("close")}</BottomRoot>
    </div>
  );
  return (
    <div>
      {loading && <Loader />}
      <BottomSend
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-lg btn-block"
      >
        {t("التقرير")} <Download />
      </BottomSend>
      <PopupForm
        title={t("dashboard.DownloadReport")}
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        width="75%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
