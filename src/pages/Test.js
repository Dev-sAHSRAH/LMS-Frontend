import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Test.css";
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const Test = () => {
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const today = new Date();
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [startDate, setStartDate] = useState(previousMonth);
  const [attendance, setAttendance] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selection, setSelection] = useState("");
  const [morningTimeAllowanceCount, setMorningTimeAllowanceCount] = useState(0);
  const [afternoonTimeAllowanceCount, setAfternoonTimeAllowanceCount] =
    useState(0);

  useEffect(() => {
    generateAttendanceTable(startDate);
  }, [startDate]);

  if (!isAuthenticated) {
    <Navigate to="/" />;
    return;
  }
  const generateAttendanceTable = (date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    const table = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      table.push({
        day: dayName,
        date: `${day}-${month}-${year}`,
        attendance: isWeekend ? "X" : "",
        isWeekend: isWeekend,
      });
    }

    setAttendance(table);
  };

  const handleRangeChange = () => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from > to) {
      toast.error("From date should be earlier than To date");
      return;
    }

    const newAttendance = [...attendance];

    const start = from.getDate();
    const end = to.getDate();

    let morningCount = 0;
    let afternoonCount = 0;

    // Calculate the initial counts based on existing attendance
    for (let i = 0; i < newAttendance.length; i++) {
      if (newAttendance[i].attendance === "M" && !newAttendance[i].isWeekend) {
        morningCount++;
      } else if (
        newAttendance[i].attendance === "A" &&
        !newAttendance[i].isWeekend
      ) {
        afternoonCount++;
      }
    }

    // Update attendance and recalculate counts
    for (let i = 0; i < newAttendance.length; i++) {
      const dateParts = newAttendance[i].date.split("-");
      const current = +dateParts[0];

      if (current >= start && current <= end && !newAttendance[i].isWeekend) {
        if (newAttendance[i].attendance === "M") {
          morningCount--; // Remove previous count if it was 'M'
        } else if (newAttendance[i].attendance === "A") {
          afternoonCount--; // Remove previous count if it was 'A'
        }

        newAttendance[i].attendance = selection;

        if (selection === "M") {
          morningCount++;
        } else if (selection === "A") {
          afternoonCount++;
        } else {
          toast.error("Invalid Shift Selection");
          return;
        }
      }
    }

    setAttendance(newAttendance);
    setMorningTimeAllowanceCount(morningCount);
    setAfternoonTimeAllowanceCount(afternoonCount);

    // Clear the From Date, To Date, and Select Attendance
    setFromDate("");
    setToDate("");
    setSelection("");
  };

  const handleAttendanceChange = (index, value) => {
    const newAttendance = [...attendance];
    newAttendance[index].attendance = value;
    setAttendance(newAttendance);
  };

  const handleMonthChange = (date) => {
    setStartDate(date);
    setFromDate("");
    setToDate("");
  };

  const handleSubmit = async () => {
    const today = new Date();
    if (today.getDate() >= 6) {
      toast.error(
        "You cannot submit the form if the current date is 6th or above."
      );
      return;
    }

    try {
      for (let i = 0; i < attendance.length; ++i) {
        if (!attendance[i].attendance) {
          toast.error(`Value for ${attendance[i].date} cannot be blank`);
          return;
        }
      }
      const firstDate = attendance[0].date;
      const [, month, year] = firstDate.split("-");
      const response = await fetch("http://localhost:3000/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: accounts[0].username,
          username: accounts[0].name,
          month,
          year,
          morningTimeAllowanceCount,
          afternoonTimeAllowanceCount,
          attendance,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to submit attendance data");
        throw new Error("Failed to submit attendance data");
      }

      toast.success("Data submitted successfully");

      // Reset state variables to refresh data
      setAttendance([]);
      setStartDate(previousMonth);
      setFromDate("");
      setToDate("");
      setSelection("");
      setMorningTimeAllowanceCount(0);
      setAfternoonTimeAllowanceCount(0);

      // Regenerate the attendance table for the current month
      generateAttendanceTable(previousMonth);
    } catch (err) {
      toast.error("Error submitting attendance data:", err);
    }
  };

  // Get min and max dates based on selected month
  const getMinDateForInput = () => {
    return new Date(startDate.getFullYear(), startDate.getMonth(), 2)
      .toISOString()
      .split("T")[0];
  };

  const getMaxDateForInput = () => {
    return new Date(startDate.getFullYear(), startDate.getMonth() + 1)
      .toISOString()
      .split("T")[0];
  };

  return (
    <div>
      <div className="container">
        <h3 className="profileContent">Hi 👋, {accounts[0].name}</h3>
        <div className="horizontal-form">
          <div className="form-group">
            <strong>Bind Sheet Month:</strong>
            <DatePicker
              selected={startDate}
              onChange={handleMonthChange}
              dateFormat="MMM-yyyy"
              showMonthYearPicker
              minDate={previousMonth}
              maxDate={previousMonth}
            />
          </div>
          <div className="form-group">
            <strong>From:</strong>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              min={getMinDateForInput()}
              max={getMaxDateForInput()}
            />
          </div>
          <div className="form-group">
            <strong>To:</strong>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={getMinDateForInput()}
              max={getMaxDateForInput()}
            />
          </div>
          <div className="form-group">
            <strong>Shift:</strong>
            <select
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
            >
              <option value="">Select</option>
              <option value="A">Afternoon (A)</option>
              <option value="M">Morning (M)</option>
            </select>
          </div>
          <div className="form-group">
            <button onClick={handleRangeChange}>Update</button>
          </div>
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Date</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((entry, index) => (
            <tr key={index} className={entry.isWeekend ? "weekend" : ""}>
              <td>{entry.day}</td>
              <td>{entry.date}</td>
              <td>
                <input
                  required
                  type="text"
                  value={entry.attendance}
                  onChange={(e) =>
                    handleAttendanceChange(index, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SummaryTable
        morningTimeAllowanceCount={morningTimeAllowanceCount}
        afternoonTimeAllowanceCount={afternoonTimeAllowanceCount}
      />
      <div className="submit">
        <button onClick={handleSubmit}>
          <strong>Submit</strong>
        </button>
      </div>
    </div>
  );
};

const SummaryTable = ({
  morningTimeAllowanceCount,
  afternoonTimeAllowanceCount,
}) => {
  return (
    <table className="summary">
      <thead>
        <tr>
          <th colSpan="2">Work Hours Summary</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Morning Time Allowance Count:</td>
          <td>
            <strong>{morningTimeAllowanceCount}</strong>
          </td>
        </tr>
        <tr>
          <td>Afternoon Time Allowance Count:</td>
          <td>
            <strong>{afternoonTimeAllowanceCount}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Test;
