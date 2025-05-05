import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice";
import authReducer from "./authSlice";
export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
