import api from "@/api/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Subtopic {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
  subtopics: Subtopic[];
}

interface Options {
  optionText: string;
  optionIndex: number;
  isCorrect: boolean;
}

interface Question {
  id: number;
  questionText: string;
  explanation: string;
  questionType: string;
  options: Options[];
}

interface QuizInfo {
  title: string;
  description: string;
  difficultyLevel: string;
  timeLimit: string;
  topicId: number;
  subtopicId: number;
}

interface QuizState {
  isTopicModalOpen: boolean;
  isSubtopicModalOpen: boolean;
  isQuizInfoModalOpen: boolean;
  quizInfo: QuizInfo;
  topics: Topic[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  isTopicModalOpen: false,
  isSubtopicModalOpen: false,
  isQuizInfoModalOpen: false,
  quizInfo: {
    title: "",
    description: "",
    difficultyLevel: "Easy",
    timeLimit: "",
    topicId: 0,
    subtopicId: 0,
  },
  topics: [],
  loading: false,
  error: null,
};

// Async thunk for fetching topics (with nested subtopics)
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

// create topic
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
      const response = await api.post("/subtopics/create", {
        name,
        topic: { id: topicId },
      });
      dispatch(fetchTopics());
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
      difficultyLevel: string;
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to create quiz"
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
          }
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
      })
      .addCase(createSubtopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state) => {
        state.loading = false;
        state.quizInfo = initialState.quizInfo;
      })
      .addCase(createQuiz.rejected, (state, action) => {
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
} = quizSlice.actions;

export default quizSlice.reducer;
