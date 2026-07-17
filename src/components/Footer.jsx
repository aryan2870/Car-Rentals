import { useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "../apiConfig";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(true);
      setMessage("Please enter an email address.");
      return;
    }
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(true);
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.post(`${apiBaseUrl}/api/newsletter/subscribe`, { email });
      setError(false);
      setMessage(response.data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      setError(true);
      setMessage(err?.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-content">
            <ul className="footer-content__1">
              <li>
                <span>CAR</span> Rental
              </li>
              <li>
                We offers a big range of vehicles for all your driving needs. We
                have the perfect car to meet your needs.
              </li>
              <li>
                <a href="tel:+915365796152">
                  <i className="fa-solid fa-phone"></i> &nbsp; +91 (536) 579-6152
                </a>
              </li>

              <li>
                <a href="mailto:aryansocial18@gmail.com">
                  <i className="fa-solid fa-envelope"></i>
                  &nbsp; aryansocial18@gmail.com
                </a>
              </li>

              <li>
                <a
                  style={{ fontSize: "14px" }}
                  target="_blank"
                  rel="noreferrer"
                  href="https://sayantan207.com/"
                >
                
                </a>
              </li>
            </ul>

            <ul className="footer-content__2">
              <li>Company</li>
              <li>
                <a href="#home">Kolhapur</a>
              </li>
              <li>
                <a href="#home">Careers</a>
              </li>
              <li>
                <a href="#home">Mobile</a>
              </li>
              <li>
                <a href="#home">Blog</a>
              </li>
              <li>
                <a href="#home">How we work</a>
              </li>
            </ul>

            <ul className="footer-content__2">
              <li>Working Hours</li>
              <li>Mon - Fri: 10:00AM - 08:00PM</li>
              <li>Sat: 11:00AM - 07:00PM</li>
              <li>Sun: Closed</li>
            </ul>

            <ul className="footer-content__2">
              <li>Subscription</li>
              <li>
                <p>Subscribe your Email address for latest news & updates.</p>
              </li>
              <li>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </li>
              <li>
                <button
                  className="submit-email"
                  onClick={handleSubscribe}
                  disabled={loading}
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </li>
              {message && (
                <li>
                  <p style={{
                    color: error ? "#ff4d30" : "#2ecc71",
                    fontSize: "14px",
                    marginTop: "10px",
                    fontWeight: "500",
                    lineHeight: "1.4"
                  }}>
                    {message}
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;