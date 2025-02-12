import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageNotFound from "./middleware/PageNotFound";
import Login from "./Auth/login";
import PrivateRoutes from "./middleware/praivetRout";
import "./style/fremwork.css";
import Root2 from "./Layout/Root2";
import Pages from "./Pages/ProductsDisplay/pages";
import PersonalProfile from "./Auth/Profile/informationUser";
import AllCategory from "./Pages/ProductsDisplay/category/AllCategory";
import { useDispatch } from "react-redux";
import React, { Suspense, useEffect } from "react";
import { setscreenwidth } from "./redux/windoScreen/settingDataSlice";
import Aos from "aos";
import AboutPage from "Pages/ProductsDisplay/home/AboutPage";
import HelpAboutProject from "./help/help";
import Loader from "components/Loader";
import ReactGA from "react-ga";
import GoogleAnalyticsTracker from "utils/GoogleAnalyticsTracker ";
import Dashboard from "Pages/Dashboard/dashboard/Dashboard";
import DashboardEntity from "Pages/Dashboard/dashboard/DashboardEntity";
import ApproveBooked from "./Notification/approveBooked";
import FormDeletedList from "Pages/FromIsObsolete/FormObsoleteList";
import FormObsoleteMaterialApproveSuperAdminRoot from "./Pages/FromIsObsolete/FormAbsoleteMaterialApproveUperAdminRoot";
import ApproveAdmainTobsendRequestBooking from "Pages/FromIsObsolete/approveAdmainTobsendRequestBooking";
import MaterialOverview from "Pages/FromIsObsolete/MaterialOverview";
import UserManagementFromEntities from "Pages/MangemantUsers/userMangemantFromEntitis";
import BookObsoleteMaterial from "Pages/FromIsObsolete/BookObsoleteMaterial";
import InformationMaterial from "Pages/archive/InformationMaterial";
import FormObsoleteMaterialApproveAdmin from "./Pages/FromIsObsolete/FormAbsoleteMaterialApproveAdmin";
import RefreshButtonTemplate from "Layout/RefreshButtonTemplate";
import LoginWh from "Auth/loginWarehouse";
import HomeWharhouse from "warehouse_management/Pages/Home/Home";
import RootWarehouse from "warehouse_management/Layout/Root";
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
import NotificationObsoletedMaterial from "./Pages/Notification/NotificationObesoloteMaterial";
import MainHome from "./main/MainHome";
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
  import("./Pages/ProductsDisplay/Productstagmant")
);
const ProductOverview = React.lazy(() =>
  import("./Pages/ProductsDisplay/materialOverview/ProductOverview")
);

const UserManagementAllUsers = React.lazy(() =>
  import("./Pages/MangemantUsers/UsermanagemantAllUsers")
);
const SetPermissionFromEntities = React.lazy(() =>
  import("./Pages/MangemantUsers/setPermissionFromEntitis")
);
const AllLog = React.lazy(() => import("./Pages/log/AllLog"));
const LogById = React.lazy(() => import("./Pages/log/LogById"));
const Archive = React.lazy(() => import("Pages/archive/archiveList"));
export default function App() {
  const dispatch = useDispatch();
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
          <Route path="/stagnant-materials" element={<Root2 />}>
            <Route index element={<Pages />} />
            <Route element={<PrivateRoutes />}>
              <Route
                path="UserManagementAllUsers"
                element={<UserManagementAllUsers />}
              />
              <Route path="ListOfObsoleteItems" element={<FormDeletedList />} />
              <Route path="MainInformation" element={<MainInformation />} />
              <Route path="Permission/:id" element={<Permission />} />
              <Route
                path="SetPermissionToGroup/:id"
                element={<SetPermissionToGroup />}
              />
              <Route path="AllLog" element={<AllLog />} />
              <Route path="logEntity" element={<LogById />} />
              <Route path="ProductStagnant/:id" element={<ProductStagnant />} />
              <Route path="profile" element={<PersonalProfile />} />
              <Route
                path="UserManagementFromEntities"
                element={<UserManagementFromEntities />}
              />
              <Route
                path="SetPermissionFromEntities/:id"
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
                path="Material-Overview/:id"
                element={<MaterialOverview />}
              />
              <Route
                path="information-Material/:id"
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

              <Route path="Approval-reservations" element={<ApproveBooked />} />
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
              <Route path="refresh-token" element={<RefreshButtonTemplate />} />
            </Route>
            <Route path="help-platform" element={<HelpAboutProject />} />
            <Route path="All-Category" element={<AllCategory />} />
            <Route path="Product-Obsolete/:id" element={<ProductStagnant />} />
            <Route path="Product-Overview/:id" element={<ProductOverview />} />
            <Route path="about-page" element={<AboutPage />} />
          </Route>
          {/* warehouse-management */}
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
              <Route path="warehouse-store/Inventory" element={<Inventory />} />
              <Route path="warehouse-store/StoreData" element={<StoreData />} />
              <Route path="Shipments" element={<Shipments />} />
              <Route
                path="warehouse-store/StoreData/material-movement"
                element={<MaterialMovement />}
              />
              <Route path="material-movement" element={<MaterialMovement />} />
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
              {/* <Route path="add-User-To-Warehouse" element={<UserTable />} /> */}
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
              <Route path="refresh-token" element={<RefreshButtonTemplate />} />
            </Route>
            <Route path="help-platform" element={<HelpAboutProject />} />
            <Route path="All-Category" element={<AllCategory />} />
            <Route path="Product-Obsolete/:id" element={<ProductStagnant />} />
            <Route path="Product-Overview/:id" element={<ProductOverview />} />
            <Route path="about-page" element={<AboutPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
