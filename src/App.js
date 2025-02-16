import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageNotFound from "./middleware/PageNotFound";
import Unauthorized from "./middleware/Unauthorized";
import Login from "./Auth/login";
import PrivateRoutes from "./middleware/praivetRout";
import ProtectedApplicationRoute from "./middleware/ProtectedApplicationRoute";
import "./style/fremwork.css";
import Pages from "./obesoloteMaterial/Page/pages";
import PersonalProfile from "./Auth/Profile/informationUser";
import AllCategory from "./obesoloteMaterial/Page/category/AllCategory";
import { useDispatch, useSelector } from "react-redux";
import React, { Suspense, useEffect, useState } from "react";
import { setscreenwidth } from "./redux/windoScreen/settingDataSlice";
import Aos from "aos";
import AboutPage from "./obesoloteMaterial/Page/home/AboutPage";
import HelpAboutProject from "./help/help";
import Loader from "components/Loader";
import ReactGA from "react-ga";
import GoogleAnalyticsTracker from "utils/GoogleAnalyticsTracker ";
import Dashboard from "./obesoloteMaterial/Page/dashboard/Dashboard";
import ApproveBooked from "./Notification/approveBooked";
import FormDeletedList from "./obesoloteMaterial/Page/FromIsObsolete/FormObsoleteList";
import FormObsoleteMaterialApproveSuperAdminRoot from "./obesoloteMaterial/Page/FromIsObsolete/FormAbsoleteMaterialApproveUperAdminRoot";
import ApproveAdmainTobsendRequestBooking from "./obesoloteMaterial/Page/FromIsObsolete/approveAdmainTobsendRequestBooking";
import MaterialOverview from "./obesoloteMaterial/Page/FromIsObsolete/MaterialOverview";
import UserManagementFromEntities from "./Pages/MangemantUsers/userMangemantFromEntitis";
import BookObsoleteMaterial from "./obesoloteMaterial/Page/FromIsObsolete/BookObsoleteMaterial";
import InformationMaterial from "./obesoloteMaterial/Page/archive/InformationMaterial";
import FormObsoleteMaterialApproveAdmin from "./obesoloteMaterial/Page/FromIsObsolete/FormAbsoleteMaterialApproveAdmin";
import RefreshButtonTemplate from "components/Layout/RefreshButtonTemplate";
import LoginWh from "Auth/loginWarehouse";
import HomeWharhouse from "warehouse_management/Pages/Home/Home";
import RootWarehouse from "warehouse_management/Layout/Root3";
import StoreData from "warehouse_management/Pages/managemnatStoreData/storeData";
import LabMinitoring from "warehouse_management/Pages/monitoringLabrarotory/LabMinitoring";
import Shipments from "warehouse_management/Pages/shipments";
import MaterialMovement from "warehouse_management/Pages/Inventory/materialMovment";
import PrintInventory from "warehouse_management/Pages/Inventory/PrintInventory";
import LabTabsWareHouse from "warehouse_management/Pages/managemantUserWarehouse/managemantGenrallSetting";
import WarehouseReport from "warehouse_management/Pages/Report/Report";
import WarehouseStorageManagement from "warehouse_management/Pages/managemantUserWarehouse/wherhouse";
import Inventory from "warehouse_management/Pages/Inventory/inventory";
import WarehouseNotification from "./warehouse_management/Pages/Notification/WarehouseNotifction";
import NotificationObsoletedMaterial from "./obesoloteMaterial/Page/Notification/NotificationObesoloteMaterial";
import MainHome from "./main/MainHome";
import { getToken, setPermissions } from "./utils/handelCookie";
import { getApplicationPermissionById } from "./redux/auth/authAction";
import DashboardEntity from "./obesoloteMaterial/Page/dashboard/DashboardEntity";
import AllLog from "./obesoloteMaterial/Page/log/AllLog";
import LogById from "./obesoloteMaterial/Page/log/LogById";
import Root2 from "./obesoloteMaterial/Layout/Root2";
const MainInformation = React.lazy(() =>
  import("./Pages/manageMainInformation/MainInformation")
);
const Permission = React.lazy(() =>
  import("./Pages/manageMainInformation/ShowData/RoleAndPermission/Permission")
);
const SetPermissionToGroup = React.lazy(() =>
  import(
    "./Pages/manageMainInformation/ShowData/RoleAndPermission/SetPermisition"
  )
);
const ProductStagnant = React.lazy(() =>
  import("./obesoloteMaterial/Page/Productstagmant")
);
const ProductOverview = React.lazy(() =>
  import("./obesoloteMaterial/Page/materialOverview/ProductOverview")
);

