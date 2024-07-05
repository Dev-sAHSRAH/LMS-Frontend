import { loginRequest } from "../authConfig";
import { callMsGraph } from "../graph";
import { ProfileData } from "../components/ProfileData";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

  const isAuthenticated = useIsAuthenticated();

  function RequestProfileData() {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
      });
  }

  useEffect(() => {
    if (isAuthenticated) {
      RequestProfileData();
    }
  }); // Add isAuthenticated as a dependency

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{graphData ? <ProfileData graphData={graphData} /> : null}</>;
};
