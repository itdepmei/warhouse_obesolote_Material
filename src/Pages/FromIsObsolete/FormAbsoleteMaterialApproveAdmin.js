import { useSelector } from "react-redux";
import "../style.css";
import FormApproveToRequest from "./ApproveListData.js";
import { useTranslation } from "react-i18next";
const FormObsoleteMaterialApproveAdmin = () => {
  
  const { roles } = useSelector((state) => state?.RolesData);
const {t}=useTranslation()
  return (
    <>
      <FormApproveToRequest
        urlFetcHData={"getDataStagnantMaterialsApproveAdmin"}
        pathApprove={"ApproveAdminMaterial"}
        title={t("Approval of material upload requests by the authorized person")}
        technicalSupport={false}
        approve_to_request={roles?.approve_admin_to_request._id}
        roles={roles}
      />
    </>
  );
};
export default FormObsoleteMaterialApproveAdmin;
