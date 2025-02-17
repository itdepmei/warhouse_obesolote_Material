import { useRef } from "react";
import Reports from "./BannerAndReports/Reports";
import Banner from "./BannerAndReports/Banner";
import Footer from "./Footer/Footer";
import { useTheme } from "@mui/material";
import AppbarHeader from "./AppBar";
import { BackendUrl } from "../redux/api/axios";
import Category from "./category/CategoryStagnant";
import Home from "./Home";
function MainHome({ header = true }) {
  const homeRef = useRef(null);
  const reportsRef = useRef(null);
  const categoryRef = useRef(null);
  const productsRef = useRef(null);
  const footerRef = useRef(null);
  const theme = useTheme();
  // Function to scroll to a specific section
  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div>
      {header && (
        <div>
          <AppbarHeader />
        </div>
      )}
      <div
        ref={homeRef}
        style={{
          overflowX: "hidden",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <Home
          BackendUrl={BackendUrl}
          theme={theme}
          scrollToRef={scrollToRef}
          reportsRef={reportsRef}
        />
      </div>
      <div
        ref={reportsRef}
        style={{
          overflowX: "hidden",
          padding: "40px 0",
          background:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#f5f5f5",
        }}
      >
        <Reports BackendUrl={BackendUrl} theme={theme} />
      </div>
      <div
        ref={categoryRef}
        style={{
          padding: "40px 0",
          background:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#ffffff",
        }}
      >
        <Category BackendUrl={BackendUrl} theme={theme} />
      </div>
      <div ref={productsRef}></div>
      <div
        ref={footerRef}
        style={{
          background:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#1a1a1a",
          color:
            theme.palette.mode === "dark"
              ? theme.palette.text.primary
              : "#ffffff",
        }}
      >
        <Footer
          homeRef={() => scrollToRef(homeRef)}
          reportsRef={() => scrollToRef(reportsRef)}
          categoryRef={() => scrollToRef(categoryRef)}
          productsRef={() => scrollToRef(productsRef)}
          footerRef={() => scrollToRef(footerRef)}
        />
      </div>
      <div
        className="banner-wrapper"
        style={{
          position: "fixed",
          top: "70px",
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <Banner BackendUrl={BackendUrl} />
      </div>
    </div>
  );
}

export default MainHome;
