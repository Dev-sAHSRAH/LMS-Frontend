import { loginRequest } from "../authConfig";
import { callMsGraph } from "../graph";
import { ProfileData } from "../components/ProfileData";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";

export const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
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
    RequestProfileData();
  });

  return <>{graphData ? <ProfileData graphData={graphData} /> : null}</>;
};
