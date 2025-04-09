import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TitlePage from "./pages/TitlePage";
import Home from "./pages/Home";
import News from "./pages/News";
import Courses from "./pages/Courses";
import PythonCourse from "./pages/courses/PythonCourse";
import WebDevelopmentCourse from "./pages/courses/WebDevelopmentCourse";
import JavaScriptCourse from "./pages/courses/JavaScriptCourse";
import GraphicDesignCourse from "./pages/courses/GraphicDesignCourse";
import NodeJSCourse from "./pages/courses/NodeJSCourse";
import ProgrammingBasicsCourse from "./pages/courses/ProgrammingBasicsCourse";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./assets/index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TitlePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/python" element={<PythonCourse />} />
        <Route
          path="/courses/web-development"
          element={<WebDevelopmentCourse />}
        />
        <Route path="/courses/javascript" element={<JavaScriptCourse />} />
        <Route
          path="/courses/graphic-design"
          element={<GraphicDesignCourse />}
        />
        <Route path="/courses/nodejs" element={<NodeJSCourse />} />
        <Route
          path="/courses/programming-basics"
          element={<ProgrammingBasicsCourse />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
