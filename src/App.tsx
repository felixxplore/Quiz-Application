import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Quizzes from "./components/Quizzes";
import Navbar from "./components/Navbar";
import QuizId from "./components/QuizId";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SubmissionHistory from "./components/SubmissionHistory";
import AdminPanel from "./pages/AdminPanel";
import EditQuizPage from "./pages/EditQuizPage";
import ProfilePage from "./pages/UserProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminPanel />} />

          {/* RootLayout wraps all child routes */}
          {/* <Route path="/" element={<RootLayout />}> */}
          {/* <Route index element={<Home />} /> */}
          {/* <Route path="topics" element={<Topics />} /> */}
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:quizId" element={<QuizId />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/history" element={<SubmissionHistory />} />
          <Route
            path="/admin/quizzes/edit/:quizId"
            element={<EditQuizPage />}
          />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
