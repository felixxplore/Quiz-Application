import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchQuizzes,
  fetchQuestionsByQuizId,
  submitQuiz,
  fetchUserSubmissions,
} from "@/store/quizSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "@/store/authSlice";

interface Option {
  id: number;
  optionText: string;
  isCorrect: boolean;
  optionIndex: number;
}

interface Question {
  id: number;
  questionText: string;
  questionType: "FILL_BLANK" | "TRUE_FALSE" | "MCQ";
  options: Option[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  topicName: string;
  subtopicName: string;
}

interface SubmissionResult {
  quizId: number;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  submittedAt: string;
}

const UserQuiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { submissions, quizzes, questions, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );

  const { user, token } = useSelector((state: RootState) => state.auth);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"quizzes" | "results">(
    "quizzes"
  );
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fetch quizzes on mount
  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchUserSubmissions());
    // if (activeView === "results") {
    //   dispatch(fetchUserSubmissions()).then((result) => {
    //     if (fetchUserSubmissions.fulfilled.match(result)) {
    //       toast.success("Submission history loaded!");
    //     } else {
    //       toast.error("Failed to load submission history");
    //     }
    //   });
    // }
  }, [dispatch, activeView]);

  // Timer logic
  useEffect(() => {
    if (isQuizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isQuizStarted, timeLeft]);

  // Click-outside handler for sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizStarted(true);
    setTimeLeft(quiz.timeLimit * 60);
    setAnswers({});
    setSubmissionResult(null);
    dispatch(fetchQuestionsByQuizId(quiz.id));
    toast.info(`Started quiz: ${quiz.title}`);
  };

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    if (!selectedQuiz) return;

    const answersArray = questions
      .filter(
        (q) => q.questionType === "TRUE_FALSE" || q.questionType === "MCQ"
      )
      .map((question) => ({
        questionId: question.id,
        selectedOptionId: answers[question.id] || 0,
      }));

    dispatch(
      submitQuiz({
        quizId: selectedQuiz.id,
        answers: answersArray,
      })
    ).then((result) => {
      if (submitQuiz.fulfilled.match(result)) {
        setSubmissionResult(result.payload);
        setIsQuizStarted(false);
        setSelectedQuiz(null);
        setTimeLeft(0);
        setAnswers({});
        toast.success("Quiz submitted successfully!");
      } else {
        toast.error("Failed to submit quiz");
      }
    });
  };

  const handleAutoSubmit = () => {
    handleSubmit();
    toast.warn("Time’s up! Quiz auto-submitted.");
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out successfully!");
    navigate("/login");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-2">Quiz App</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            {user && token ? (
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-gray-900">
                  {user.name}
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <a href="/signup" className="text-gray-600 hover:text-gray-900">
                  Sign Up
                </a>
                <a href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          ref={sidebarRef}
          className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 text-white transition-transform md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold">User Dashboard</h2>
          </div>
          <nav className="px-3 py-4">
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full flex items-center p-2 rounded-md ${
                    activeView === "quizzes"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setActiveView("quizzes");
                    setSidebarOpen(false);
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
                  </svg>
                  Available Quizzes
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center p-2 rounded-md ${
                    activeView === "results"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setActiveView("results");
                    setSidebarOpen(false);
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                  </svg>
                  Results
                </button>
              </li>
              <li>
                <button
                  className="w-full flex items-center p-2 rounded-md hover:bg-gray-700"
                  onClick={() => {
                    handleLogout();
                    setSidebarOpen(false);
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:ml-64 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            {submissionResult ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Quiz Result
                </h1>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {submissionResult.quizTitle}
                  </h2>
                  <p className="text-gray-600">
                    Total Questions: {submissionResult.totalQuestions}
                  </p>
                  <p className="text-gray-600">
                    Correct Answers: {submissionResult.correctAnswers}
                  </p>
                  <p className="text-gray-600">
                    Score: {submissionResult.score}
                  </p>
                  <p className="text-gray-600">
                    Percentage: {submissionResult.percentage}%
                  </p>
                  <p className="text-gray-600">
                    Submitted At:{" "}
                    {new Date(submissionResult.submittedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  onClick={() => setSubmissionResult(null)}
                >
                  Back to Quizzes
                </button>
              </div>
            ) : isQuizStarted && selectedQuiz ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedQuiz.title}
                  </h1>
                  <p
                    className={`text-lg font-medium ${
                      timeLeft <= 60 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    Time Left: {formatTime(timeLeft)}
                  </p>
                </div>
                {loading && (
                  <div className="flex justify-center">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                      />
                    </svg>
                  </div>
                )}
                {error && (
                  <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                    Error: {error}
                  </div>
                )}
                {questions.length > 0 ? (
                  <div className="space-y-6">
                    {questions.map((question) => (
                      <div
                        key={question.id}
                        className="bg-white rounded-lg shadow-md p-6"
                      >
                        <p className="font-medium text-gray-900 mb-4">
                          {question.questionText}
                        </p>
                        {question.questionType === "FILL_BLANK" ? (
                          <input
                            type="text"
                            placeholder="Fill-in-the-blank not supported"
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                            disabled
                          />
                        ) : (
                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <label
                                key={option.id}
                                className="flex items-center space-x-2 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={option.id}
                                  checked={answers[question.id] === option.id}
                                  onChange={() =>
                                    handleAnswerChange(question.id, option.id)
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">
                                  {option.optionText}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      Submit Quiz
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No questions available for this quiz.
                  </p>
                )}
              </div>
            ) : (
              <div>
                {activeView === "quizzes" ? (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                      Available Quizzes
                    </h1>
                    {loading && (
                      <div className="flex justify-center">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                          />
                        </svg>
                      </div>
                    )}
                    {error && (
                      <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                        Error: {error}
                      </div>
                    )}
                    {quizzes.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz) => (
                          <div
                            key={quiz.id}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                          >
                            <h2 className="text-xl font-semibold text-gray-900">
                              {quiz.title}
                            </h2>
                            <p className="text-gray-600 mt-1">
                              {quiz.description}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Difficulty: {quiz.difficultyLevel}
                            </p>
                            <p className="text-sm text-gray-500">
                              Time Limit: {quiz.timeLimit} minutes
                            </p>
                            <p className="text-sm text-gray-500">
                              Topic: {quiz.topicName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Subtopic: {quiz.subtopicName}
                            </p>
                            <button
                              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                              onClick={() => handleStartQuiz(quiz)}
                            >
                              Start Quiz
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No quizzes available.</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                      Quiz Results
                    </h1>
                    {loading && (
                      <div className="flex justify-center">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                          />
                        </svg>
                      </div>
                    )}
                    {error && (
                      <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                        Error: {error}
                      </div>
                    )}
                    {submissions.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {submissions.map((submission) => (
                          <div
                            key={submission.quizId + submission.submittedAt}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                          >
                            <h2 className="text-xl font-semibold text-gray-900">
                              {submission.quizTitle}
                            </h2>
                            <p className="text-gray-600 mt-1">
                              Total Questions: {submission.totalQuestions}
                            </p>
                            <p className="text-gray-600">
                              Correct Answers: {submission.correctAnswers}
                            </p>
                            <p className="text-gray-600">
                              Score: {submission.score}
                            </p>
                            <p className="text-gray-600">
                              Percentage: {submission.percentage}%
                            </p>
                            <p className="text-gray-600">
                              Submitted At:{" "}
                              {new Date(
                                submission.submittedAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No submission history available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default UserQuiz;
