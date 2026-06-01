import { useEffect } from "react";
import { Form, Input, Button, Modal, Alert } from "antd";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ROUTE } from "../../../routes/const";
import useAxios from "../../../services";
import "./reset-password.css";

export default function ResetPassword() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark-theme");
    }
  }, []);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [request, , loading] = useAxios<any, any>({
    endpoint: "RESET_PASSWORD",
  });

  const onFinish = async (values: any) => {
    if (!token) {
      Modal.error({
        title: "Invalid Request",
        content: "Reset token is missing from the URL. Please request a new password reset link.",
      });
      return;
    }

    const payload = {
      token: token,
      new_password: values.password,
    };

    const res = await request({ data: payload });
    if (res) {
      Modal.success({
        title: "Password Reset Successfully",
        content: "Your password has been successfully updated. You can now log in with your new credentials.",
        okText: "Go to Login",
        onOk: () => {
          navigate(ROUTE.LOGIN);
        },
      });
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        {/* Header with Logo */}
        <div className="reset-password-header">
          <div className="reset-password-logo-container">
            <img src="../../src/assets/Logo.svg" alt="GcrawlAI" style={{ width: "200px", height: "auto" }} />
          </div>
          <h2 className="reset-password-title">Reset Password</h2>
          <p className="reset-password-subtitle">
            Enter your new secure password below to complete the reset process.
          </p>
        </div>

        {/* Form Content */}
        <div className="reset-password-form-container">
          {!token && (
            <Alert
              message="Missing Reset Token"
              description="This link is invalid because the security token is missing. Please request a new password reset email."
              type="error"
              showIcon
              style={{ marginBottom: "24px" }}
            />
          )}

          <Form layout="vertical" onFinish={onFinish} requiredMark={false} disabled={!token}>
            <Form.Item
              label={<span className="reset-password-label">New Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 8, message: "Password must be at least 8 characters long!" }
              ]}
            >
              <Input.Password placeholder="••••••••" className="reset-password-input" />
            </Form.Item>

            <Form.Item
              label={<span className="reset-password-label">Confirm New Password</span>}
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: "Please confirm your new password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="••••••••" className="reset-password-input" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                className="reset-password-primary-button" 
                loading={loading}
                disabled={!token}
              >
                Reset Password
              </Button>
            </Form.Item>

            <div className="reset-password-footer-text">
              Want to cancel?
              <Link to={ROUTE.LOGIN} className="reset-password-link">Back to Login</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
