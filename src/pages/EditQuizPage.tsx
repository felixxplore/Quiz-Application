"use client";

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BookOpen,
  ChevronLeft,
  Loader2,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  fetchTopics,
  fetchQuizById,
  deleteQuiz,
  fetchQuestionsByQuizId,
  addQuestion,
  editQuestion,
  deleteQuestion,
  editQuiz,
} from "@/store/quizSlice";
import toast from "react-hot-toast";
import { SearchableSelect } from "./AdminPanel";
import QuizLoader from "@/components/QuizLoader";

interface AnswerOptionOption {
  id?: number;
  optionText: string;
  isCorrect: boolean;
  optionIndex: number;
  questionId?: number;
}
interface Question {
  id?: number;
  questionText: string;
  questionType: "FILL_BLANK" | "TRUE_FALSE" | "MCQ";
  quizId: number;
  options: AnswerOptionOption[];
  explanation?: string; // Added to match usage in dialogs
}

const EditQuizPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const { quiz, topics, questions, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const [editQuizData, setEditQuizData] = useState<{
    id: number;
    title: string;
    description: string;
    difficultyLevel: "EASY" | "MEDIUM" | "HARD";
    timeLimit: string;
    topicId: string;
    subtopicId: string;
  } | null>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] =
    useState(false);
  const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] =
    useState(false);
  const [isDeleteQuizDialogOpen, setIsDeleteQuizDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({
    questionText: "",
    quizId: Number(quizId),
    questionType: "MCQ",
    options: [
      { optionText: "", isCorrect: false, optionIndex: 0 },
      { optionText: "", isCorrect: false, optionIndex: 1 },
      { optionText: "", isCorrect: false, optionIndex: 2 },
      { optionText: "", isCorrect: false, optionIndex: 3 },
    ],
    explanation: "",
  });
  const [editQuestionData, setEditQuestionData] = useState<Question | null>(
    null
  );
  const [deleteQuestionId, setDeleteQuestionId] = useState<
    number | undefined | null
  >(null);

  useEffect(() => {
    console.log("quizId:", quizId);
    if (quizId) {
      const fetchData = async () => {
        try {
          await Promise.all([
            dispatch(fetchQuizById(Number(quizId))).unwrap(),
            dispatch(fetchQuestionsByQuizId(Number(quizId))),
            dispatch(fetchTopics()),
          ]);
        } catch (error: any) {
          toast.error(error || "Failed to load quiz data.", {
            style: { background: "#fef2f2", color: "#dc2626" },
          });
          navigate("/admin/quizzes");
        }
      };
      fetchData();
    }
  }, [dispatch, quizId, navigate]);

  useEffect(() => {
    if (quiz) {
      setEditQuizData({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description || "",
        difficultyLevel: quiz.difficultyLevel,
        timeLimit: quiz.timeLimit.toString(),
        topicId: quiz.topicId.toString(),
        subtopicId: quiz.subtopicId.toString(),
      });
    }
  }, [quiz]);

  const handleEditQuiz = async () => {
    if (
      editQuizData &&
      editQuizData.title.trim() &&
      editQuizData.description.trim() &&
      editQuizData.difficultyLevel &&
      editQuizData.timeLimit &&
      editQuizData.topicId &&
      editQuizData.subtopicId
    ) {
      const quizInfo = {
        title: editQuizData.title,
        description: editQuizData.description,
        difficultyLevel: editQuizData.difficultyLevel as
          | "EASY"
          | "MEDIUM"
          | "HARD",
        timeLimit: Number(editQuizData.timeLimit),
        topicId: Number(editQuizData.topicId),
        subtopicId: Number(editQuizData.subtopicId),
      };
      try {
        await dispatch(
          editQuiz({ quizId: editQuizData.id, quizInfo })
        ).unwrap();
        toast.success("Quiz updated successfully!", {
          style: { background: "#f0fdf4", color: "#15803d" },
        });
        await dispatch(fetchQuizById(editQuizData.id));
      } catch (error: any) {
        console.error("Error updating quiz:", error);
        toast.error(error || "Failed to update quiz. Please try again.", {
          style: { background: "#fef2f2", color: "#dc2626" },
        });
      }
    } else {
      toast.error("Please fill in all fields.", {
        style: { background: "#fef2f2", color: "#dc2626" },
      });
    }
  };

  const handleDeleteQuiz = async () => {
    if (quizId) {
      try {
        await dispatch(deleteQuiz(Number(quizId))).unwrap();
        toast.success("Quiz deleted successfully!", {
          style: { background: "#f0fdf4", color: "#15803d" },
        });
        navigate("/admin/quizzes");
      } catch (error: any) {
        console.error("Error deleting quiz:", error);
        toast.error(error || "Failed to delete quiz. Please try again.", {
          style: { background: "#fef2f2", color: "#dc2626" },
        });
      }
    }
  };

  const handleAddQuestion = async () => {
    if (
      quizId &&
      newQuestion.questionText.trim() &&
      (newQuestion.questionType === "FILL_BLANK" ||
        (newQuestion.options.every((opt) => opt.optionText.trim()) &&
          newQuestion.options.some((opt) => opt.isCorrect))) &&
      newQuestion.questionType &&
      newQuestion.quizId
    ) {
      try {
        console.log("Adding question:", {
          quizId: Number(quizId),
          question: newQuestion,
        });
        await dispatch(
          addQuestion({ quizId: Number(quizId), question: newQuestion })
        ).unwrap();
        toast.success("Question added successfully!", {
          style: { background: "#f0fdf4", color: "#15803d" },
        });
        setNewQuestion({
          questionText: "",
          questionType: "MCQ",
          quizId: Number(quizId),
          options: [
            { optionText: "", isCorrect: false, optionIndex: 0 },
            { optionText: "", isCorrect: false, optionIndex: 1 },
            { optionText: "", isCorrect: false, optionIndex: 2 },
            { optionText: "", isCorrect: false, optionIndex: 3 },
          ],
          explanation: "",
        });
        setIsQuestionDialogOpen(false);
        await dispatch(fetchQuestionsByQuizId(Number(quizId)));
      } catch (error: any) {
        console.error("Error adding question:", error);
        toast.error(error || "Failed to add question. Please try again.", {
          style: { background: "#fef2f2", color: "#dc2626" },
        });
      }
    } else {
      toast.error(
        "Please fill in all question fields correctly and select a correct option.",
        {
          style: { background: "#fef2f2", color: "#dc2626" },
        }
      );
    }
  };

  const handleEditQuestion = async () => {
    console.log("Edit question data:", editQuestionData);
    console.log("quizId:", quizId);
    if (
      editQuestionData &&
      editQuestionData.questionText.trim() &&
      (editQuestionData.questionType === "FILL_BLANK" ||
        (editQuestionData.options.every((opt) => opt.optionText.trim()) &&
          editQuestionData.options.some((opt) => opt.isCorrect))) &&
      editQuestionData.questionType &&
      editQuestionData.quizId
    ) {
      try {
        console.log("Editing question:", {
          questionId: editQuestionData.id,
          question: editQuestionData,
        });
        await dispatch(
          editQuestion({
            questionId: editQuestionData.id,
            question: editQuestionData,
          })
        ).unwrap();
        toast.success("Question updated successfully!", {
          style: { background: "#f0fdf4", color: "#15803d" },
        });
        setIsEditQuestionDialogOpen(false);
        if (quizId) {
          await dispatch(fetchQuestionsByQuizId(Number(quizId)));
        }
      } catch (error: any) {
        console.error("Error updating question:", error);
        toast.error(error || "Failed to update question. Please try again.", {
          style: { background: "#fef2f2", color: "#dc2626" },
        });
      }
    } else {
      console.log("else Edit question data:", editQuestionData);
      toast.error(
        "Please fill in all question fields correctly and select a correct option.",
        {
          style: { background: "#fef2f2", color: "#dc2626" },
        }
      );
    }
  };

  const handleDeleteQuestion = async () => {
    if (deleteQuestionId !== null) {
      try {
        await dispatch(deleteQuestion(deleteQuestionId)).unwrap();
        toast.success("Question deleted successfully!", {
          style: { background: "#f0fdf4", color: "#15803d" },
        });
        setDeleteQuestionId(null);
        setIsDeleteQuestionDialogOpen(false);
        if (quizId) {
          await dispatch(fetchQuestionsByQuizId(Number(quizId)));
        }
      } catch (error: any) {
        console.error("Error deleting question:", error);
        toast.error(error || "Failed to delete question. Please try again.", {
          style: { background: "#fef2f2", color: "#dc2626" },
        });
      }
    }
  };

  const allSubtopics = topics.flatMap((topic) =>
    (topic.subtopics || []).map((subtopic) => ({
      ...subtopic,
      topicId: topic.id,
    }))
  );

  const filteredSubtopicsForEdit = editQuizData
    ? allSubtopics.filter((sub) =>
        editQuizData.topicId
          ? sub.topicId === Number(editQuizData.topicId)
          : true
      )
    : [];

//   if (loading) {
//     return <QuizLoader />;
//   }

  if (error || !editQuizData) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <Alert
          variant="destructive"
          className="rounded-lg border-red-500 bg-red-50"
        >
          <AlertTitle className="text-red-700">Error</AlertTitle>
          <AlertDescription className="text-red-600">
            {error || "Quiz not found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-8 bg-gray-50"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Quiz</h1>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="outline"
            asChild
            className="rounded-lg border-gray-200 hover:bg-gray-100 text-gray-700"
          >
            <Link to="/admin/quizzes">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Edit Quiz Form */}
      <Card className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Quiz Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* <div className="relative">
              <Input
                id="edit-quiz-title"
                value={editQuizData.title}
                onChange={(e) =>
                  setEditQuizData({ ...editQuizData, title: e.target.value })
                }
                className="mb-4 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800"
                required
              />
              <Label
                htmlFor="edit-quiz-title"
                className="absolute left-15 -top-6 text-sm text-grey-500"
              >
                Title
              </Label>
              <BookOpen className="absolute  left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                id="edit-quiz-description"
                value={editQuizData.description}
                onChange={(e) =>
                  setEditQuizData({
                    ...editQuizData,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800"
                required
              />
              <Label
                htmlFor="edit-quiz-description"
                className="absolute left-15 -top-6 text-sm text-grey-500 "
              >
                Description
              </Label>
              <BookOpen className="absolute left-3 top-1/3  transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Select
                value={editQuizData.difficultyLevel}
                onValueChange={(value) =>
                  setEditQuizData({
                    ...editQuizData,
                    difficultyLevel: value as "EASY" | "MEDIUM" | "HARD",
                  })
                }
              >
                <SelectTrigger
                  id="edit-quiz-difficulty"
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 h-12 text-gray-800 pl-10"
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-lg z-[1000]">
                  <SelectItem value="EASY" className="hover:bg-blue-100">
                    Easy
                  </SelectItem>
                  <SelectItem value="MEDIUM" className="hover:bg-blue-100">
                    Medium
                  </SelectItem>
                  <SelectItem value="HARD" className="hover:bg-blue-100">
                    Hard
                  </SelectItem>
                </SelectContent>
              </Select>
              <Label
                htmlFor="edit-quiz-difficulty"
                className="absolute left-15 -top-6 text-sm text-grey-500"
              >
                Difficulty
              </Label>
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                id="edit-quiz-time-limit"
                type="number"
                value={editQuizData.timeLimit}
                onChange={(e) =>
                  setEditQuizData({
                    ...editQuizData,
                    timeLimit: e.target.value,
                  })
                }
                className="w-full rounded-lg  border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800"
                required
              />
              <Label
                htmlFor="edit-quiz-time-limit"
                className="absolute left-15 -top-6 text-sm text-grey-500"
              >
                Time Limit (minutes)
              </Label>
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div> */}
            <div className="relative">
              <Input
                id="edit-quiz-title"
                value={editQuizData.title}
                onChange={(e) =>
                  setEditQuizData({ ...editQuizData, title: e.target.value })
                }
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800 py-0 box-border"
                placeholder="Enter quiz title"
                required
              />
              <Label
                htmlFor="edit-quiz-title"
                className="absolute left-3 -top-6 text-sm text-gray-500"
              >
                Title
              </Label>
              <BookOpen className="absolute left-3 top-[calc(50%+3px)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                id="edit-quiz-description"
                value={editQuizData.description}
                onChange={(e) =>
                  setEditQuizData({
                    ...editQuizData,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800 py-0 box-border "
                placeholder="Enter quiz description"
                required
              />
              <Label
                htmlFor="edit-quiz-description"
                className="absolute left-3 -top-6 text-sm text-gray-500"
              >
                Description
              </Label>
              <BookOpen className="absolute left-3 top-[calc(50%+3px)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative mt-3">
              <Select
                value={editQuizData.difficultyLevel}
                onValueChange={(value) =>
                  setEditQuizData({
                    ...editQuizData,
                    difficultyLevel: value as "EASY" | "MEDIUM" | "HARD",
                  })
                }
              >
                <SelectTrigger
                  id="edit-quiz-difficulty"
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 h-12 text-gray-800 pl-10 py-0 box-border"
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg shadow-lg z-[1000]">
                  <SelectItem value="EASY" className="hover:bg-blue-100">
                    Easy
                  </SelectItem>
                  <SelectItem value="MEDIUM" className="hover:bg-blue-100">
                    Medium
                  </SelectItem>
                  <SelectItem value="HARD" className="hover:bg-blue-100">
                    Hard
                  </SelectItem>
                </SelectContent>
              </Select>
              <Label
                htmlFor="edit-quiz-difficulty"
                className="absolute left-3 -top-6 text-sm text-gray-500"
              >
                Difficulty
              </Label>
              <BookOpen className="absolute left-3 top-[calc(40%)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative mt-3">
              <Input
                id="edit-quiz-time-limit"
                type="number"
                value={editQuizData.timeLimit}
                onChange={(e) =>
                  setEditQuizData({
                    ...editQuizData,
                    timeLimit: e.target.value,
                  })
                }
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800 py-0 box-border"
                placeholder="Enter time limit (minutes)"
                required
              />
              <Label
                htmlFor="edit-quiz-time-limit"
                className="absolute left-3 -top-6 text-sm text-gray-500 "
              >
                Time Limit (minutes)
              </Label>
              <BookOpen className="absolute left-3 top-[calc(50%+3px)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div>
              <SearchableSelect
                options={topics.map((topic) => ({
                  id: topic.id,
                  name: topic.name,
                }))}
                value={editQuizData.topicId}
                onChange={(value) =>
                  setEditQuizData({
                    ...editQuizData,
                    topicId: value,
                    subtopicId: "",
                  })
                }
                placeholder="Select topic"
                label="Topic"
                id="edit-quiz-topic"
                className="w-full rounded-lg  border-gray-200 focus:ring-2 focus:ring-blue-500 h-12 text-gray-400"
              />
            </div>
            <div>
              <SearchableSelect
                options={filteredSubtopicsForEdit.map((subtopic) => ({
                  id: subtopic.id,
                  name: subtopic.name,
                }))}
                value={editQuizData.subtopicId}
                onChange={(value) =>
                  setEditQuizData({ ...editQuizData, subtopicId: value })
                }
                placeholder="Select subtopic"
                label="Subtopic"
                id="edit-quiz-subtopic"
                className="w-full rounded-lg text-gray-400 border-gray-200 focus:ring-2 focus:ring-blue-500 h-12"
              />
            </div>
            <div className="sm:col-span-2 flex gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  onClick={handleEditQuiz}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-6 py-3"
                >
                  Save Changes
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteQuizDialogOpen(true)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg px-6 py-3"
                >
                  Delete Quiz
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <CardHeader>
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Questions
            </CardTitle>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={() => setIsQuestionDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No questions found for this quiz.
              </p>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  onClick={() => setIsQuestionDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-6 py-3"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add a Question
                </Button>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-left font-semibold text-lg text-gray-800">
                        Q{index + 1}. {question.questionText}
                      </p>
                      <p className="text-sm text-gray-500 text-left mt-1">
                        Type: {question.questionType}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditQuestionData({
                              id: question.id,
                              questionText: question.questionText,
                              quizId: Number(quizId),
                              questionType: question.questionType,
                              options: [...question.options],
                              explanation: question.explanation || "",
                            });
                            setIsEditQuestionDialogOpen(true);
                          }}
                          className="rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setDeleteQuestionId(question.id);
                            setIsDeleteQuestionDialogOpen(true);
                          }}
                          className="rounded-full bg-red-100 hover:bg-red-200 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ul className="space-y-3">
                      {question.options.map((option, optIndex) => {
                        const optionLabel = String.fromCharCode(97 + optIndex);
                        return (
                          <li
                            key={option.optionIndex}
                            className="flex items-center text-left"
                          >
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-sm font-medium ${
                                option.isCorrect
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {optionLabel}
                            </span>
                            <span
                              className={
                                option.isCorrect
                                  ? "text-green-600 font-medium"
                                  : "text-gray-800"
                              }
                            >
                              {option.optionText}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    {question.explanation && (
                      <p className="mt-4 text-sm text-gray-600">
                        <span className="font-semibold">Explanation:</span>{" "}
                        {question.explanation}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Question Dialog */}
      <Dialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
      >
        <DialogContent className="bg-white rounded-2xl shadow-xl max-w-lg backdrop-blur-sm z-[101]">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Add New Question
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 mt-4">
              <div className="relative">
                <Label htmlFor="question-text" className="text-gray-700 mb-2">
                  Question Text
                </Label>
                <Input
                  id="question-text"
                  value={newQuestion.questionText}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      questionText: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12 text-gray-800"
                  placeholder="Enter question text"
                  required
                />
                <BookOpen className="absolute left-3 top-[calc(50%+0.8rem)] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div>
                <Label htmlFor="question-type" className="text-gray-700 mb-2">
                  Question Type
                </Label>
                <Select
                  value={newQuestion.questionType}
                  onValueChange={(value) =>
                    setNewQuestion({
                      ...newQuestion,
                      questionType: value as
                        | "FILL_BLANK"
                        | "TRUE_FALSE"
                        | "MCQ",
                      options:
                        value === "TRUE_FALSE"
                          ? [
                              {
                                optionText: "True",
                                isCorrect: false,
                                optionIndex: 0,
                              },
                              {
                                optionText: "False",
                                isCorrect: false,
                                optionIndex: 1,
                              },
                            ]
                          : [
                              {
                                optionText: "",
                                isCorrect: false,
                                optionIndex: 0,
                              },
                              {
                                optionText: "",
                                isCorrect: false,
                                optionIndex: 1,
                              },
                              {
                                optionText: "",
                                isCorrect: false,
                                optionIndex: 2,
                              },
                              {
                                optionText: "",
                                isCorrect: false,
                                optionIndex: 3,
                              },
                            ],
                    })
                  }
                >
                  <SelectTrigger
                    id="question-type"
                    className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 h-12"
                  >
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-lg shadow-lg z-[1000]">
                    <SelectItem value="MCQ" className="hover:bg-blue-100">
                      Multiple Choice (MCQ)
                    </SelectItem>
                    <SelectItem
                      value="TRUE_FALSE"
                      className="hover:bg-blue-100"
                    >
                      True/False
                    </SelectItem>
                    <SelectItem
                      value="FILL_BLANK"
                      className="hover:bg-blue-100"
                    >
                      Fill in the Blank
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(newQuestion.questionType === "FILL_BLANK" ||
                newQuestion.questionType === "MCQ") && (
                <div className="space-y-4">
                  <Label className="text-gray-700">Options</Label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        id={`option-${index}`}
                        value={option.optionText}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = {
                            ...newOptions[index],
                            optionText: e.target.value,
                          };
                          setNewQuestion({
                            ...newQuestion,
                            options: newOptions,
                          });
                        }}
                        className="rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 h-12"
                        placeholder={`Option ${index + 1}`}
                        disabled={newQuestion.questionType === "TRUE_FALSE"}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options].map(
                              (opt, idx) => ({
                                ...opt,
                                isCorrect:
                                  idx === index ? e.target.checked : false,
                              })
                            );
                            setNewQuestion({
                              ...newQuestion,
                              options: newOptions,
                            });
                          }}
                          className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                        />
                        <Label className="text-gray-700">Correct</Label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  onClick={handleAddQuestion}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-6 py-3"
                >
                  Add Question
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog
        open={isEditQuestionDialogOpen}
        onOpenChange={setIsEditQuestionDialogOpen}
      >
        <DialogContent className="bg-white rounded-2xl shadow-xl max-w-lg backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Edit Question
              </DialogTitle>
            </DialogHeader>
            {editQuestionData && (
              <div className="grid gap-6 mt-4">
                <div className="relative">
                  <Input
                    id="edit-question-text"
                    value={editQuestionData.questionText}
                    onChange={(e) =>
                      setEditQuestionData({
                        ...editQuestionData,
                        questionText: e.target.value,
                      })
                    }
                    className="peer w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12"
                    required
                  />
                  <Label
                    htmlFor="edit-question-text"
                    className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-500"
                  >
                    Question Text
                  </Label>
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <Label
                    htmlFor="edit-question-type"
                    className="text-gray-700 mb-2"
                  >
                    Question Type
                  </Label>
                  <Select
                    value={editQuestionData.questionType}
                    onValueChange={(value) =>
                      setEditQuestionData({
                        ...editQuestionData,
                        questionType: value as
                          | "FILL_BLANK"
                          | "TRUE_FALSE"
                          | "MCQ",
                        options:
                          value === "TRUE_FALSE"
                            ? [
                                {
                                  optionText: "True",
                                  isCorrect: false,
                                  optionIndex: 0,
                                },
                                {
                                  optionText: "False",
                                  isCorrect: false,
                                  optionIndex: 1,
                                },
                              ]
                            : value === "FILL_BLANK"
                            ? []
                            : editQuestionData.options.length >= 4
                            ? editQuestionData.options
                            : [
                                {
                                  optionText: "",
                                  isCorrect: false,
                                  optionIndex: 0,
                                },
                                {
                                  optionText: "",
                                  isCorrect: false,
                                  optionIndex: 1,
                                },
                                {
                                  optionText: "",
                                  isCorrect: false,
                                  optionIndex: 2,
                                },
                                {
                                  optionText: "",
                                  isCorrect: false,
                                  optionIndex: 3,
                                },
                              ],
                      })
                    }
                  >
                    <SelectTrigger
                      id="edit-question-type"
                      className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 h-12"
                    >
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-lg shadow-lg z-[1000]">
                      <SelectItem value="MCQ" className="hover:bg-blue-100">
                        Multiple Choice (MCQ)
                      </SelectItem>
                      <SelectItem
                        value="TRUE_FALSE"
                        className="hover:bg-blue-100"
                      >
                        True/False
                      </SelectItem>
                      <SelectItem
                        value="FILL_BLANK"
                        className="hover:bg-blue-100"
                      >
                        Fill in the Blank
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Input
                    id="edit-explanation"
                    value={editQuestionData.explanation || ""}
                    onChange={(e) =>
                      setEditQuestionData({
                        ...editQuestionData,
                        explanation: e.target.value,
                      })
                    }
                    className="peer w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10 h-12"
                  />
                  <Label
                    htmlFor="edit-explanation"
                    className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-not-placeholder-shown:-top-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-500"
                  >
                    Explanation (Optional)
                  </Label>
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {editQuestionData.questionType !== "FILL_BLANK" && (
                  <div className="space-y-4">
                    <Label className="text-gray-700">Options</Label>
                    {editQuestionData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input
                          id={`edit-option-${index}`}
                          value={option.optionText}
                          onChange={(e) => {
                            const newOptions = [...editQuestionData.options];
                            newOptions[index] = {
                              ...newOptions[index],
                              optionText: e.target.value,
                            };
                            setEditQuestionData({
                              ...editQuestionData,
                              options: newOptions,
                            });
                          }}
                          className="rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 h-12"
                          placeholder={`Option ${index + 1}`}
                          disabled={
                            editQuestionData.questionType === "TRUE_FALSE"
                          }
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) => {
                              const newOptions = [
                                ...editQuestionData.options,
                              ].map((opt, idx) => ({
                                ...opt,
                                isCorrect:
                                  idx === index ? e.target.checked : false,
                              }));
                              setEditQuestionData({
                                ...editQuestionData,
                                options: newOptions,
                              });
                            }}
                            className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                          />
                          <Label className="text-gray-700">Correct</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={handleEditQuestion}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-6 py-3"
                  >
                    Save Changes
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Delete Question Dialog */}
      <Dialog
        open={isDeleteQuestionDialogOpen}
        onOpenChange={setIsDeleteQuestionDialogOpen}
      >
        <DialogContent className="bg-white rounded-2xl shadow-xl backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Confirm Delete
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 text-lg">
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            <DialogFooter className="mt-6 flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteQuestionDialogOpen(false)}
                  className="rounded-lg border-gray-200 hover:bg-gray-100 text-gray-700 px-6 py-3"
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="destructive"
                  onClick={handleDeleteQuestion}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg px-6 py-3"
                >
                  Delete
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Delete Quiz Dialog */}
      <Dialog
        open={isDeleteQuizDialogOpen}
        onOpenChange={setIsDeleteQuizDialogOpen}
      >
        <DialogContent className="bg-white rounded-2xl shadow-xl backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Confirm Delete
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 text-lg">
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </p>
            <DialogFooter className="mt-6 flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteQuizDialogOpen(false)}
                  className="rounded-lg border-gray-200 hover:bg-gray-100 text-gray-700 px-6 py-3"
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="destructive"
                  onClick={handleDeleteQuiz}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg px-6 py-3"
                >
                  Delete
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EditQuizPage;
