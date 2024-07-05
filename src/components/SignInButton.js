import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

// import Button from "react-bootstrap/Button";

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.log(e);
    });
  };
  return (
    <button
      onClick={() => handleLogin()}
      style={{
        backgroundColor: "#3F51B5",
        borderRadius: "5px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="microsoft.png"
        alt="Microsoft Logo"
        style={{ marginRight: "10px" }}
        width="50px"
      />
      <strong style={{ color: "White" }}> Sign in with Microsoft</strong>
    </button>
  );
};
