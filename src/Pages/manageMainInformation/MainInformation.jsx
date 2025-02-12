import "./style.css";
import { Paper, useTheme } from "@mui/material";
import Minstries from "./IsertData/InsertMinstries";
import RoleSystem from "./IsertData/Role";
import PermissionData from "./IsertData/permissionData";
import Entities from "./IsertData/insertEntitities";
import { Slide, ToastContainer } from "react-toastify";
import MainClass from "./IsertData/MainClass";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import StatMaterial from "./IsertData/InsertStatMaterial";
import Banner from "./IsertData/Banner";
import Governorate from "./IsertData/Governorate";
import HederLineComponent from "../../components/HederLineComponent";
import AboutSystem from "./IsertData/AboutSystem";
import { BackendUrl } from "../../redux/api/axios";
import UnitMeasuring from "Pages/manageMainInformation/IsertData/UnitMeasuring";
import SubClass from "./SubClassAndUnit/SubClass";
import JobTitle from "./IsertData/JopTitile";
import RemoveDate from "./IsertData/RemoveDate";
import { useEffect, useState } from "react";
import { getDataUserById } from "../../redux/userSlice/authActions";
import { getToken } from "../../utils/handelCookie";
import { getRoleAndUserId } from "../../redux/RoleSlice/rolAction";
import { hasPermission } from "utils/Function";
import UserGuid from "./IsertData/userGuid";
function MainInformation() {
  const { rtl } = useSelector((state) => state?.language);
  const { dataUserById } = useSelector((state) => {
    return state?.user;
  });
  const { Permission, roles } = useSelector((state) => state?.RolesData);
  const theme = useTheme();
  const [permissionData, setPermissionData] = useState([]);
  const dispatch = useDispatch();
  const token = getToken();
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(getDataUserById(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (Permission?.permission_id) {
      try {
        const parsedData = JSON.parse(Permission?.permission_id);
        setPermissionData(parsedData);
      } catch (error) {
        console.error("Error parsing permission_id:", error);
      }
    }
  }, [Permission]);
  useEffect(() => {
    const userId = dataUserById?.user_id;
    if (userId) {
      dispatch(getRoleAndUserId({ userId, token }));
    }
  }, [dispatch, dataUserById?.user_id, token]);
  // Components data with titles and corresponding components
  const componentsData = [
    { title: t("Institutions"), component: <Minstries theme={theme} t={t} /> },
    {
      title: t("mainIformation.Beneficiary Entities"),
      component: <Entities theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
    {
      title:t("mainIformation.Governors"),
      component: <Governorate theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
    { title:t("Stagnant.measuringUnit"), component: <UnitMeasuring /> },
    {
      title:t("mainIformation.SystemInformation"),
      component: <AboutSystem theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
    {
      title: "ألاعلانات",
      component: <Banner theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
    {
      title: "معلومات المادة",
      component: <StatMaterial theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
    {
      title: "الفئة الرئيسية",
      component: <MainClass theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
    {
      title: "الفئة الفرعية",
      component: <SubClass theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
    {
      title: "تاريخ حذف الحجز",
      component: <RemoveDate theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
    {
      title: "العناوين الوظيفية",
      component: <JobTitle theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
    {
      title: "أظافة معلومات دليل الالستخدام",
      component: <UserGuid theme={theme} t={t} BackendUrl={BackendUrl} />,
    },
  ];
  // Check permissions and conditionally add additional components
  if (hasPermission(roles?.management_permission?._id, permissionData)) {
    const arrayPermission = [
      {
        title: "النظام الوظيفي",
        component: <RoleSystem theme={theme} t={t} BackendUrl={BackendUrl} />,
      },
      {
        title: "إعدادات الصلاحيات",
        component: <PermissionData theme={theme} t={t} BackendUrl={BackendUrl} />,
      },
    ];
    componentsData.push(...arrayPermission); // Use spread operator to add items individually
  }
  return (
    <>
      <div className="vh-100" style={{ position: "relative" }}>
        <ToastContainer
          containerId="container_toast_id"
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          transition={Slide}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div
          style={{
            width: "70%",
            position: "absolute",
            left: "50%",
            transform: "translate(-50%)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {componentsData.map((item, index) => (
            <div key={index}>
              <HederLineComponent title={item.title} />
              <Paper
                sx={{
                  flexGrow: 1,
                  minWidth: "333px",
                  p: 1.5,
                }}
                dir={rtl?.dir}
              >
                {item.component}
              </Paper>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MainInformation;
