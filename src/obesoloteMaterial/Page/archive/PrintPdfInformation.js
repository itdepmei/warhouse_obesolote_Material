import { useState, useMemo, useRef } from "react";
import { Box, IconButton, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Print } from "@mui/icons-material";
import { BottomRoot, BottomSend } from "../../../utils/Content";
import { useReactToPrint } from "react-to-print";
import { formatDateYearsMonth } from "../../../utils/Function";
import PopupForm from "../../../components/PopupForm";
import { BackendUrFile } from "../../../redux/api/axios";
import Logo from "../../../components/Layout/logo";
import './PrintPdfInformation.css';

export default function PrintPdInformation({ dataMaterial }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const materialDetails = useMemo(
    () => [
      { label: "أسم المادة", value: dataMaterial?.name_material },
      { label: "التصنيف الرئيسي", value: dataMaterial?.main_Class_name },
      { label: "حالة المادة", value: dataMaterial?.state_name },
      { label: "نوع المادة", value: dataMaterial?.typ_material },
      {
        label: "تاريخ الشراء",
        value: formatDateYearsMonth(dataMaterial?.puchase_date),
      },
      { label: "أسم الوزارة المسلمة", value: dataMaterial?.ministry_name_from },
      { label: "أسم الجهة المسلمة", value: dataMaterial?.entity_name_from },
      { label: "أسم الوزارة المستلمة", value: dataMaterial?.ministry_name_buy },
      { label: "أسم الجهة المستلمة", value: dataMaterial?.entity_name_buy },
      { label: "الكمية المسلمة", value: dataMaterial?.Quantity_buy },
      { label: "رقم الهاتف", value: dataMaterial?.phone_number },
      { label: "العنوان", value: dataMaterial?.governorate_name },
      { label: "الوصف", value: dataMaterial?.description },
    ],
    [dataMaterial]
  );

  const renderFormContent = () => (
    <Box
      sx={{
        margin: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
      dir="rtl"
    >
      <div className="mt-4">
        <div ref={componentRef} className="print-content print-document">
          <div className="official-header">
            <img src={Logo} alt="Organization Logo" className="header-logo" />
            <h1 className="document-title">معلومات المادة الراكدة</h1>
            <div className="reference-number">Ref: {new Date().getFullYear()}-{String(Math.floor(Math.random() * 10000)).padStart(4, '0')}</div>
          </div>
          <div className="watermark">وثيقة رسمية</div>

          <ul className="material-details">
            {materialDetails.map((detail, index) => (
              <li key={index}>
                <span className="detail-label">{detail.label}:</span> 
                <span className="detail-value">{detail.value || "-"}</span>
              </li>
            ))}
          </ul>

          <div className="images-section">
            <h3>صور المادة</h3>
            <div className="image-grid">
              {dataMaterial?.images?.map((image, index) => (
                <div key={index} className="image-container">
                  <img src={`${BackendUrFile}/${image?.file_name}`} alt={`Material view ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="document-footer">
            <p>الموافقة:</p>
            <div className="signature-line"></div>
            <p>التاريخ: {new Date().toLocaleDateString('ar-IQ')}</p>
            <div className="official-stamp">
              ختم رسمي
            </div>
          </div>
        </div>
      </div>
    </Box>
  );

  const renderFormActions = () => (
    <>
      <BottomRoot onClick={() => setOpen(false)}>{t("close")}</BottomRoot>
      <BottomSend type="button" onClick={handlePrint}>
        {t("طباعة")}
      </BottomSend>
    </>
  );
  return (
    <div>
      <IconButton onClick={() => setOpen(true)} disableRipple>
        <Print style={{ fontSize: "3rem" }} />
      </IconButton>
      <PopupForm
        title={t("رفع كتاب المناقلة")}
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
