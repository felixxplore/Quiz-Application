import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserQuiz from "./UiComponent/UserQuiz";
import ProtectedRoute from "./UiComponent/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute element={<UserQuiz />} allowedRole="USER" />
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute element={<AdminDashboard />} allowedRole="QUIZ_CREATOR" />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
