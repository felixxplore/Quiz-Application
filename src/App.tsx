import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserQuiz from "./UiComponent/UserQuiz";

function App() {
  return (
    <>
      {/* <div className="flex flex-col items-center justify-center min-h-svh">
      <Button>Click me</Button>
    </div> */}

      <Router>
        <div className="p-4 bg-gray-100 min-h-screen">
          <nav className="mb-4">
            <Link to="/" className="mr-4 text-blue-600 hover:underline">
              Admin Dashboard
            </Link>
            <Link to="/user" className="text-blue-600 hover:underline">
              User Quiz
            </Link>
          </nav>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/user" element={<UserQuiz />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
