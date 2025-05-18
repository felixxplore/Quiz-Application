import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";

interface Subtopic {
  id: number;
  name: string;
  topicId?: number;
}

interface TopicDTO {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
  subtopics: Subtopic[];
}

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
  explanation?: string;
  questionType: "FILL_BLANK" | "TRUE_FALSE" | "MCQ";
  quizId: number;
  options: AnswerOptionOption[];
  correctAnswer?: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  createdBy: string;
  topicId: number;
  subtopicId: number;
  topicName: string;
  subtopicName: string;
  topic: TopicDTO | null;
  questionCount: number;
  participants: number;
  ageGroup: string;
}

interface QuizInfo {
  title: string;
  description: string;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  topicId: number;
  subtopicId: number;
  createdBy?: string;
  topicName?: string;
  subtopicName?: string;
  id?: number;
}

type Submission = {
  quizId: number;
  submittedAt: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
};

interface AnswerSubmission {
  questionId: number;
  questionText: string;
  questionType: string;
  selectedOptionId: number;
  selectedOptionText: string;
  isCorrect: boolean;
  correctAnswer: string;
  options: { optionId: number; optionText: string; isCorrect: boolean }[];
}

interface QuizSubmission {
  submissionId: number; // Add submissionId
  quizId: number;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  submittedAt: string;
  answers: AnswerSubmission[];
}
interface QuizState {
  isTopicModalOpen: boolean;
  isSubtopicModalOpen: boolean;
  isQuizInfoModalOpen: boolean;
  isEditQuizModalOpen: boolean;
  quizInfo: QuizInfo;
  topics: Topic[];
  quizzes: Quiz[];
  quiz: Quiz | null; // Added to store single quiz; // Added to store single question
  submissionsHistory: QuizSubmission[];
  selectedQuizId: number | null;
  questions: Question[];
  loading: boolean;
  error: string | null;
  quizSubmission: Submission | null; // Add this to store the latest submission
}

const initialState: QuizState = {
  isTopicModalOpen: false,
  isSubtopicModalOpen: false,
  isQuizInfoModalOpen: false,
  isEditQuizModalOpen: false,
  quizInfo: {
    title: "",
    description: "",
    difficultyLevel: "EASY",
    timeLimit: 0,
    topicId: 0,
    subtopicId: 0,
    id: 0,
  },
  topics: [],
  quizzes: [],
  quiz: null, // Initialize as null
  selectedQuizId: null,
  questions: [],
  submissionsHistory: [],
  loading: false,
  error: null,
  quizSubmission: null, // Initialize as null
};

// Async thunk for fetching topics
export const fetchTopics = createAsyncThunk(
  "quiz/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/topics/getAll");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch topics");
    }
  }
);

// Async thunk for creating a topic
export const createTopic = createAsyncThunk(
  "quiz/createTopic",
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/topics/create", { name });
      console.log("CreateTopic : ", response);
      return response.data;
    } catch (error: any) {
      console.log("TopicCreate : ", error);
      return rejectWithValue(error.response?.data || "Failed to create topic");
    }
  }
);

// Async thunk for fetching subtopics
export const fetchSubtopics = createAsyncThunk(
  "quiz/fetchSubtopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/subtopics/getAll");
      console.log("fetch subtopic : ", response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch subtopics"
      );
    }
  }
);

// Async thunk for creating a subtopic
export const createSubtopic = createAsyncThunk(
  "quiz/createSubtopic",
  async (
    { name, topicId }: { name: string; topicId: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/subtopics/create", {
        name,
        topic: { id: topicId },
      });
      dispatch(fetchTopics());
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data || "Failed to create subtopic"
      );
    }
  }
);

// Async thunk for creating a quiz
export const createQuiz = createAsyncThunk(
  "quiz/createQuiz",
  async (
    quizInfo: {
      title: string;
      description: string;
      difficultyLevel: "EASY" | "MEDIUM" | "HARD";
      timeLimit: number;
      topicId: number;
      subtopicId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/quizzes/create", {
        ...quizInfo,
        timeLimit: quizInfo.timeLimit || 0,
        topicId: quizInfo.topicId || 0,
        subtopicId: quizInfo.subtopicId || 0,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create quiz");
    }
  }
);

// Async thunk for fetching all quizzes
export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/quizzes/getAll");
      console.log("fetch quiz : ", response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch quizzes");
    }
  }
);

// Async thunk for fetching a quiz by ID
export const fetchQuizById = createAsyncThunk(
  "quiz/fetchQuizById",
  async (quizId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      console.log("fetch quiz by id : ", response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch quiz");
    }
  }
);

// Async thunk for updating a quiz
export const updateQuiz = createAsyncThunk(
  "quiz/updateQuiz",
  async (
    quizInfo: {
      id: number;
      title: string;
      description: string;
      difficultyLevel: "EASY" | "MEDIUM" | "HARD";
      timeLimit: number;
      createdBy?: string;
      topicId: number;
      subtopicId: number;
      topicName?: string;
      subtopicName?: string;
      topic?: TopicDTO;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/quizzes/${quizInfo.id}`, {
        id: quizInfo.id,
        title: quizInfo.title,
        description: quizInfo.description,
        difficultyLevel: quizInfo.difficultyLevel,
        timeLimit: quizInfo.timeLimit,
        createdBy: quizInfo.createdBy || "admin", // Default to "admin" if not provided
        topicId: quizInfo.topicId,
        subtopicId: quizInfo.subtopicId,
        topicName: quizInfo.topicName,
        subtopicName: quizInfo.subtopicName,
        topic: quizInfo.topic || {
          id: quizInfo.topicId,
          name: quizInfo.topicName || "",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update quiz");
    }
  }
);

// Async thunk for fetching questions by quiz ID
export const fetchQuestionsByQuizId = createAsyncThunk(
  "quiz/fetchQuestionsByQuizId",
  async (quizId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/questions/${quizId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch questions"
      );
    }
  }
);

// Async thunk for adding a question
export const addQuestion = createAsyncThunk(
  "quiz/addQuestion",
  async (
    { quizId, question }: { quizId: number; question: Question },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/questions/add/${quizId}`, question);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add question");
    }
  }
);

