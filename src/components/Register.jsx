import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import RegisterBg from "../images/banners/register-bg.png";
import { getApiBaseUrl } from "../apiConfig";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState("");
  const [btnHover, setBtnHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const apiBaseUrl = getApiBaseUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!username || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/api/users`, {
        username,
        email,
        password
      });

      if (response.status === 201) {
        setMessage("Registration successful. You can sign in now.");
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url(${RegisterBg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    padding: "20px",
    fontFamily: "'Outfit', 'Inter', sans-serif",
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    width: "100%",
    maxWidth: "420px",
    padding: "40px 30px",
    borderRadius: "24px",
    background: "rgba(30, 41, 59, 0.45)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    color: "#fff",
  };

  const titleStyle = {
    marginBottom: "6px",
    fontSize: "28px",
    color: "#fff",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  };

  const subtitleStyle = {
    marginBottom: "28px",
    fontSize: "14px",
    color: "#94a3b8",
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: "1px solid",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "all 0.2s ease",
  };

  const getFieldStyle = (fieldName) => ({
    ...inputStyle,
    borderColor: activeField === fieldName ? "#ff4d30" : "rgba(255, 255, 255, 0.12)",
    backgroundColor: activeField === fieldName ? "rgba(15, 23, 42, 0.8)" : "rgba(15, 23, 42, 0.55)",
    boxShadow: activeField === fieldName ? "0 0 0 3px rgba(255, 77, 48, 0.15)" : "none",
  });

  const buttonStyle = {
    width: "100%",
    backgroundColor: btnHover ? "#fa4226" : "#ff4d30",
    color: "#fff",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: btnHover ? "0 10px 25px rgba(255, 77, 48, 0.45)" : "0 8px 20px rgba(255, 77, 48, 0.3)",
    transform: btnHover ? "translateY(-1px)" : "none",
    transition: "all 0.2s ease",
  };

  const backHomeStyle = {
    display: "inline-flex",
    alignItems: "center",
    color: backHover ? "#ff4d30" : "#94a3b8",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "20px",
    cursor: "pointer",
    transition: "color 0.2s",
    alignSelf: "flex-start",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <Link
          to="/"
          style={backHomeStyle}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
        >
          <span style={{ marginRight: "6px" }}>&larr;</span> Back to Home
        </Link>
        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Register to unlock premium car rentals</p>
        <form onSubmit={handleSubmit}>
          {message && <p style={{ color: "#2ecc71", fontSize: "14px", marginBottom: "16px", fontWeight: "600" }}>{message}</p>}
          {error && <p style={{ color: "#ff4d30", fontSize: "14px", marginBottom: "16px", fontWeight: "600" }}>{error}</p>}
          
          <div style={{ marginBottom: "18px", textAlign: "left" }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setActiveField("username")}
              onBlur={() => setActiveField("")}
              style={getFieldStyle("username")}
            />
          </div>
          
          <div style={{ marginBottom: "18px", textAlign: "left" }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField("")}
              style={getFieldStyle("email")}
            />
          </div>
          
          <div style={{ marginBottom: "24px", textAlign: "left", position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField("")}
              style={{
                ...getFieldStyle("password"),
                paddingRight: "45px",
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: "16px",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </span>
          </div>
          
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Register
          </button>
        </form>
        
        <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link to="/signin" style={{ color: "#ff4d30", fontWeight: "600", textDecoration: "none" }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

