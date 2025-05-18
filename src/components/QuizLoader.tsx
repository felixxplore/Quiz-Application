// src/components/QuizLoader.tsx
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const QuizLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <BookOpen className="h-16 w-16 text-blue-500" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-blue-100 opacity-30"
        />
      </motion.div>
      <p className="mt-4 text-sm font-medium text-gray-600">
        Loading Quizzes...
      </p>
    </div>
  );
};

export default QuizLoader;
