import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BottomSend } from "../utils/Content.jsx";
import "./style/PageLogo.css";
import { loginUser } from "../redux/userSlice/authActions.js";
import { clearState } from "../redux/userSlice/userSlice.js";
import { LinBottom, LinLeft, LinRight, LinRightBlack } from "./LinBorder.jsx";
import Loader from "../components/Loader.jsx";
function Login() {
  const Navigateto = useNavigate();
  const { isSuccess, isError, message, Role, code, loading } = useSelector(
    // @ts-ignore
    (state) => state.user
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    console.log("ddd", formData.password);
    e.preventDefault();
    // @ts-ignore
    dispatch(loginUser(formData));
 
  };
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        window.history.back(-1);
      }, 500);
    }
    if (isError) {
      console.log("error");
      toast.error(isError);
      dispatch(clearState());
    }
  }, [isSuccess, isError, message, code, Role, Navigateto, dispatch]);
  const [loadingtest, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);
  const [loadingImage, setLoadingImage] = useState(true);
  useEffect(() => {
    setLoadingImage(true);
    setTimeout(() => {
      setLoadingImage(false);
    }, 4000);
  }, []);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  return (
    <>
      <div className="container positionLogin">
        {loading && <Loader />}
        <div className="login-wrapper">
          <div className="login-container">
            <div className="login-background">
              <div className="login-content">
                <div className="login-box">
                  <div className="logo-section">
                    <LinRight right={"-90px"} />
                    <LinRightBlack />
                    <div className="displayNone">
                      <div className="logo-circle">
                        <div className="m-0">
                          <div
                            className="circleLogo yellow mb-2"
                            style={{ width: "30px", height: "30px" }}
                          ></div>
                          <div
                            className="circleLogo light-purple"
                            style={{ width: "30px", height: "30px" }}
                          ></div>
                        </div>
                        <div className="m-0">
                          <div
                            className="circleLogo purple mb-2"
                            style={{ width: "30px", height: "30px" }}
                          ></div>
                          <div
                            className="circleLogo light-yellow"
                            style={{ width: "30px", height: "30px" }}
                          ></div>
                        </div>
                        <h1 className="logo-title ms-3">N.B.O.M</h1>
                      </div>
                    </div>
                  </div>
                  <div className="login-form">
                    <LinLeft left={"-90px"} />
                    <h2 className="form-title">تسجيل الدخول</h2>
                    <form onKeyPress={handleKeyPress}>
                      <input
                        type="text"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="اسم المستخدم"
                        className="input-field"
                        name="email"
                      />
                      <input
                        type="password"
                        placeholder="كلمة المرور"
                        value={formData.password}
                        onChange={handleInputChange}
                        name="password"
                        className="input-field"
                      />
                      <BottomSend
                        onClick={handleSubmit}
                        className="submit-button"
                      >
                        دخول
                      </BottomSend>
                    </form>
                    <LinBottom />
                  </div>
                </div>
                <div className="LogoLogin">
                  <div className="right-section h-100">
                    <div className="display-flex justify content-center -align-items-center">
                      <div className="logo-circle">
                        <div className="m-0">
                          <div className="circleLogo yellow mb-2"></div>
                          <div className="circleLogo light-purple"></div>
                        </div>
                        <div className="m-0">
                          <div className="circleLogo purple mb-2"></div>
                          <div className="circleLogo light-yellow"></div>
                        </div>
                      </div>
                      <div className="text">
                        <h2 className="bank-name">البنك الوطني</h2>
                        <p className="bank-description">
                          للمواد الراكدة و بطيئة الحركة
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
