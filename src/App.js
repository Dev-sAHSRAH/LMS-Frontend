import { Home } from "./components/Home";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Form from "./pages/Form";
import { ProfileContent } from "./pages/Profile";
import Navbar from "./components/Navbar/Navbar";
import Test from "./pages/Test";

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
