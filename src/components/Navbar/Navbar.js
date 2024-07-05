import React from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { SignOutButton } from "../SignOutButton";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
const Navbar = () => {
  const { instance } = useMsal();
  const location = useLocation();
  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.log(e);
    });
  };
  const isAuthenticated = useIsAuthenticated();
  return (
    <nav className="navbar">
      <div className="group">
        {location.pathname === "/calendar" ? null : (
          <Link to="/calendar">
            <button className="nav-button">
              <strong>
                <span style={{ fontSize: "1.5em" }}>📅</span>
              </strong>
            </button>
          </Link>
        )}
      </div>

      <div className="group">
        <Link to="/form">
          <button className="nav-button">Apply For Leave</button>
        </Link>

        <Link to="/profile">
          <button className="nav-button">View Profile</button>
        </Link>
        {isAuthenticated ? (
          <SignOutButton />
        ) : (
          <button
            style={{
              backgroundColor: "#3F51B5",
              borderRadius: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handleLogin()}
          >
            <strong style={{ color: "White" }}>Sign in</strong>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
