import React, { useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "../apiConfig";
import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!name || !email || !message) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.post(`${apiBaseUrl}/api/contact`, {
        name,
        email,
        message,
      });

      setSuccessMsg(response.data.message || "Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="contact-page">
        <HeroPages name="Contact" />
        <div className="container">
          <div className="contact-div">
            <div className="contact-div__text">
              <h2>Need additional information?</h2>
              <p>
                A multifaceted professional skilled in multiple fields of
                research, development as well as a learning specialist. Over 15
                years of experience.
              </p>
              <a href="tel:+915365796152">
                <i className="fa-solid fa-phone"></i>&nbsp; +91 (536) 579-6152
              </a>
              <a href="mailto:aryansocial18@gmail.com">
                <i className="fa-solid fa-envelope"></i>&nbsp;
                aryansocial18@gmail.com
              </a>
              <a href="/">
                <i className="fa-solid fa-location-dot"></i>&nbsp; Kolhapur, India.
              </a>
            </div>
            <div className="contact-div__form">
              <form onSubmit={handleSubmit}>
                {successMsg && <p style={{ color: "#2ecc71", fontWeight: "600", fontSize: "16px", marginBottom: "15px" }}>{successMsg}</p>}
                {errorMsg && <p style={{ color: "#ff4d30", fontWeight: "600", fontSize: "16px", marginBottom: "15px" }}>{errorMsg}</p>}

                <label>
                  Full Name <b>*</b>
                </label>
                <input
                  type="text"
                  placeholder='E.g: "Aryan Mhetre"'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />

                <label>
                  Email <b>*</b>
                </label>
                <input
                  type="email"
                  placeholder="youremail@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />

                <label>
                  Tell us about it <b>*</b>
                </label>
                <textarea
                  placeholder="Write Here."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />

                <button type="submit" disabled={loading} style={{ cursor: loading ? "not-allowed" : "pointer" }}>
                  <i className="fa-solid fa-envelope-open-text"></i>&nbsp; {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>Book a car by getting in touch with us</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3>+91 (536) 579-6152</h3>
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}

export default Contact;