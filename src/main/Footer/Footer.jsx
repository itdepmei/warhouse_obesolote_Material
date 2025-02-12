import React from "react";
import { ArrowRightAlt, Call, Email, Place } from "@mui/icons-material";
import { useSelector } from "react-redux";
import logoImage from "../../assets/image/Picture2.jpg";
import "./footer.css"
const Footer = ({ homeRef, reportsRef }) => {
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  return (
    <div className="footer">
      <div className="container">
        <div className="box">
          <div className="imageLogoContainer">
          <img src={logoImage} className="logoCompany" />
          </div>
        </div>
        <div className="box">
          <ul className="links">
            <li>
              <ArrowRightAlt sx={{ color: "#2196f3" }} />
              <a
                href="#"
                className="ms-2"
                onClick={(e) => {
                  e.preventDefault();
                  homeRef();
                }}
              >
                الصفحة الرئيسية
              </a>
            </li>
            <li>
              <ArrowRightAlt sx={{ color: "#2196f3" }} />
              <a
                href="#"
                className="ms-2"
                onClick={(e) => {
                  e.preventDefault();
                  reportsRef();
                }}
              >
                احصائياتنا
              </a>
            </li>
            <li>
              <ArrowRightAlt sx={{ color: "#2196f3" }} />
              <a
                href="#"
                className="ms-2"
                onClick={(e) => {
                  e.preventDefault();
                  reportsRef();
                }}
              >
                التصنيفات
              </a>
            </li>
            <li>
              <Call sx={{ color: "#2196f3" }} />
              <a href="#" className="ms-2">
                الاتصال بنا
              </a>
            </li>
          </ul>
        </div>
        <div className="box">
          <div className="line">
            <i>
              <Place size="lg" sx={{ color: "#2196f3" }} />
            </i>
            <div className="info">
              العراق - بغداد - شارع الصناعة - الشركة العامة للأنظمة الالكترونية
            </div>
          </div>
          <div className="line">
            <i>
              <Call sx={{ color: "#2196f3" }} />
            </i>
            <div className="info">
              <span>009647700009498</span>
              <span>009647800009498</span>
              <pre>5959 الرقم المختصر </pre>
            </div>
          </div>
          <div className="line">
            <i>
              <Email sx={{ color: "#2196f3" }} />
            </i>
            <div className="info">
              <span>info@mei.com.iq</span>
            </div>
            <i>
              <Email sx={{ color: "#2196f3" }} />
            </i>
            <div className="info">
              <span>info@urproducts.iq</span>
            </div>
          </div>
          <div className="line">{/* Content for Categories */}</div>
        </div>
      </div>
      <p
        className="copyright"
        style={{
          background: "#fff",
          color: maintheme.mainColor,
          fontWeight: "bold",
        }}
      >
        حقوق هذا النظام محفوظة لدى الشركة العامة للأنظمة الالكترونية العراقية @
        2024
      </p>
    </div>
  );
};

export default Footer;
