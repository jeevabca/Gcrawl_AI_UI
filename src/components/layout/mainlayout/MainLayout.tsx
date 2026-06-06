import { useEffect } from "react";
import { Layout } from "antd";
import { toast } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../../page/dashboard/sidebar/sidebar";
import { useTheme } from "../../../utils/theme";
import Cookies from "js-cookie";
import { ROUTE } from "../../../routes/const";
import "./MainLayout.css";
import { MdOutlineLightMode, MdOutlineDarkMode, MdHelpOutline } from "react-icons/md";
import { IoIosDocument } from "react-icons/io";


const { Content } = Layout;

const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      Cookies.remove("token");
      Cookies.remove("user_email");
      toast.error("Session expired or unauthorized. Please log in.");
      navigate(ROUTE.LOGIN);
    }
  }, [navigate]);

  return (
    <Layout className={`main-layout ${isDarkMode ? "dark-theme" : ""}`}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Right Side Content Container */}
      <div className="right-content-wrapper">
        {/* Dynamic Top Header */}
        <header className="main-header">

          {/* Header Right: Global Actions */}
          <div className="header-right-actions">

            {/* Screen Theme Toggle */}
            <button
              className="header-icon-btn"
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <MdOutlineLightMode style={{ width: "20px", height: "20px" }} />
              ) : (
                <MdOutlineDarkMode style={{ width: "20px", height: "20px" }} />
              )}
            </button>

            {/* Help Link */}
            <button className="header-text-link" style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={() => toast("Help docs requested", { icon: "ℹ️" })}>
              <MdHelpOutline style={{ width: "20px", height: "20px" }} />
              Help
            </button>

            {/* Docs Link */}
            <button className="header-text-link" style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={() => toast("Redirecting to docs...", { icon: "ℹ️" })}>
              <IoIosDocument style={{ width: "20px", height: "20px" }} />
              Docs
            </button>
          </div>
        </header>

        {/* Scrollable Sub-View Content Outlet */}
        <Content className="main-content">
          <Outlet />
        </Content>
      </div>
    </Layout>
  );
};

export default MainLayout;