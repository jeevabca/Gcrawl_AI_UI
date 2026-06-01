import { Popover } from "antd";
import { VscAccount } from "react-icons/vsc";
import { IoMdContact, IoMdCloseCircleOutline } from "react-icons/io";
import { FiCreditCard, FiSettings } from "react-icons/fi";
import { PiSignOutBold } from "react-icons/pi";
import { MdOutlineHelpOutline } from "react-icons/md";
import "./sidebarfooter.css";


interface SidebarFooterProps {
  isCollapsed: boolean;
  showAccountModal: boolean;
  setShowAccountModal: (open: boolean) => void;
  avatarInitials: string;
  email: string;
  handleLogout: () => void;
  navigate: (path: string) => void;
}

export default function SidebarFooter({
  isCollapsed,
  showAccountModal,
  setShowAccountModal,
  avatarInitials,
  email,
  handleLogout,
  navigate,
}: SidebarFooterProps) {
  return (
    <div className="sidebar-bottom">
      <Popover
        content={
          <div className="account-menu-card">
            <div className="account-menu-header">
              <span className="account-menu-title">Account</span>
              <button className="account-menu-close-btn" onClick={() => setShowAccountModal(false)}>
                <IoMdCloseCircleOutline style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            <div className="account-menu-divider" />

            {/* Section 1 */}
            <div className="account-menu-section">
              <button className="account-menu-item" onClick={() => window.open("https://docs.gcrawl.ai", "_blank")}>
                <span className="account-menu-item-icon">
                  <MdOutlineHelpOutline style={{ width: "16px", height: "16px" }} />
                </span>
                <span>Documentation</span>
              </button>
            </div>

            <div className="account-menu-divider" />

            {/* Section 2 */}
            <div className="account-menu-section">
              <button className="account-menu-item" onClick={() => { setShowAccountModal(false); navigate("/account/settings"); }}>
                <VscAccount />
                <span>Account Settings</span>
              </button>

            </div>

            <div className="account-menu-divider" />

            {/* Section 3 */}
            <div className="account-menu-section">
              <button className="account-menu-item" onClick={() => { setShowAccountModal(false); navigate("/account/settings"); }}>
                <span className="account-menu-item-icon">
                  <FiSettings style={{ width: "16px", height: "16px" }} />
                </span>
                <span>Team Settings</span>
              </button>
              <button className="account-menu-item" onClick={() => { setShowAccountModal(false); navigate("/account/usage"); }}>
                <span className="account-menu-item-icon">
                  <FiCreditCard style={{ width: "16px", height: "16px" }} />
                </span>
                <span>Manage Subscriptions</span>
              </button>
            </div>

            <div className="account-menu-divider" />

            {/* Section 4 */}
            <div className="account-menu-section">
              <button className="account-menu-item" onClick={() => { setShowAccountModal(false); navigate("/account/settings"); }}>
                <span className="account-menu-item-icon">
                  <IoMdContact style={{ width: "16px", height: "16px" }} />
                </span>
                <span>Contact Us</span>
              </button>
              <button className="account-menu-item" onClick={handleLogout}>
                <span className="account-menu-item-icon">
                  <PiSignOutBold style={{ width: "16px", height: "16px" }} />
                </span>
                <span>Sign out</span>
              </button>
            </div>
          </div>
        }

        trigger="click"
        open={showAccountModal}
        onOpenChange={setShowAccountModal}
        placement={isCollapsed ? "rightBottom" : "topRight"}
        classNames={{ root: "account-popover" }}
        styles={{
          container: {
            padding: 0,
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
          }
        }}
        arrow={false}
        getPopupContainer={() => document.querySelector('.main-layout') || document.body}
      >
        <div className="user-profile" style={{ cursor: "pointer" }}>
          <div className="user-avatar-circle">{avatarInitials}</div>
          <div className="user-profile-info">
            <div className="user-email-text">{email}</div>
          </div>
        </div>
      </Popover>
    </div>
  );
}
