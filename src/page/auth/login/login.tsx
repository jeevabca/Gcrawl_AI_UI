import { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ROUTE } from "../../../routes/const";
import useAxios from "../../../services";
import Cookies from "js-cookie";
import TerminalBackground from "../../../components/layout/TerminalBackground";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === ROUTE.LOGIN;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark-theme");
    }
    if (Cookies.get("token")) {
      navigate(ROUTE.DASHBOARD || "/dashboard");
    }
  }, [navigate]);

  const [request, , loading] = useAxios<any, any>({
    endpoint: "LOGIN",
  });

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const payload = {
      email: values.email.trim(),
      password: values.password,
    };

    const res = await request({ data: payload });
    console.log("========================res",res)
    if (res) {
      Cookies.set("user_email", values.email.trim(), { expires: 1 });
      
      // Explicitly extract the token from different possible API structures
      const token = res.token || res.access_token || res.result?.token || res.result?.access_token || res.data?.token || res.data?.access_token;
      if (token) {
        Cookies.set("token", token, { expires: 1 });
      }
      
      navigate(ROUTE.LANDING);
    }
  };

  return (
    <TerminalBackground>
      <div className="login-page">
        <div className="login-card">
          {/* Header with Logo */}
          <div className="login-header">
            <div className="login-logo-container">
              <img src="/src/assets/Logo.svg" alt="" style={{ width: "200px", height: "auto" }} />
            </div>
          </div>

          {/* Tabs */}
          <div className="login-tab-container">
            <div 
              className={`login-tab ${isLoginPage ? "active" : ""}`}
              onClick={() => navigate(ROUTE.LOGIN)}
            >
              Log In
            </div>
            <div 
              className={`login-tab ${!isLoginPage ? "active" : ""}`}
              onClick={() => navigate(ROUTE.SIGNUP)}
            >
              Sign Up
            </div>
          </div>

          {/* Form Content */}
          <div className="login-form-container">
            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item
                label={<span className="login-label">Email</span>}
                name="email"
                rules={[{ required: true, type: 'email', message: "Please input your email!" }]}
              >
                <Input placeholder="name@example.com" className="login-input" />
              </Form.Item>

              <Form.Item
                label={<span className="login-label">Password</span>}
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password placeholder="••••••••" className="login-input" />
              </Form.Item>

              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px", marginTop: "-12px" }}>
                <Link to={ROUTE.FORGOT_PASSWORD} style={{ fontSize: "13px", fontWeight: 500, textDecoration: "none", color: "#064a91" }}>
                  Forgot Password?
                </Link>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" block className="login-primary-button" loading={loading}>
                  {isLoginPage ? "Log In" : "Create Account"}
                </Button>
              </Form.Item>

              <div className="login-footer-text">
                By {isLoginPage ? "logging in" : "signing up"}, you agree to our <br />
                <Link to={ROUTE.TERMS} className="login-link">Terms of Service</Link> and <Link to={ROUTE.PRIVACY} className="login-link">Privacy Policy</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </TerminalBackground>
  );
}
