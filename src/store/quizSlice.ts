import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
import { RootState } from "./store";

interface Subtopic {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
  subtopics: Subtopic[];
}

interface Option {
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
  quizId?: number;
  options: Option[];
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
  topic: Topic | null;
}

interface QuizInfo {
  title: string;
  description: string;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  topicId: number;
  subtopicId: number;
}

interface QuizState {
  isTopicModalOpen: boolean;
  isSubtopicModalOpen: boolean;
  isQuizInfoModalOpen: boolean;
  isEditQuizModalOpen: boolean;
  quizInfo: QuizInfo;
  topics: Topic[];
  quizzes: Quiz[];
  submissions: SubmissionResult[];
  selectedQuizId: number | null;
  questions: Question[];
  loading: boolean;
  error: string | null;
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
  },
  topics: [],
  quizzes: [],
  selectedQuizId: null,
  questions: [],
  submissions: [],
  loading: false,
  error: null,
};

// Async thunk for fetching topics
export const fetchTopics = createAsyncThunk(
  "quiz/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/topics/getAll");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch topics"
      );
    }
  }
);

// Async thunk for creating a topic
export const createTopic = createAsyncThunk(
  "quiz/createTopic",
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/topics/create", { name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create topic"
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
      const response = await api.post("/subtopics/create", { name, topicId });
      dispatch(fetchTopics());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subtopic"
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
      timeLimit: string;
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to create quiz"
      );
    }
  }
);

// Async thunk for fetching all quizzes
export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/quizzes/getAll");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch quizzes"
      );
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
        error.response?.data?.message || "Failed to fetch questions"
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to add question"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit question"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit quiz"
      );
    }
  }
);

// Async thunk for deleting a quiz
export const deleteQuiz = createAsyncThunk(
  "quiz/deleteQuiz",
  async (quizId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/quizzes/${quizId}`);
      return quizId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete quiz"
      );
    }
  }
);

export const fetchUserSubmissions = createAsyncThunk(
  "quiz/fetchUserSubmissions",
  async (_, { getState }) => {
    const state = getState() as RootState;
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
    selectQuiz(state, action: { payload: number }) {
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
        state.submissions = action.payload;
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
