import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "../../redux/userSlice/authActions";
import { useNavigate } from "react-router-dom";
import { Autorenew } from "@mui/icons-material";
function RefreshButtonTemplate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const RefreshButtonTemplateFunction = () => {
    dispatch(refreshAccessToken());
    navigate("/");
  };
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Box
        component="section"
        sx={{
          p: 2,
          // border: "3px dashed grey",
          textAlign: "center", // Optional, centers text within the box
          width: "50%",
          height: "50%",
          maxWidth: "100%",
        }}
      >
        <div className="backAfterBef">
        <button className="button" onClick={RefreshButtonTemplateFunction}>
          <div className="bloom-container">
            <div className="button-container-main">
              <div className="button-inner">
                <div className="back"></div>
                <div className="front">
                  <Autorenew />
                </div>
              </div>
              <div className="button-glass">
                <div className="back"></div>
                <div className="front"></div>
              </div>
            </div>
            <div className="bloom bloom1"></div>
            <div className="bloom bloom2"></div>
          </div>
        </button>
        </div>
      </Box>
    </div>
  );
}

export default RefreshButtonTemplate;
