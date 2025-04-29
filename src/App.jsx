import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TitlePage from "./pages/TitlePage";
import Home from "./pages/Home";
import News from "./pages/News";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminInitialize from "./pages/AdminInitialize";
import AdminPanel from "./pages/AdminPanel";
import "./assets/index.css";
import "./assets/styles.css";

const App = () => {
  return (
    <Router>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<TitlePage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/courses/:courseId"
            element={
                <CourseDetail />
            }
          />
          <Route
            path="/profile"
            element={
                <Profile />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/initialize" element={<AdminInitialize />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
