import { useIsAuthenticated } from "@azure/msal-react";
import "./ProfileData.css";
import { Navigate } from "react-router-dom";
/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ProfileData = (props) => {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) {
    Navigate("/");
    return;
  }

  return (
    <div className="profile-container">
      <div id="profile-div">
        <h5 className="profileContent">👤Your profile:</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{props.graphData.displayName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{props.graphData.mail}</td>
            </tr>
            <tr>
              <th>id</th>
              <td>{props.graphData.id}</td>
            </tr>
            <tr>
              <th>Manager email</th>
              <td>dbhaskar@microsoft.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
