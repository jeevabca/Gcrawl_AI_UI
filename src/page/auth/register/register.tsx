import { useState, useEffect } from "react";
import { Form, Input, Button, Modal } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ROUTE } from "../../../routes/const";
import type { signup } from "./type";
import useAxios from "../../../services";
import TerminalBackground from "../../../components/layout/TerminalBackground";
import Cookies from "js-cookie";


import "./register.css";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark-theme");
    }
    if (Cookies.get("token")) {
      navigate(ROUTE.DASHBOARD || "/dashboard");
    }
  }, [navigate]);

   const [request, , loading] = useAxios<signup, signup>({
    endpoint: "SIGNUP_SEND_OTP"
  });
  const [verifyRequest, , verifyLoading] = useAxios<any, any>({
    endpoint: "SIGNUP_VERIFY_OTP"
  });
  const isLoginPage = location.pathname === ROUTE.LOGIN;

  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [signupPayload, setSignupPayload] = useState<any>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isOtpModalVisible && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpModalVisible, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const onFinish = async (values: any) => {
    const payload = {
      name: values.email.trim().slice(0, 8),
      email: values.email.trim(),
      password: values.password,
      firstlogin: false
    };
    setSignupPayload(payload);
    const res = await request({ data: payload });
    console.log(res,"===================respone")
    if (res) {
      setOtp("");
      setTimeLeft(300);
      setIsOtpModalVisible(true);
    }
  };

  const handleValidateOtp = async () => {
    if (!signupPayload) return;
    const res = await verifyRequest({
      data: {
        email: signupPayload.email,
        otp: otp
      }
    });
    if (res) {
      setIsOtpModalVisible(false);
      navigate("/auth/login");
    }
  };

  const handleResendOtp = async () => {
    if (!signupPayload) return;
    const res = await request({ data: signupPayload });
    if (res) {
      setTimeLeft(300);
    }
  };
  return (
    <TerminalBackground>
      <div className="register-page">
        <div className="register-card">
          {/* Header with Logo */}
          <div className="register-header">
            <div className="register-logo-container">
              <img src="/src/assets/Logo.svg" alt="" style={{ width: "200px", height: "auto" }} />
            </div>
          </div>

          {/* Tabs */}
          <div className="register-tab-container">
            <div 
              className={`register-tab ${isLoginPage ? "active" : ""}`}
              onClick={() => navigate(ROUTE.LOGIN)}
            >
              Log In
            </div>
            <div 
              className={`register-tab ${!isLoginPage ? "active" : ""}`}
              onClick={() => navigate(ROUTE.SIGNUP)}
            >
              Sign Up
            </div>
          </div>

          {/* Form Content */}
          <div className="register-form-container">
            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item
                label={<span className="register-label">Email</span>}
                name="email"
                rules={[{ required: true, type: 'email', message: "Please input your email!" }]}
              >
                <Input placeholder="name@example.com" className="register-input" />
              </Form.Item>

              <Form.Item
                label={<span className="register-label">Password</span>}
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password placeholder="••••••••" className="register-input" />
              </Form.Item>

              {/* Empty Spacer to match Forgot Password height and prevent container tab height jitter */}
              <div style={{ height: "19px", marginBottom: "20px", marginTop: "-12px" }} />

              <Form.Item>
                <Button type="primary" htmlType="submit" block className="register-primary-button" loading={loading}>
                  Create Account
                </Button>
              </Form.Item>

              <div className="register-footer-text">
                By signing up, you agree to our <br />
                <Link to={ROUTE.TERMS} className="register-link">Terms of Service</Link> and <Link to={ROUTE.PRIVACY} className="register-link">Privacy Policy</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <Modal
        title={null}
        open={isOtpModalVisible}
        onCancel={() => setIsOtpModalVisible(false)}
        footer={null}
        centered
        width={400}
        styles={{
          container: {
            borderRadius: "20px",
            padding: "36px 24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
          body: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }
        }}
      >
        {/* Sleek Lock Icon Wrapper */}
        <div className="otp-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h2 className="otp-title">
          OTP Verification
        </h2>

        <div className="otp-subtitle">
          Please enter the 5-digit verification code sent to your Email ID.
        </div>

        <Input.OTP 
          length={5} 
          value={otp} 
          onChange={(val) => setOtp(val)} 
          formatter={(str) => str.replace(/[^0-9]/g, '')}
          size="large" 
          style={{ marginBottom: "20px", gap: "10px" }} 
        />

        <div className="otp-warning">
          Check your Spam / Junk folder<br />in case you didn't receive the email.
        </div>

        {/* Premium Countdown Clock Pill */}
        <div className="otp-timer-pill">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {formatTime(timeLeft)}
        </div>

        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <Button 
            type="primary" 
            onClick={handleValidateOtp} 
            style={{ 
              flex: 1, 
              height: "44px", 
              borderRadius: "12px", 
              background: otp.length === 5 ? "var(--primary)" : undefined, 
              borderColor: otp.length === 5 ? "var(--primary)" : undefined,
              fontWeight: 600, 
              fontSize: "16px" 
            }}
            disabled={otp.length !== 5}
            loading={verifyLoading}
          >
            Validate
          </Button>
          <Button 
            onClick={handleResendOtp}
            disabled={timeLeft > 0}
            style={{ 
              flex: 1, 
              height: "44px", 
              borderRadius: "12px", 
              fontWeight: 500, 
              fontSize: "16px", 
              background: timeLeft > 0 ? "#f3f4f6" : "white", 
              color: timeLeft > 0 ? "#9ca3af" : "#374151" 
            }}
            loading={loading}
          >
            Resend OTP
          </Button>
        </div>
      </Modal>
    </TerminalBackground>
  );
}