// Async thunk for editing a question
export const editQuestion = createAsyncThunk(
  "quiz/editQuestion",
  async (
    { questionId, question }: { questionId: number; question: Question },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/questions/${questionId}`, question);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to edit question");
    }
  }
);

// Async thunk for deleting a question
export const deleteQuestion = createAsyncThunk(
  "quiz/deleteQuestion",
  async (questionId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/questions/${questionId}`);
      return questionId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete question"
      );
    }
  }
);

// Async thunk for editing a quiz
export const editQuiz = createAsyncThunk(
  "quiz/editQuiz",
  async (
    { quizId, quizInfo }: { quizId: number; quizInfo: QuizInfo },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/quizzes/${quizId}`, {
        ...quizInfo,
        timeLimit: quizInfo.timeLimit || 0,
        topicId: quizInfo.topicId || 0,
        subtopicId: quizInfo.subtopicId || 0,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to edit quiz");
    }
  }
);

// Async thunk for deleting a quiz
export const deleteQuiz = createAsyncThunk<
  number, // Return type (quizId)
  number, // Argument type (quizId)
  { rejectValue: string } // Rejected value type
>("quiz/deleteQuiz", async (quizId: number, { rejectWithValue }) => {
  try {
    await api.delete(`/quizzes/${quizId}`);
    return quizId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to delete quiz");
  }
});

export const fetchUserSubmissions = createAsyncThunk(
  "quiz/fetchUserSubmissions",
  async () => {
    // const state = getState() as RootState;
    const response = await api.get("/quiz/submissions");
    console.log("come from fetch user submissions : ", response);
    return response.data;
  }
);
// Async thunk for submitting a quiz (user)
export const submitQuiz = createAsyncThunk(
  "quiz/submitQuiz",
  async (
    {
      quizId,
      answers,
    }: {
      quizId: number;
      answers: Array<{ questionId: number; selectedOptionId: number }>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/quiz/submit", { quizId, answers });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit quiz"
      );
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    openTopicModal(state) {
      state.isTopicModalOpen = true;
    },
    closeTopicModal(state) {
      state.isTopicModalOpen = false;
    },
    openSubtopicModal(state) {
      state.isSubtopicModalOpen = true;
    },
    closeSubtopicModal(state) {
      state.isSubtopicModalOpen = false;
    },
    openQuizInfoModal(state) {
      state.isQuizInfoModalOpen = true;
    },
    closeQuizInfoModal(state) {
      state.isQuizInfoModalOpen = false;
    },
    openEditQuizModal(state, action: { payload: QuizInfo }) {
      state.isEditQuizModalOpen = true;
      state.quizInfo = action.payload;
    },
    closeEditQuizModal(state) {
      state.isEditQuizModalOpen = false;
      state.quizInfo = initialState.quizInfo;
    },
    selectQuiz(state, action: { payload: number | null }) {
      state.selectedQuizId = action.payload;
      state.questions = []; // Reset questions when selecting a new quiz
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
        if (action.payload.length > 0) {
          state.quizInfo.topicId = action.payload[0].id;
          if (action.payload[0].subtopics.length > 0) {
            state.quizInfo.subtopicId = action.payload[0].subtopics[0].id;
          } else {
            state.quizInfo.subtopicId = 0;
          }
        } else {
          state.quizInfo.topicId = 0;
          state.quizInfo.subtopicId = 0;
        }
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics.push(action.payload);
        state.quizInfo.topicId = action.payload.id;
        state.quizInfo.subtopicId = 0;
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubtopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubtopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics.forEach((topic) => {
          topic.subtopics = action.payload.filter(
            (sub: Subtopic) => sub.topicId === topic.id
          );
        });
      })
      .addCase(fetchSubtopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSubtopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubtopic.fulfilled, (state) => {
        state.loading = false;
        // Do nothing; fetchTopics is dispatched in the thunk
      })
      .addCase(createSubtopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes.push(action.payload);
        state.quizInfo = initialState.quizInfo;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.quiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuestionsByQuizId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsByQuizId.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsByQuizId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.questions.findIndex(
          (q) => q.id === action.payload.id
        );
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(editQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter(
          (q) => q.id !== action.payload
        );
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editQuiz.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quizzes.findIndex(
          (q) => q.id === action.payload.id
        );
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
      })
      .addCase(editQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = state.quizzes.filter((q) => q.id !== action.payload);
        if (state.selectedQuizId === action.payload) {
          state.selectedQuizId = null;
          state.quiz = null; // Reset quiz when deleted
          state.questions = [];
        }
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuizId = null;
        state.questions = [];
        state.quizSubmission = action.payload; // Store the submission result
        // state.submissions.push(action.payload); // Also add to submissions array
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionsHistory = action.payload;
      })
      .addCase(fetchUserSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  openTopicModal,
  closeTopicModal,
  openSubtopicModal,
  closeSubtopicModal,
  openQuizInfoModal,
  closeQuizInfoModal,
  openEditQuizModal,
  closeEditQuizModal,
  selectQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
