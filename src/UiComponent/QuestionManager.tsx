import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  addQuestion,
  editQuestion,
  deleteQuestion,
  fetchQuestionsByQuizId,
} from "@/store/quizSlice";
import { toast, ToastContainer } from "react-toastify";

interface Option {
  optionText: string;
  isCorrect: boolean;
  optionIndex: number;
}

interface Question {
  id?: number;
  questionText: string;
  // explanation?: string;
  questionType: "FILL_BLANK" | "TRUE_FALSE" | "MCQ";
  options: Option[];
}

 

const QuestionManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedQuizId, questions, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );

  const [questionForm, setQuestionForm] = useState<Question>({
    questionText: "",
    // explanation: "",
    questionType: "FILL_BLANK",
    options: [],
  });
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );

  // Fetch questions when quiz is selected
  useEffect(() => {
    if (selectedQuizId) {
      dispatch(fetchQuestionsByQuizId(selectedQuizId));
    }
  }, [selectedQuizId, dispatch]);

  // Reset options when question type changes
  useEffect(() => {
    if (questionForm.questionType === "FILL_BLANK") {
      setQuestionForm((prev) => ({ ...prev, options: [] }));
    } else if (questionForm.questionType === "TRUE_FALSE") {
      setQuestionForm((prev) => ({
        ...prev,
        options: [
          { optionText: "True", isCorrect: true, optionIndex: 1 },
          { optionText: "False", isCorrect: false, optionIndex: 2 },
        ],
      }));
    } else if (questionForm.questionType === "MCQ") {
      setQuestionForm((prev) => ({
        ...prev,
        options: [
          { optionText: "", isCorrect: false, optionIndex: 1 },
          { optionText: "", isCorrect: false, optionIndex: 2 },
          { optionText: "", isCorrect: false, optionIndex: 3 },
          { optionText: "", isCorrect: false, optionIndex: 4 },
        ],
      }));
    }
  }, [questionForm.questionType]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setQuestionForm((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      return { ...prev, options: newOptions };
    });
  };

  const handleCorrectOptionChange = (index: number) => {
    setQuestionForm((prev) => {
      const newOptions = prev.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }));
      return { ...prev, options: newOptions };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuizId) return;

    if (!questionForm.questionText.trim()) {
      alert("Question text is required.");
      return;
    }

    if (questionForm.questionType !== "FILL_BLANK") {
      const hasCorrectOption = questionForm.options.some(
        (opt) => opt.isCorrect
      );
      const allOptionsFilled = questionForm.options.every((opt) =>
        opt.optionText.trim()
      );
      if (!hasCorrectOption || !allOptionsFilled) {
        alert(
          "All options must be filled, and at least one must be correct for TRUE_FALSE or MCQ."
        );
        return;
      }
    }

    if (editingQuestionId) {
      dispatch(
        editQuestion({ questionId: editingQuestionId, question: questionForm })
      );
      setEditingQuestionId(null);
    } else {
      dispatch(addQuestion({ quizId: selectedQuizId, question: questionForm }));
    }

    setQuestionForm({
      questionText: "",
      // explanation: "",
      questionType: "FILL_BLANK",
      options: [],
    });
  };

  const handleEdit = (question: Question) => {
    console.log("Question : ", question);
    // return;
    setQuestionForm({
      ...question,
      // explanation: question.explanation || "",
      options: question.options.map((opt) => ({
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        optionIndex: opt.optionIndex,
      })),
    });
    setEditingQuestionId(question.id || null);
  };

  const handleDelete = (questionId: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        dispatch(deleteQuestion(questionId)).unwrap();
        toast.success("deleted successfully.");
      } catch (err) {
        toast.error(String(err));
      }
    }
  };

  if (!selectedQuizId) return null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      {loading && (
        <div className="flex justify-center mb-4">
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

      <h2 className="text-2xl font-semibold mb-4">
        Manage Questions for Quiz ID: {selectedQuizId}
      </h2>

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="questionText"
            className="block text-sm font-medium text-gray-700"
          >
            Question Text
          </label>
          <input
            id="questionText"
            name="questionText"
            type="text"
            value={questionForm.questionText}
            onChange={handleInputChange}
            placeholder="Enter question text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        {/* <div>
          <label
            htmlFor="explanation"
            className="block text-sm font-medium text-gray-700"
          >
            Explanation (Optional)
          </label>
          <textarea
            id="explanation"
            name="explanation"
            value={questionForm.explanation}
            onChange={handleInputChange}
            placeholder="Enter explanation"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div> */}
        <div>
          <label
            htmlFor="questionType"
            className="block text-sm font-medium text-gray-700"
          >
            Question Type
          </label>
          <select
            id="questionType"
            name="questionType"
            value={questionForm.questionType}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="FILL_BLANK">Fill in the Blank</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="MCQ">Multiple Choice</option>
          </select>
        </div>
        {questionForm.questionType !== "FILL_BLANK" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            {questionForm.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={option.optionText}
                  onChange={(e) =>
                    handleOptionChange(index, "optionText", e.target.value)
                  }
                  placeholder={`Option ${index + 1}`}
                  className="w-full p-2 border border-gray-300 rounded"
                  readOnly={questionForm.questionType === "TRUE_FALSE"}
                  required
                />
                <input
                  type="radio"
                  name="correctOption"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectOptionChange(index)}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Correct</span>
              </div>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {editingQuestionId ? "Update Question" : "Add Question"}
        </button>
      </form>

      {/* Question List */}
      {questions.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold mb-2">Questions</h3>
          {questions.map((question) => (
            <div
              key={question.id}
              className="p-4 border border-gray-200 rounded mb-2"
            >
              <p className="font-medium">{question.questionText}</p>
              {/* <p className="text-sm text-gray-600">
                explanation: {question.explanation}
              </p> */}
              <p className="text-sm text-gray-600">
                Type: {question.questionType}
              </p>
              {question.explanation && (
                <p className="text-sm text-gray-600">
                  Explanation: {question.explanation}
                </p>
              )}
              {question.options.length > 0 && (
                <ul className="list-disc pl-5">
                  {question.options.map((opt) => (
                    <li
                      key={opt.optionIndex}
                      className={opt.isCorrect ? "text-green-600" : ""}
                    >
                      {opt.optionText} {opt.isCorrect && "(Correct)"}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(question)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(question.id!)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No questions added yet.</p>
      )}

      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      <ToastContainer />
    </div>
  );
};

export default QuestionManager;
