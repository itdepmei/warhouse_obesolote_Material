import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import CountUp from "react-countup";
import HeaderCenter from "components/HeaderCenterComponent";
function Reports({ BackendUrl, theme }) {
  const [countData, setCountData] = useState(0);
  const [countDataMinistry, setCountDataMinistry] = useState(0);
  const [countDataForCurrentMonth, setCountDataForCurrentMonth] = useState(0);
  const [countUser, setCountUser] = useState(0);
  const [error, setError] = useState(null);

  const fetchMainClassData = async () => {
    try {
      const { data } = await axios.get(
        `${BackendUrl}/api/getDataCountOfMaterial`,
   
      );
      setCountData(data?.total_count || 0);
      setCountDataMinistry(data?.totalMinistry || 0);
      setCountDataForCurrentMonth(data?.totalCountMonth || 0);
      setCountUser(data?.totalCountUser || 0);
      AOS.refresh(); // Refresh AOS after data is fetched and DOM is updated
    } catch (error) {
      console.error(
        "Error fetching main class data:",
        error?.response?.data?.message || error.message
      );
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    AOS.init(); // Initialize AOS on component mount
    fetchMainClassData(); // Fetch data and update the state
  }, []);

  return (
    <div>
      <div
        className={` stats ${
          theme.palette.mode === "dark" ? "stateDarkMode" : " statsLightMode "
        }`}
        id="stats"
      >
        <HeaderCenter title="الأحصائيات" typeHeader="h2" />
        <div className="container" style={{ overflowX: "visible" }}>
          <div
            className={` box ${
              theme.palette.mode === "dark" ? "boxDarkMode" : "boxLightMode"
            }`}
            data-aos="flip-right"
            data-aos-offset="200"
            data-aos-easing="ease-in-sine"
            style={{
              background: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
            }}
          >
            <i className="far fa-user fa-2x fa-fw" />
            <span
              className="number"
              style={{
                color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
              }}
            >
              <CountUp end={countDataMinistry} duration={2} separator="," />
            </span>
            <span className="text">المؤسسات </span>
          </div>
          <div
            className={` box ${
              theme.palette.mode === "dark" ? "boxDarkMode" : "boxLightMode"
            }`}
            data-aos="flip-right"
            data-aos-offset="200"
            data-aos-easing="ease-in-sine"
            style={{
              background: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
            }}
          >
            <i className="fas fa-code fa-2x fa-fw" />
            <span className="number">
              <CountUp end={countData} duration={2} separator="," />
            </span>
            <span className="text">أجمالي المنتجات</span>
          </div>
          <div
            className={` box ${
              theme.palette.mode === "dark" ? "boxDarkMode" : "boxLightMode"
            }`}
            data-aos="flip-right"
            data-aos-offset="200"
            data-aos-easing="ease-in-sine"
            style={{
              background: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
            }}
          >
            <i className="fas fa-globe-asia fa-2x fa-fw" />
            <span className="number">
              <CountUp
                end={countDataForCurrentMonth}
                duration={2}
                separator=","
              />
            </span>
            <span className="text">المنتجات هذا الشهر</span>
          </div>
          <div
            className={` box ${
              theme.palette.mode === "dark" ? "boxDarkMode" : "boxLightMode"
            }`}
            data-aos="flip-right"
            data-aos-offset="200"
            data-aos-easing="ease-in-sine"
            style={{
              background: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
            }}
          >
            <i className="far fa-money-bill-alt fa-2x fa-fw" />
            <span className="number">
              <CountUp end={countUser} duration={2} separator="," />
            </span>
            <span className="text">عدد المستخدمين</span>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default Reports;
