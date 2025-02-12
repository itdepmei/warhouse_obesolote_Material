import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../../redux/LanguageState";
import DashboardInformation from "./dashbordInformation";
const Dashboard = () => {
  const { rtl } = useSelector((state) => {
    // @ts-ignore
    return state?.language;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);
  return (
    <div
      style={{ width: "100%", maxWidth: "100%", marginTop: "10px" }}
      className="container"
      dir={`${rtl?.dir}`}
    >
      <DashboardInformation
        headerText={"الاحصائيات العامة"}
        reportEntity={false}
      />
    </div>
  );
};

export default Dashboard;
