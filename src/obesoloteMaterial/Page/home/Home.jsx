import { Box, IconButton, Typography, useTheme } from "@mui/material";
import imageHero from "../../../assets/image/hero-img2.png";
import { useEffect, useState } from "react";
import axios from "axios";
import "../style.css"
import { KeyboardDoubleArrowDown } from "@mui/icons-material";
function Home({ BackendUrl,reportsRef, scrollToRef }) {
  const [aboutSystem, setAboutSystem] = useState([]);
  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataAbout`);
      setAboutSystem(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    fetchBannerData();
  }, []);
  const theme=useTheme()
  return (
    <>
      <div className="landing pt-4 mt-0" style={{background:theme.palette.mode==="dark"? "#000000":null}}>
        <div className="container" dir="rtl">
          <Box className="textAbout">
            {aboutSystem?.map((item) => (
              <div key={item?.id}>
                <div className="cardHomeBag " >
                  <div className="d-flex gap-3 align-items-center">
                    {item?.title === "الرؤية" ? (
                      <div
                        className="circleLogo yellow "
                        style={{ width: "28px", height: "28px" }}
                      ></div>
                    ) : item?.title === "الرسالة" ? (
                      <div
                        className="circleLogo purple "
                        style={{ width: "28px", height: "28px" }}
                      ></div>
                    ) : (
                      <div
                        className="circleLogo light-purple"
                        style={{ width: "28px", height: "28px" }}
                      ></div>
                    )}
                    <Typography
                      sx={{
                        color: "#F9C74F",
                      }}
                      className=""
                    >
                      <span>{item?.title}</span>
                    </Typography>
                  </div>
                  <Typography
                    sx={{
                      color: "#fff",
                    }}
                  >
                    {item?.text}
                  </Typography>
                </div>
              </div>
            ))}
          </Box>
          <div className="image">
            <img src={imageHero} alt="" />
          </div>
        </div>
        <IconButton
          className="go-down"
          onClick={(e) => {
            e.preventDefault();
            scrollToRef(reportsRef); // Corrected to use scrollToRef
          }}
        >
          <KeyboardDoubleArrowDown className="moveIcon" />
        </IconButton>
      </div>
    </>
  );
}
export default Home;
