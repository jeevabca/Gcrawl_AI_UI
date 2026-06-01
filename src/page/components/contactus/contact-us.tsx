import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ROUTE } from "../../../routes/const";
import Footer from "../footer/footer";
import "./contact-us.css";
import Navbar from "../navbar/navbar";

export default function ContactUs() {
  const navigate = useNavigate();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("India");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Scroll window to the top on page load/navigation
    window.scrollTo(0, 0);

    // Contact page light mode enforcement (consistent with pricing layout)
    document.documentElement.classList.remove("dark-theme");

    return () => {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark-theme");
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !mobile || !company || !message) {
      toast.error("Please fill in all required fields *");
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been received. Our team will contact you shortly.");
      // Reset form
      setName("");
      setEmail("");
      setMobile("");
      setCompany("");
      setMessage("");
    }, 1500);
  };

  const handleBack = () => {
    navigate(ROUTE.PRICING);
  };

  return (
    <div className="landing-container">

      <Navbar />

      {/* Main Container */}
      <div className="contact-page-wrapper">
        <div className="contact-grid-container">
          
          {/* Left Pane - Get in Touch */}
          <div className="contact-info-card">
            <h2 className="contact-info-title">Get in Touch</h2>
            <p className="contact-info-desc">
              We would love to hear from you. Let's schedule a free estimation call and discuss the next steps.
            </p>
            <div className="contact-title-divider"></div>

            <div className="contact-details-list">
              {/* Email Detail */}
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="contact-detail-text">
                  <span className="detail-label">Email</span>
                  <span className="detail-sublabel">Our friendly team is here to help</span>
                  <a href="mailto:info@gramosoft.in" className="detail-link">info@gramosoft.in</a>
                </div>
              </div>

              {/* Location Detail */}
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <div className="contact-detail-text">
                  <span className="detail-label">Location</span>
                  <span className="detail-sublabel">India — Chennai, available globally</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane - Let's discuss your project Form */}
          <div className="contact-form-card">
            <h2 className="form-header-title">Let's discuss your project</h2>
            <p className="form-header-desc">
              Fill in the form below and we will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="contact-form-element">
              
              {/* Form Input Row (Name & Email) */}
              <div className="form-input-row">
                <div className="form-group">
                  <label className="form-field-label">NAME <span className="asterisk">*</span></label>
                  <input
                    type="text"
                    className="form-text-input"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-field-label">EMAIL <span className="asterisk">*</span></label>
                  <input
                    type="email"
                    className="form-text-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Form Input Row (Mobile & Company) */}
              <div className="form-input-row">
                <div className="form-group">
                  <label className="form-field-label">MOBILE <span className="asterisk">*</span></label>
                  <div className="mobile-input-wrapper">
                    <select
                      className="country-code-select"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                    <input
                      type="tel"
                      className="form-tel-input"
                      placeholder="74104 10123"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-field-label">COMPANY <span className="asterisk">*</span></label>
                  <input
                    type="text"
                    className="form-text-input"
                    placeholder="Your company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Country Field */}
              <div className="form-group single-col-group">
                <label className="form-field-label">COUNTRY</label>
                <input
                  type="text"
                  className="form-text-input"
                  placeholder="India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              {/* Message Textarea */}
              <div className="form-group single-col-group">
                <label className="form-field-label">MESSAGE <span className="asterisk">*</span></label>
                <textarea
                  className="form-textarea-input"
                  placeholder="Tell us about your project..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {/* Actions Section */}
              <div className="form-actions-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="action-btn-submit"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="action-btn-back"
                >
                  Back
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
