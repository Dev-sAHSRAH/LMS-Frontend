import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./form.css";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

const Form = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const navigate = useNavigate();

  const [yourComment, setYourComment] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = "Leave Application";
    const body = `Leave application details:
    From: ${fromDate}
    To: ${toDate}
    Comment: ${yourComment}`;
    const recipientEmail = "abc@xyz.com"; // Replace with recipient's email address

    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleCancel = async () => {
    navigate("/calendar");
  };

  return (
    <div className="leave-application-container">
      <form className="leave-application-form" onSubmit={handleSubmit}>
        <h5 className="profileContent">Hi, {accounts[0].name}</h5>
        <h2>Leave Application</h2>
        <div className="leave-form-group">
          <label>
            <div className="label-data">From:</div>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </label>
          <label>
            <div className="label-data">To:</div>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </label>
          <label htmlFor="yourComment">Your Comment:</label>
          <textarea
            id="yourComment"
            name="yourComment"
            value={yourComment}
            onChange={(e) => setYourComment(e.target.value)}
            rows="4"
            className="resizable-textarea"
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit">Submit</button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
