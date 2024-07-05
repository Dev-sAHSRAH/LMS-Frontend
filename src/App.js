import { Home } from "./components/Home";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Form from "./pages/Form";
import { ProfileContent } from "./pages/Profile";
import Navbar from "./components/Navbar/Navbar";
import Test from "./pages/Test";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

// /**
//  * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
//  */
// const MainContent = () => {
//   return (
//     <div className="App">
//       <AuthenticatedTemplate>
//         <ProfileContent />
//         <Home />
//       </AuthenticatedTemplate>

//       <UnauthenticatedTemplate>
//         <h5 className="card-title">
//           Please sign-in to see your profile information.
//         </h5>
//       </UnauthenticatedTemplate>
//     </div>
//   );
// };

const App = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Test />} />
        <Route path="/form" element={<Form />} />
        <Route path="/profile" element={<ProfileContent />} />
      </Routes>
    </>
  );
};

const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default Root;
