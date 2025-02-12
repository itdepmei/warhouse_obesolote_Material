import { useRef } from "react";
import Category from "./category/CategoryStagnant";
import Home from "./home/Home";
import Reports from "./BannerAndReports/Reports";
import Banner from "./BannerAndReports/Banner";
import Footer from "./Footer/Footer";
import "./style.css";
import "./home/componntStyle.css";
import "./BannerAndReports/style.css";
import { BackendUrl } from "../../redux/api/axios";
import { useTheme } from "@mui/material";
import { getToken } from "../../utils/handelCookie";
function Pages() {
  const homeRef = useRef(null);
  const reportsRef = useRef(null);
  const categoryRef = useRef(null);
  const productsRef = useRef(null);
  const footerRef = useRef(null);
  const token = getToken();
  const theme = useTheme();
  // Function to scroll to a specific section
  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div>
      <div ref={homeRef} style={{ overflowX: "visible" }}>
        <Home
          BackendUrl={BackendUrl}
          theme={theme}
          scrollToRef={scrollToRef}
          reportsRef={reportsRef}
        />
      </div>
      <div ref={reportsRef} style={{ overflowX: "visible" }}>
        <Reports BackendUrl={BackendUrl} theme={theme} />
      </div>
      <div ref={categoryRef}>
        <Category BackendUrl={BackendUrl} theme={theme} />
      </div>
      <div ref={productsRef}></div>{" "}
      {/* Commented-out ProductGetByDate left out */}
      <div ref={footerRef}>
        <Footer
          homeRef={() => scrollToRef(homeRef)}
          reportsRef={() => scrollToRef(reportsRef)}
          categoryRef={() => scrollToRef(categoryRef)}
          productsRef={() => scrollToRef(productsRef)}
          footerRef={() => scrollToRef(footerRef)}
        />
      </div>
      <div className="position-relative">
        <div style={{ position: "fixed", top:"70px"  }}>
          <Banner BackendUrl={BackendUrl} />
        </div>
      </div>
    </div>
  );
}

export default Pages;
