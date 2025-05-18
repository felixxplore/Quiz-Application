import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import QuizId from "./components/QuizId";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import EditQuizPage from "./pages/EditQuizPage";
import ProfilePage from "./pages/UserProfile";
import QuizHistoryOverview from "./components/QuizHistoryOverview";
import QuizHistory from "./components/QuizHistory";
import TopicDetail from "./components/TopicDetails";
import PopularTopics from "./components/PopularTopics";
import ProtectedRoute from "./components/ProtectedRoute";
import QuizList from "./components/QuizList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* RootLayout wraps all child routes */}
          {/* <Route path="/" element={<RootLayout />}> */}
          {/* <Route index element={<Home />} /> */}
          <Route path="/topics" element={<PopularTopics />} />
          <Route path="/quizzes" element={<QuizList />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/history" element={<SubmissionHistory />} /> */}
          <Route path="/topics/:topicId" element={<TopicDetail />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin/quizzes/edit/:quizId"
              element={<EditQuizPage />}
            />
            <Route path="/quizzes/:quizId" element={<QuizId />} />

            <Route path="/history" element={<QuizHistoryOverview />} />
            <Route path="/history/:submissionId" element={<QuizHistory />} />

            <Route path="profile" element={<ProfilePage />} />
            <Route path="/admin/*" element={<AdminPanel />} />
          </Route>

          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
