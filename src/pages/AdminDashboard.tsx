import Modal from "../UiComponent/Model";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  openQuizInfoModal,
  openTopicModal,
  openSubtopicModal,
  closeQuizInfoModal,
  closeTopicModal,
  closeSubtopicModal,
  fetchTopics,
  createTopic,
  createSubtopic,
  createQuiz,
  fetchQuizzes,
  editQuiz,
  closeEditQuizModal,
  deleteQuiz,
  openEditQuizModal,
  selectQuiz,
} from "@/store/quizSlice";
import QuestionManager from "@/UiComponent/QuestionManager";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToasitfy.css";
import { useNavigate } from "react-router-dom";

// interface Topic {
//   id: number;
//   name: string;
//   subtopics: { id: number; name: string }[];
// }

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  topicName: string;
  subtopicName: string;
}

export const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    isTopicModalOpen,
    isSubtopicModalOpen,
    isQuizInfoModalOpen,
    isEditQuizModalOpen,
    topics,
    quizzes,
    selectedQuizId,
    loading,
    error,
    quizInfo,
  } = useSelector((state: RootState) => state.quiz);
  const { user } = useSelector((state: RootState) => state.auth);

  //* state for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //* ref for sidebar to detect clicks outside
  const sidebarRef = useRef<HTMLDivElement>(null);

  //* fetch quizzes and topics on component mount
  useEffect(() => {
    console.log("Fetching quizzes and topics");
    dispatch(fetchQuizzes());
    dispatch(fetchTopics());
  }, [dispatch]);

  //* handle clicks outside sidebar to close it
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

  // * Handle topic save
  const handleTopicSave = async (topicName: string) => {
    console.log("handleTopicSave : topicName=", topicName);
    if (!topicName.trim()) {
      toast.error("Topic name cannot be empty.");
      return;
    }
    try {
      await dispatch(createTopic(topicName)).unwrap();
      dispatch(closeTopicModal());
      toast.success("Topic created successfully!");
    } catch (error) {
      console.log("error come from handleTopicSave : ", error);
      toast.error(String(error));
    }
  };

  //* handle subtopic save
  const handleSubtopicSave = async (
    // subtopicName: string, topicId: number
    subtopicName: { name: string; topicId: number }
  ) => {
    console.log(
      "handleSubtopicSave: subtopicName=",
      subtopicName
      // " topicId=",
      // topicId
    );

    try {
      await dispatch(
        createSubtopic(
          //   {
          //   name: subtopicName?.name,
          //   topicId: subtopicName?.topicId,
          // }

          subtopicName
        )
      ).unwrap();
      dispatch(closeSubtopicModal());
      toast.success("Subtopic create succesfully!");
    } catch (error) {
      console.log("error come from handleSubtopicSave : ", error);
      toast.error(String(error));
    }
  };

  //* handle quizInfo save
  const handleQuizInfoSave = async (quizInfo: {
    title: string;
    description: string;
    difficultyLevel: "EASY" | "MEDIUM" | "HARD";
    timeLimit: number;
    topicId: number;
    subtopicId: number;
    id: number;
  }) => {
    console.log("handleQuizInfoSave : quizInfo= ", quizInfo);
    try {
      await dispatch(createQuiz(quizInfo)).unwrap();
      dispatch(closeQuizInfoModal());
      toast.success("Quiz create successfully!");
    } catch (error) {
      console.log("error come from handle quizInfo save : ", error);
      toast.error(String(error));
    }
  };

  //* handle edit quiz save
  const handleEditQuizSave = async (
    quizId: number,
    quizInfo: {
      title: string;
      description: string;
      difficultyLevel: "EASY" | "MEDIUM" | "HARD";
      timeLimit: number;
      topicId: number;
      subtopicId: number;
      id: number;
    }
  ) => {
    try {
      console.log("quizId :", quizId, " quizInfo : ", quizInfo);
      await dispatch(editQuiz({ quizId, quizInfo })).unwrap();
      dispatch(closeEditQuizModal());
      toast.success("Quiz updated successfully!");
    } catch (error) {
      console.log("error come from handleEditQuizSave : ", error);
      toast.error(String(error));
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    dispatch(
      openEditQuizModal({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        difficultyLevel: quiz.difficultyLevel,
        timeLimit: quiz.timeLimit,
        topicId:
          topics.find((t) =>
            t.subtopics.some((s) => s.name === quiz.subtopicName)
          )?.id || 0,
        subtopicId:
          topics
            .find((t) => t.subtopics.some((s) => s.name === quiz.subtopicName))
            ?.subtopics.find((s) => s.name === quiz.subtopicName)?.id || 0,
      })
    );
  };

  //* handle delete quiz
  const handleDeleteQuiz = async (quizId: number) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await dispatch(deleteQuiz(quizId)).unwrap();
        toast.success("Quiz deleted successfully!");
      } catch (error) {
        toast.error(String(error));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.info("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 overflow-auto p-4   bg-gray-100">
        {/* Navigation Bar */}
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
              <h1 className="text-xl font-bold text-gray-900 ml-2">
                Quiz Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </a>
              {user ? (
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
                  <a
                    href="/signup"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign Up
                  </a>
                  <a
                    href="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
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
              <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            </div>
            <nav className="px-3 py-4">
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full flex items-center p-2 rounded-md ${
                      selectedQuizId === null
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      dispatch(selectQuiz(null));
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
                    Quizzes
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center p-2 rounded-md ${
                      selectedQuizId !== null
                        ? "bg-gray-700"
                        : "hover:bg-gray-700 opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (selectedQuizId === null)
                        toast.warn("Please select a quiz first");
                      setSidebarOpen(false);
                    }}
                    disabled={selectedQuizId === null}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1zm.293 7.707a1 1 0 00-1.414-1.414L10 12.586l-1.293-1.293a1 1 0 00-1.414 1.414L8.586 14l-1.293 1.293a1 1 0 001.414 1.414L10 15.414l1.293 1.293a1 1 0 001.414-1.414L11.414 14l1.293-1.293z" />
                    </svg>
                    Questions
                  </button>
                </li>
                <li>
                  <button
                    className="w-full flex items-center p-2 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      dispatch(openTopicModal());
                      setSidebarOpen(false);
                    }}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5zm9 4V5H4v4h2V8a1 1 0 011-1h3a1 1 0 011 1v1zm-1 5a2 2 0 002-2v-1h1a2 2 0 002 2v2.5a2.5 2.5 0 01-2.5 2.5h-7a2.5 2.5 0 01-2.5-2.5V14h2v1.5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V14z" />
                    </svg>
                    Create Topic
                  </button>
                </li>
                <li>
                  <button
                    className="w-full flex items-center p-2 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      dispatch(openSubtopicModal());
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
                    Create Subtopic
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
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Quiz Management
                </h1>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  onClick={() => dispatch(openQuizInfoModal())}
                >
                  Create Quiz
                </button>
              </div>

              {selectedQuizId === null ? (
                <div>
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
                      {quizzes.map((quiz: Quiz) => (
                        <div
                          key={quiz.id}
                          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                        >
                          <h3 className="text-lg font-semibold text-gray-900">
                            {quiz.title} {quiz.id}
                          </h3>
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
                          <div className="mt-4 flex space-x-2">
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                              onClick={() => dispatch(selectQuiz(quiz.id))}
                            >
                              Add Questions
                            </button>
                            <button
                              className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                              onClick={() => handleEditQuiz(quiz)}
                            >
                              Edit
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No quizzes available.</p>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    className="mb-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition"
                    onClick={() => dispatch(selectQuiz(null))}
                  >
                    Back to Quizzes
                  </button>
                  <QuestionManager />
                </div>
              )}
            </div>
          </main>

          <Modal
            isOpen={isQuizInfoModalOpen}
            onClose={() => dispatch(closeQuizInfoModal())}
            onSave={handleQuizInfoSave}
            onCreateTopic={() => dispatch(openTopicModal())}
            onCreateSubtopic={() => dispatch(openSubtopicModal())}
            title="Enter Quiz Information"
            type="quizInfo"
            topics={topics}
          />
          <Modal
            isOpen={isEditQuizModalOpen}
            onClose={() => dispatch(closeEditQuizModal())}
            onSave={(data) => handleEditQuizSave(data.id, data)}
            onCreateTopic={() => dispatch(openTopicModal())}
            onCreateSubtopic={() => dispatch(openSubtopicModal())}
            title="Edit Quiz Information"
            type="quizInfo"
            topics={topics}
            initialQuizInfo={quizInfo}
          />
          <Modal
            isOpen={isTopicModalOpen}
            onClose={() => dispatch(closeTopicModal())}
            onSave={handleTopicSave}
            title="Create New Topic"
            placeholder="Enter topic name"
            type="topic"
          />
          <Modal
            isOpen={isSubtopicModalOpen}
            onClose={() => dispatch(closeSubtopicModal())}
            onSave={handleSubtopicSave}
            title="Create New Subtopic"
            placeholder="Enter subtopic name"
            type="subtopic"
            topics={topics}
          />
        </div>
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminDashboard;
