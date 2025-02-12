import { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import { BottomRoot } from "../../utils/Content";
import PopupForm from "../../components/PopupForm";
import { Info } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import { formatDateYearsMonth, getFileIcon } from "../../utils/Function";
export default function InformationMaterialBooked(materialInfo) {
  const theme = useTheme();
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const { t } = useTranslation();
  const renderListItem = (label, value, weight = "") => (
    <li
      className="list-group-item d-flex justify-content-between align-items-center px-0"
      style={{
        background:
          theme?.palette?.mode === "dark"
            ? maintheme?.lightblack
            : maintheme?.paperColor,
        color:
          theme?.palette?.mode === "dark" ? maintheme?.paperColor : "#000000",
        fontWeight: weight,
      }}
    >
      {label}
      <span>{value}</span>
    </li>
  );
  const renderFormContent = () => (
    <Box>
      <div className="row d-flex justify-content-center my-4">
        {/* Images Section */}
        <div className="col-md-8">
          <div
            className="card-profile mb-4"
            style={{
              background:
                theme?.palette?.mode === "dark"
                  ? maintheme?.lightblack
                  : maintheme?.paperColor,
            }}
          >
            <div className="card-body d-flex justify-content-center align-items-center gap-3 flex-wrap">
              <div>{getFileIcon(materialInfo?.materialInfo?.file_name, "_", "edit")}</div>
            </div>
          </div>
        </div>
        {/* Information Section */}
        <div className="col-md-4">
          <div
            className="card-profile mb-4"
            style={{
              width: "100%",
              background:
                theme?.palette?.mode === "dark"
                  ? maintheme?.lightblack
                  : maintheme?.paperColor,
            }}
          >
            <div className="card-body">
              <ul className="list-group list-group-flush" dir="rtl">
                {renderListItem(
                  t("MaterialOverview.Material Name"),
                  materialInfo?.materialInfo?.name_material
                )}
                {renderListItem(
                  t("MaterialOverview.purchase date"),
                  formatDateYearsMonth(materialInfo?.materialInfo?.puchase_date)
                )}
                {renderListItem(
                  t("MaterialOverview.ministry name"),
                  materialInfo?.materialInfo?.ministries
                )}
                {renderListItem(
                  t("MaterialOverview.entity name"),
                  materialInfo?.materialInfo?.Entities_name
                )}
                 {renderListItem(
                  t("الكمية التي تم حجزها"),
                    materialInfo?.materialInfo?.quantity
                )}
                {renderListItem(
                  t("MaterialOverview.phone Number"),
                  materialInfo?.materialInfo?.phone_number,
                  "build"
                )}
                {renderListItem(
                  t("MaterialOverview.Address"),
                  materialInfo?.materialInfo?.address,
                  "bold"
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
  const renderFormActions = () => (
    <>
      <BottomRoot onClick={handleClose}>{t("close")}</BottomRoot>
    </>
  );
  return (
    <div>
      <MenuItem onClick={handleOpen} disableRipple>
        <Info size="large" style={{ color: "#1e6a99" }} />
        <span className="ms-2">{t("Material Information")}</span>
      </MenuItem>
      <PopupForm
        title={t("!معلومات الطلب المرسل")}
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="100%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
