import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../images/logo/logo.png";
import { useState, useEffect } from "react";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const openNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <nav>
        {/* mobile */}
        <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
          <div onClick={openNav} className="mobile-navbar__close">
            <i className="fa-solid fa-xmark"></i>
          </div>
          <ul className="mobile-navbar__links">
            <li>
              <Link onClick={openNav} to="/">
                Home
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="/about">
                About
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="/models">
                Models
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="/testimonials">
                Testimonials
              </Link>
            </li>

            <li>
              <Link onClick={openNav} to="/contact">
                Contact
              </Link>
            </li>
            {user ? (
              <>
                <li style={{ padding: "1.5rem 0", fontWeight: "bold", color: "#fff", fontSize: "2rem" }}>
                  Hi, {user.username}!
                </li>
                <li>
                  <Link onClick={() => { openNav(); handleSignOut(); }} to="/">
                    Sign Out
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link onClick={openNav} to="/signin">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link onClick={openNav} to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* desktop */}

        <div className={`navbar ${sticky ? "sticky-nav" : ""}`}>
          <div className="navbar__img">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={Logo} alt="logo-img" />
            </Link>
          </div>
          
          {/* mobile auth buttons beside the logo */}
          <div className="mobile-auth-btns">
            {user ? (
              <>
                <span className="mobile-auth-welcome">Hi, {user.username}!</span>
                <button onClick={handleSignOut} className="mobile-auth-register">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link className="mobile-auth-signin" to="/signin">
                  Sign In
                </Link>
                <Link className="mobile-auth-register" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* mobile hamburger dropdown */}
          <div className="mobile-hamb" onClick={openNav}>
            <i className="fa-solid fa-bars"></i>
          </div>


          <ul className="navbar__links">
            <li>
              <Link className="home-link" to="/">
                Home
              </Link>
            </li>
            <li>
              {" "}
              <Link className="about-link" to="/about">
                About
              </Link>
            </li>
            <li>
              {" "}
              <Link className="models-link" to="/models">
                Vehicle Models
              </Link>
            </li>
            <li>
              {" "}
              <Link className="testi-link" to="/testimonials">
                Testimonials
              </Link>
            </li>

            <li>
              {" "}
              <Link className="contact-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <div className="navbar__buttons">
            {user ? (
              <>
                <span className="navbar__buttons__welcome" style={{ marginRight: "20px", fontWeight: "bold", fontSize: "1.6rem", color: "#ffffff" }}>
                  Hi, {user.username}!
                </span>
                <button onClick={handleSignOut} className="navbar__buttons__register" style={{ cursor: "pointer", border: "none", fontSize: "1.6rem", fontWeight: "bold", padding: "1.5rem 3rem", color: "#fff", background: "#ff4d4d", borderRadius: "0.3rem", boxShadow: "0 10px 15px 0 rgba(255, 77, 77, 0.35)", transition: "all 0.3s" }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link className="navbar__buttons__sign-in" to="/signin">
                  Sign In
                </Link>
                <Link className="navbar__buttons__register" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

      </nav>
    </>
  );
}

export default Navbar;