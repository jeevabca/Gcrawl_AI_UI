import { useEffect } from "react";
import { Form, Input, Button, Modal } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { ROUTE } from "../../../routes/const";
import useAxios from "../../../services";
import "./forget-password.css";

export default function ForgetPassword() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark-theme");
    }
  }, []);

  const [request, , loading] = useAxios<any, any>({
    endpoint: "FORGOT_PASSWORD",
  });

  const onFinish = async (values: any) => {
    const payload = {
      email: values.email.trim(),
    };

    const res = await request({ data: payload });
    if (res) {
      Modal.success({
        title: "Reset Link Sent",
        content: "We have sent a password reset link to your email. Please check your inbox and spam folder.",
        okText: "Go to Login",
        onOk: () => {
          navigate(ROUTE.LOGIN);
        },
      });
    }
  };

  return (
    <div className="forget-password-page">
      <div className="forget-password-card">
        {/* Header with Logo */}
        <div className="forget-password-header">
          <div className="forget-password-logo-container">
            <img src="../../src/assets/Logo.svg" alt="GcrawlAI" style={{ width: "200px", height: "auto" }} />
          </div>
          <h2 className="forget-password-title">Forgot Password?</h2>
          <p className="forget-password-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form Content */}
        <div className="forget-password-form-container">
          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              label={<span className="forget-password-label">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" }
              ]}
            >
              <Input placeholder="name@example.com" className="forget-password-input" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block className="forget-password-primary-button" loading={loading}>
                Send Reset Link
              </Button>
            </Form.Item>

            <div className="forget-password-footer-text">
              Remember your password?
              <Link to={ROUTE.LOGIN} className="forget-password-link">Log In</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