const UserManagementAllUsers = React.lazy(() =>
  import("./Pages/MangemantUsers/UsermanagemantAllUsers")
);
const SetPermissionFromEntities = React.lazy(() =>
  import("./Pages/MangemantUsers/setPermissionFromEntitis")
);
const Archive = React.lazy(() =>
  import("./obesoloteMaterial/Page/archive/archiveList")
);
export default function App() {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      dispatch(setscreenwidth(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);
  // Initialize AOS animations
  useEffect(() => {
    Aos.init();
  }, []);
  const TRACKING_ID = "G-2H0DW1GEQW"; // Replace with your Google Analytics Tracking ID
  ReactGA.initialize(TRACKING_ID);
  return (
    <BrowserRouter>
      <GoogleAnalyticsTracker />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainHome />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Stagnant Materials System Routes (Application ID: 2) */}
          <Route
            element={
              <ProtectedApplicationRoute
                applicationId={1}
                setRefresh={setRefresh}
              />
            }
          >
            <Route path="stagnant-materials" element={<Root2 />}>
              <Route index element={<Pages />} />
              <Route path="stagnant-materials_home" element={<Pages />} />
              <Route element={<PrivateRoutes />}>
                <Route
                  path="UserManagementAllUsers"
                  element={<UserManagementAllUsers />}
                />
                <Route
                  path="ListOfObsoleteItems"
                  element={<FormDeletedList />}
                />
                <Route path="MainInformation" element={<MainInformation />} />
                <Route
                  path="stagnant-materials/Permission/:id"
                  element={<Permission />}
                />
                <Route
                  path="/stagnant-materials/MainInformation/SetPermissionToGroup/:id"
                  element={<SetPermissionToGroup />}
                />
                <Route path="AllLog" element={<AllLog />} />
                <Route path="logEntity" element={<LogById />} />
                <Route
                  path="stagnant-materials/ProductStagnant/:id"
                  element={<ProductStagnant />}
                />
                <Route path="profile" element={<PersonalProfile />} />
                <Route
                  path="UserManagementFromEntities"
                  element={<UserManagementFromEntities />}
                />
                <Route
                  path="stagnant-materials/SetPermissionFromEntities/:id"
                  element={<SetPermissionFromEntities />}
                />
                <Route
                  path="BookObsoleteMaterial"
                  element={<BookObsoleteMaterial />}
                />
                <Route path="Dashboard" element={<Dashboard />} />
                <Route path="archive" element={<Archive />} />
                <Route path="dashboard-Entity" element={<DashboardEntity />} />
                <Route
                  path="ListOfObsoleteItems/Material-Overview/:id"
                  element={<MaterialOverview />}
                />
                <Route
                  path="Obsolete-Material-Approve-Admin/Material-Overview/:id"
                  element={<MaterialOverview />}
                />
                <Route
                  path="archive/information-Material/:id"
                  element={<InformationMaterial />}
                />
                <Route
                  path="Obsolete-Material-Approve-Admin"
                  element={<FormObsoleteMaterialApproveAdmin />}
                />
                <Route
                  path="Notification/Obsolete-Material-Approve-Admin"
                  element={<FormObsoleteMaterialApproveAdmin />}
                />
                <Route
                  path="Obsolete-Material-Approve-Super-Admin"
                  element={<FormObsoleteMaterialApproveSuperAdminRoot />}
                />
                <Route
                  path="Notification"
                  element={<NotificationObsoletedMaterial />}
                />
                <Route
                  path="Notification/Obsolete-Material-Approve-Super-Admin"
                  element={<FormObsoleteMaterialApproveSuperAdminRoot />}
                />
                <Route
                  path="Approval-reservations"
                  element={<ApproveBooked />}
                />
                <Route
                  path="Notification/Approval-reservations"
                  element={<ApproveBooked />}
                />
                <Route
                  path="Notification/Product-Overview/:id"
                  element={<ProductOverview />}
                />
                <Route
                  path="approve-Admin-To-send-Request-Booking"
                  element={<ApproveAdmainTobsendRequestBooking />}
                />
                {/* refresh token */}
                <Route
                  path="refresh-token"
                  element={<RefreshButtonTemplate />}
                />
              </Route>
              <Route path="all-category" element={<AllCategory />} />
              <Route path="help-platform" element={<HelpAboutProject />} />
            </Route>
          </Route>
          {/* Warehouse Management System Routes (Application ID: 1) */}
          <Route
            element={
              <ProtectedApplicationRoute
                applicationId={2}
                setRefresh={setRefresh}
              />
            }
          >
            <Route path="LoginWh" element={<LoginWh />} />
            <Route element={<PrivateRoutes />}>
              <Route path="warehouse-management" element={<RootWarehouse />}>
                <Route index element={<HomeWharhouse />} />
                <Route path="warehouse-home" element={<HomeWharhouse />} />
                <Route
                  path="warehouse-store"
                  element={<WarehouseStorageManagement />}
                />
                <Route path="Warehouse-Report" element={<WarehouseReport />} />
                <Route
                  path="warehouse-Notification"
                  element={<WarehouseNotification />}
                />
                <Route
                  path="warehouse-store/Inventory"
                  element={<Inventory />}
                />
                <Route
                  path="warehouse-store/StoreData"
                  element={<StoreData />}
                />
                <Route path="Shipments" element={<Shipments />} />
                <Route
                  path="warehouse-store/StoreData/material-movement"
                  element={<MaterialMovement />}
                />
                <Route
                  path="material-movement"
                  element={<MaterialMovement />}
                />
                <Route
                  path="Warehouse-Notification/material-movement"
                  element={<MaterialMovement />}
                />
                <Route
                  path="warehouse-store/Inventory/material-movement"
                  element={<MaterialMovement />}
                />
                <Route
                  path="warehouse-store/StoreData/print-Inventory"
                  element={<PrintInventory />}
                />
                <Route
                  path="warehouse-store/Inventory/print-Inventory"
                  element={<PrintInventory />}
                />
                <Route path="general-Setting" element={<LabTabsWareHouse />} />
                <Route
                  path="general-Setting/follow-up-labs"
                  element={<LabMinitoring />}
                />
                <Route path="AllLog" element={<AllLog />} />
                <Route path="logEntity" element={<LogById />} />
                <Route path="profile" element={<PersonalProfile />} />
                <Route
                  path="UserManagementFromEntities"
                  element={<UserManagementFromEntities />}
                />
                {/* refresh token */}
                <Route
                  path="refresh-token"
                  element={<RefreshButtonTemplate />}
                />
              </Route>
            </Route>
          </Route>
          {/*  public routes */}
          <Route path="/help-platform" element={<HelpAboutProject />} />
          <Route path="/all-category" element={<AllCategory />} />
          <Route path="/Product-Obsolete/:id" element={<ProductStagnant />} />
          <Route path="/Product-Overview/:id" element={<ProductOverview />} />
          <Route path="/about-page" element={<AboutPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
