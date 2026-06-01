import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiUsers,
  FiCreditCard,
  FiMail,
  FiChevronDown,
  FiArrowUpRight,
  FiTrash2
} from "react-icons/fi";
import "./settings.css";

interface TeamMember {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER";
}

interface CouponHistoryItem {
  code: string;
  date: string;
  bonus: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"team" | "billing">("team");

  // Team states
  const [teamName, setTeamName] = useState("Personal");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "member_1",
      email: "[EMAIL_ADDRESS]",
      role: "ADMIN",
    }
  ]);

  // Billing states
  const [couponCode, setCouponCode] = useState("");
  const [showCouponHistory, setShowCouponHistory] = useState(false);
  const [coupons, setCoupons] = useState<CouponHistoryItem[]>([]);

  const handleSaveTeamName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error("Team name cannot be empty");
      return;
    }
    toast.success(`Team name updated to "${teamName.trim()}"`);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if duplicate email
    if (teamMembers.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
      toast.error("This email is already in your team");
      return;
    }

    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
    };

    setTeamMembers(prev => [...prev, newMember]);
    setInviteEmail("");
    toast.success(`Invitation successfully sent to ${newMember.email}!`);
  };

  const handleRemoveMember = (id: string, email: string) => {
    if (confirm(`Remove ${email} from your team?`)) {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      toast.success(`${email} has been removed from the team.`);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

    const newCoupon: CouponHistoryItem = {
      code: couponCode.trim().toUpperCase(),
      date: formattedDate,
      bonus: "1,000 Credits",
    };

    setCoupons(prev => [newCoupon, ...prev]);
    setCouponCode("");
    toast.success(`Coupon "${newCoupon.code}" applied! +1,000 API Credits added.`);
  };

  return (
    <div className="settings-page-container">
      {/* Visual Peak Graphics Header */}
      <div className="settings-page-header">
        <div className="header-text-content">
          <h1>Settings</h1>
          <p>Manage your team, billing, and account preferences</p>
        </div>
      </div>

      {/* Main Settings Card Row Container */}
      <div className="settings-content-card">
        {/* Left Nav Menu Sidebar */}
        <div className="settings-sidebar-nav">
          <button
            className={`settings-nav-item ${activeTab === "team" ? "active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            <FiUsers className="nav-icon" />
            <span>Team</span>
          </button>

          <button
            className={`settings-nav-item ${activeTab === "billing" ? "active" : ""}`}
            onClick={() => setActiveTab("billing")}
          >
            <FiCreditCard className="nav-icon" />
            <span>Billing</span>
          </button>
        </div>

        {/* Right Active View Content Area */}
        <div className="settings-view-workspace">
          {/* TAB 1: TEAM SETTINGS */}
          {activeTab === "team" && (
            <div className="settings-tab-view team-view">
              {/* Section 1: Team Name */}
              <div className="settings-section-block">
                <h3>Team Name</h3>
                <p className="block-subtitle">Update your team's display name</p>
                <form onSubmit={handleSaveTeamName} className="row-inputs-wrapper">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                    maxLength={30}
                  />
                  <button type="submit" className="save-settings-btn">Save</button>
                </form>
              </div>

              {/* Section 2: Invite Members */}
              <div className="settings-section-block">
                <h3>Invite Team Members</h3>
                <p className="block-subtitle">Add new members to your team</p>
                <form onSubmit={handleSendInvite} className="invite-form-grid">
                  <div className="invite-email-input-wrapper">
                    <input
                      type="text"
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>

                  {/* Role Selector Trigger */}
                  <div className="custom-dropdown-container">
                    <button
                      type="button"
                      className="dropdown-trigger-btn"
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    >
                      <span>{inviteRole === "ADMIN" ? "Admin" : "Member"}</span>
                      <FiChevronDown />
                    </button>
                    {showRoleDropdown && (
                      <div className="custom-dropdown-menu">
                        <div
                          className={`dropdown-item ${inviteRole === "MEMBER" ? "selected" : ""}`}
                          onClick={() => {
                            setInviteRole("MEMBER");
                            setShowRoleDropdown(false);
                          }}
                        >
                          Member
                        </div>
                        <div
                          className={`dropdown-item ${inviteRole === "ADMIN" ? "selected" : ""}`}
                          onClick={() => {
                            setInviteRole("ADMIN");
                            setShowRoleDropdown(false);
                          }}
                        >
                          Admin
                        </div>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="invite-send-submit-btn">
                    <FiMail />
                    <span>Send Invite</span>
                  </button>
                </form>
                <span className="block-helper-hint">
                  Invited members will receive an email with instructions to join your team.
                </span>
              </div>

              {/* Section 3: Team Members List */}
              <div className="settings-section-block">
                <h3>Team Members</h3>
                <p className="block-subtitle">Manage your team's access and permissions</p>
                <div className="team-members-list">
                  {teamMembers.map((member) => {
                    const avatarInit = member.email.slice(0, 1).toUpperCase();
                    return (
                      <div key={member.id} className="team-member-row">
                        <div className="member-avatar-circle">
                          {avatarInit}
                        </div>
                        <div className="member-info-block">
                          <div className="name-and-pill">
                            <span className="member-email-primary">{member.email}</span>
                            <span className={`role-badge ${member.role.toLowerCase()}`}>
                              {member.role}
                            </span>
                          </div>
                          <span className="member-email-secondary">{member.email}</span>
                        </div>
                        {member.id !== "member_1" && (
                          <button
                            className="remove-member-btn"
                            onClick={() => handleRemoveMember(member.id, member.email)}
                            title="Remove Member"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BILLING SETTINGS */}
          {activeTab === "billing" && (
            <div className="settings-tab-view billing-view">
              {/* Section 1: Current Plan */}
              <div className="settings-section-block">
                <h3>Current Plan</h3>
                <p className="block-subtitle">Manage your subscription and payment method</p>
                <div className="current-plan-card-box">
                  <div className="plan-detail-top">
                    <span className="plan-name">Free</span>
                    <span className="plan-price">$0/month</span>
                  </div>
                  <div className="plan-feature-row">
                    <span className="check-icon">✓</span>
                    <span className="feature-text">1,000 API credits/month</span>
                  </div>
                  <button className="primary-upgrade-btn">
                    <span>Upgrade</span>
                    <FiArrowUpRight />
                  </button>
                </div>
              </div>

              {/* Section 2: Auto Recharge */}
              <div className="settings-section-block flex-recharge-block">
                <div className="left-info">
                  <h3>Auto Recharge is available on paid plans only.</h3>
                  <p className="block-subtitle">
                    Upgrade to automatically purchase credits when your balance gets low.
                  </p>
                </div>
                <button className="primary-upgrade-btn compact">
                  <span>Upgrade</span>
                  <FiArrowUpRight />
                </button>
              </div>

              {/* Section 3: Apply Coupon */}
              <div className="settings-section-block">
                <h3>Apply Coupon</h3>
                <p className="block-subtitle">Have a promo code? Apply it here for bonus credits</p>
                <form onSubmit={handleApplyCoupon} className="row-inputs-wrapper">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    maxLength={20}
                  />
                  <button type="submit" className="save-settings-btn">Apply</button>
                </form>

                {/* Collapsible Coupon History */}
                <div className="coupon-history-collapsible">
                  <button
                    type="button"
                    className="toggle-history-btn"
                    onClick={() => setShowCouponHistory(!showCouponHistory)}
                  >
                    <FiChevronDown className={`chevron ${showCouponHistory ? "open" : ""}`} />
                    <span>Coupon history</span>
                  </button>
                  {showCouponHistory && (
                    <div className="coupon-history-list">
                      {coupons.length > 0 ? (
                        coupons.map((item, idx) => (
                          <div key={idx} className="coupon-history-row">
                            <span className="code">{item.code}</span>
                            <span className="date">{item.date}</span>
                            <span className="bonus">{item.bonus}</span>
                          </div>
                        ))
                      ) : (
                        <div className="empty-history-text">No coupon redemption history found.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Billing History Table */}
              <div className="settings-section-block">
                <h3>Billing History</h3>
                <p className="block-subtitle">View, pay, download, or regenerate your invoices</p>
                <div className="billing-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Number</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5} className="empty-table-cell">
                          No invoices found.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}