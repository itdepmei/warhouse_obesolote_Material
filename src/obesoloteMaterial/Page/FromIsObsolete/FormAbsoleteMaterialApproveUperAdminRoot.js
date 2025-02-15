import { useSelector } from "react-redux";
import "../style.css";
import FormApproveToRequest from "./ApproveListData.js";
import { useTranslation } from "react-i18next";
const FormObsoleteMaterialApproveAdmin = () => {
  const { roles } = useSelector((state) => state.RolesData);
  const {t}=useTranslation()
  return (
    <>
      <FormApproveToRequest
        urlFetcHData={"getDataStagnantMaterialsApproveSuperAdminRoot"}
        pathApprove={"ApproveSuperAdminMaterial"}
        title={t("Approval of material upload requests by the platform administrators")}
        approve_to_request={roles?.approve_Super_admin_root_to_request?._id}
        technicalSupport={true}
        roles={roles}
      />
    </>
  );
};
export default FormObsoleteMaterialApproveAdmin;
