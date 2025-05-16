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
import { Loader2, Trash2, Edit, Plus } from "lucide-react";
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
} // it Quiz Page Component
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
          toast.error(error || "Failed to load quiz data.");
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
        description: quiz.description,
        difficultyLevel: quiz.difficultyLevel,
        timeLimit: quiz.timeLimit.toString(),
        topicId: quiz.topicId.toString(),
        subtopicId: quiz.subtopicId.toString(),
      });
    }
  }, [quiz]);

  // handle edit quiz
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
        toast.success("Quiz updated successfully!");
        await dispatch(fetchQuizById(editQuizData.id));
      } catch (error: any) {
        console.error("Error updating quiz:", error);
        toast.error(error || "Failed to update quiz. Please try again.");
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  // handle delete quiz
  const handleDeleteQuiz = async () => {
    if (quizId) {
      try {
        await dispatch(deleteQuiz(Number(quizId))).unwrap();
        toast.success("Quiz deleted successfully!");
        navigate("/admin/quizzes");
      } catch (error: any) {
        console.error("Error deleting quiz:", error);
        toast.error(error || "Failed to delete quiz. Please try again.");
      }
    }
  };

  // handle add question
  const handleAddQuestion = async () => {
    if (
      quizId &&
      newQuestion.questionText.trim() &&
      newQuestion.options.every((opt) => opt.optionText.trim()) &&
      newQuestion.options.some((opt) => opt.isCorrect) &&
      newQuestion.questionType &&
      newQuestion.quizId
    ) {
      try {
        console.log("Adding question:", {
          quizId: Number(quizId),
          question: newQuestion,
        });
        // return;
        await dispatch(
          addQuestion({ quizId: Number(quizId), question: newQuestion })
        ).unwrap();
        toast.success("Question added successfully!");
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
        });
        setIsQuestionDialogOpen(false);
        await dispatch(fetchQuestionsByQuizId(Number(quizId)));
      } catch (error: any) {
        console.error("Error adding question:", error);
        toast.error(error || "Failed to add question. Please try again.");
      }
    } else {
      toast.error(
        "Please fill in all question fields correctly and select a correct option."
      );
    }
  };

  // handle edit question
  const handleEditQuestion = async () => {
    console.log("Edit question data:", editQuestionData);
    console.log("quizId:", quizId);
    if (
      editQuestionData &&
      editQuestionData.questionText.trim() &&
      editQuestionData.options.every((opt) => opt.optionText.trim()) &&
      editQuestionData.options.some((opt) => opt.isCorrect) &&
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
        toast.success("Question updated successfully!");
        setIsEditQuestionDialogOpen(false);
        if (quizId) {
          await dispatch(fetchQuestionsByQuizId(Number(quizId)));
        }
      } catch (error: any) {
        console.error("Error updating question:", error);
        toast.error(error || "Failed to update question. Please try again.");
      }
    } else {
      console.log("else Edit question data:", editQuestionData);
      toast.error(
        "Please fill in all question fields correctly and select a correct option."
      );
    }
  };

  // handle delete question
  const handleDeleteQuestion = async () => {
    if (deleteQuestionId !== null) {
      try {
        await dispatch(deleteQuestion(deleteQuestionId)).unwrap();
        toast.success("Question deleted successfully!");
        setDeleteQuestionId(null);
        setIsDeleteQuestionDialogOpen(false);
        if (quizId) {
          await dispatch(fetchQuestionsByQuizId(Number(quizId)));
        }
      } catch (error: any) {
        console.error("Error deleting question:", error);
        toast.error(error || "Failed to delete question. Please try again.");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !editQuizData) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Quiz not found."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Quiz</h1>
        <Button variant="outline" asChild>
          <Link to="/admin/quizzes">Back to Quizzes</Link>
        </Button>
      </div>

      {/* Edit Quiz Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="edit-quiz-title" className="mb-2">
                Title
              </Label>
              <Input
                id="edit-quiz-title"
                value={editQuizData.title}
                onChange={(e) =>
                  setEditQuizData({ ...editQuizData, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-quiz-description" className="mb-2">
                Description
              </Label>
              <Input
                id="edit-quiz-description"
                value={editQuizData.description}
                onChange={(e) =>
                  setEditQuizData({
                    ...editQuizData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-quiz-difficulty" className="mb-2">
                Difficulty
              </Label>
              <Select
                value={editQuizData.difficultyLevel}
                onValueChange={(value) =>
                  setEditQuizData({
                    ...editQuizData,
                    difficultyLevel: value as "EASY" | "MEDIUM" | "HARD",
                  })
                }
              >
                <SelectTrigger id="edit-quiz-difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="z-[1000] bg-white">
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-quiz-time-limit" className="mb-2">
                Time Limit (minutes)
              </Label>
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
              />
            </div>
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
            />
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
            />
            <div className="flex gap-4">
              <Button onClick={handleEditQuiz}>Save Changes</Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteQuizDialogOpen(true)}
              >
                Delete Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Questions</CardTitle>
            <Button onClick={() => setIsQuestionDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <p>No questions found for this quiz.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border p-4 rounded-lg  shadow-sm bg-gray-50"
                >
                  {/* question heaer */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className=" text-left font-semibold text-lg">
                        Q{index + 1}, {question.questionText}
                      </p>
                      <p className="text-sm text-gray-500 text-left mt-1">
                        Type: {question.questionType}
                      </p>
                    </div>

                    {/* action buttons */}
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditQuestionData({
                            id: question.id,
                            questionText: question.questionText,
                            quizId: Number(quizId),
                            questionType: question.questionType,
                            options: [...question.options],
                          });
                          setIsEditQuestionDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        className="bg-red-500 text-white hover:bg-red-600"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteQuestionId(question.id);
                          setIsDeleteQuestionDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                  {/* question options */}

                  <div className="mt-3">
                    <ul className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const optionLabel = String.fromCharCode(97 + optIndex); // a, b, c, d
                        return (
                          <li
                            key={option.optionIndex}
                            className="flex items-center text-left"
                          >
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-sm font-medium ${
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
                                  ? "text-green-600"
                                  : "text-gray-800"
                              }
                            >
                              {option.optionText}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
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
        <DialogContent className="bg-white z-[101]">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="question-text" className="mb-2">
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
                placeholder="Enter question text"
              />
            </div>
            <div>
              <Label htmlFor="question-type" className="mb-2">
                Question Type
              </Label>
              <Select
                value={newQuestion.questionType}
                onValueChange={(value) =>
                  setNewQuestion({
                    ...newQuestion,
                    questionType: value as "FILL_BLANK" | "TRUE_FALSE" | "MCQ",
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
                <SelectTrigger id="question-type">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent className="z-[1000] bg-white">
                  <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
                  <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                  <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="explanation" className="mb-2">
                Explanation (Optional)
              </Label>
              <Input
                id="explanation"
                value={newQuestion.explanation || ""}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    explanation: e.target.value,
                  })
                }
                placeholder="Enter explanation"
              />
            </div>
            {newQuestion.questionType !== "FILL_BLANK" && (
              <>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label
                        htmlFor={`option-${index}`}
                        className="mb-2"
                      >{`Option ${index + 1}`}</Label>
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
                        placeholder={`Enter option ${index + 1}`}
                        disabled={newQuestion.questionType === "TRUE_FALSE"}
                      />
                    </div>
                    <div>
                      <Label className="mb-2">Correct</Label>
                      <div className="flex items-center">
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
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            <Button onClick={handleAddQuestion}>Add Question</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog
        open={isEditQuestionDialogOpen}
        onOpenChange={setIsEditQuestionDialogOpen}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {editQuestionData && (
            <div className="grid gap-4">
              <div>
                <Label htmlFor="edit-question-text" className="mb-2">
                  Question Text
                </Label>
                <Input
                  id="edit-question-text"
                  value={editQuestionData.questionText}
                  onChange={(e) =>
                    setEditQuestionData({
                      ...editQuestionData,
                      questionText: e.target.value,
                    })
                  }
                  placeholder="Enter question text"
                />
              </div>
              <div>
                <Label htmlFor="edit-question-type" className="mb-2">
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
                          : editQuestionData.options.length === 2
                          ? [
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
                            ]
                          : editQuestionData.options,
                    })
                  }
                >
                  <SelectTrigger id="edit-question-type">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000] bg-white">
                    <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
                    <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                    <SelectItem value="FILL_BLANK">
                      Fill in the Blank
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editQuestionData.questionType !== "FILL_BLANK" && (
                <>
                  {editQuestionData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label
                          htmlFor={`edit-option-${index}`}
                          className="mb-2"
                        >{`Option ${index + 1}`}</Label>
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
                          placeholder={`Enter option ${index + 1}`}
                          disabled={
                            editQuestionData.questionType === "TRUE_FALSE"
                          }
                        />
                      </div>
                      <div>
                        <Label className="mb-2">Correct</Label>
                        <div className="flex items-center">
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
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <Button onClick={handleEditQuestion}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Question Dialog */}
      <Dialog
        open={isDeleteQuestionDialogOpen}
        onOpenChange={setIsDeleteQuestionDialogOpen}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this question? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteQuestionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600"
              onClick={handleDeleteQuestion}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Quiz Dialog */}
      <Dialog
        open={isDeleteQuizDialogOpen}
        onOpenChange={setIsDeleteQuizDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this quiz? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteQuizDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuiz}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditQuizPage;
