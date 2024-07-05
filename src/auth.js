export const checkAuth = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/", {
      method: "GET",
    });
    console.log(response);
    response = await response.json();
    return response.isAuthenticated;
  } catch (error) {
    console.log(error);
    return false;
  }
};
