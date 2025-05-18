// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTopics } from "@/store/quizSlice";
// import { Link } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Code, Database, Braces, Gem, CircuitBoard } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import type { JSX } from "react";
// import type { AppDispatch, RootState } from "@/store/store";

// interface Subtopic {
//   id: number;
//   name: string;
// }

// interface Topic {
//   id: number;
//   name: string;
//   subtopics: Subtopic[];
// }

// interface TopicConfig {
//   icon: JSX.Element;
//   color: string;
//   iconColor: string;
// }

// const topicConfigs: Record<string, TopicConfig> = {
//   Java: {
//     icon: <Code className="h-8 w-8" />,
//     color: "bg-blue-100",
//     iconColor: "text-blue-600",
//   },
//   Javascript: {
//     icon: <Braces className="h-8 w-8" />,
//     color: "bg-yellow-100",
//     iconColor: "text-yellow-600",
//   },
//   Python: {
//     icon: <Code className="h-8 w-8" />,
//     color: "bg-green-100",
//     iconColor: "text-green-600",
//   },
//   SQL: {
//     icon: <Database className="h-8 w-8" />,
//     color: "bg-purple-100",
//     iconColor: "text-purple-600",
//   },
//   Ruby: {
//     icon: <Gem className="h-8 w-8" />,
//     color: "bg-red-100",
//     iconColor: "text-red-600",
//   },
//   "C++": {
//     icon: <CircuitBoard className="h-8 w-8" />,
//     color: "bg-gray-100",
//     iconColor: "text-gray-600",
//   },
// };

// export function PopularTopics() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { topics, loading, error } = useSelector(
//     (state: RootState) => state.quiz
//   );

//   useEffect(() => {
//     dispatch(fetchTopics());
//   }, [dispatch]);

//   if (loading) return <div className="container py-8">Loading...</div>;
//   if (error) return <div className="container py-8">Error: {error}</div>;
//   if (topics.length === 0)
//     return <div className="container py-8">No topics found.</div>;

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
//       <AnimatePresence>
//         {topics.map((topic, index) => {
//           const config = topicConfigs[topic.name] || {
//             icon: <Code className="h-8 w-8" />,
//             color: "bg-gray-100",
//             iconColor: "text-gray-600",
//           };

//           return (
//             <motion.div
//               key={topic.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3, delay: index * 0.1 }}
//             >
//               <Link to={`/topics/${topic.id}`}>
//                 <Card className="h-full transition-all hover:shadow-md bg-white">
//                   <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
//                     <div className={`p-4 rounded-full ${config.color}`}>
//                       <div className={config.iconColor}>{config.icon}</div>
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-gray-800">
//                         {topic.name}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {topic.subtopics.length} Subtopics
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             </motion.div>
//           );
//         })}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default PopularTopics;
// src/components/PopularTopics.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchTopics } from "@/store/quizSlice";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Database,
  Braces,
  Gem,
  CircuitBoard,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuizLoader from "./QuizLoader";
import type { JSX } from "react";

interface Topic {
  id: number;
  name: string;
  subtopics: string[];
}

interface TopicConfig {
  icon: JSX.Element;
  color: string;
  iconColor: string;
  gradient: string;
}

const topicConfigs: Record<string, TopicConfig> = {
  Java: {
    icon: <Code className="h-10 w-10" />,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    gradient: "from-blue-50 to-blue-200",
  },
  Javascript: {
    icon: <Braces className="h-10 w-10" />,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
    gradient: "from-yellow-50 to-yellow-200",
  },
  Python: {
    icon: <Code className="h-10 w-10" />,
    color: "bg-green-100",
    iconColor: "text-green-600",
    gradient: "from-green-50 to-green-200",
  },
  SQL: {
    icon: <Database className="h-10 w-10" />,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    gradient: "from-purple-50 to-purple-200",
  },
  Ruby: {
    icon: <Gem className="h-10 w-10" />,
    color: "bg-red-100",
    iconColor: "text-red-600",
    gradient: "from-red-50 to-red-200",
  },
  "C++": {
    icon: <CircuitBoard className="h-10 w-10" />,
    color: "bg-gray-100",
    iconColor: "text-gray-600",
    gradient: "from-gray-50 to-gray-200",
  },
};

export function PopularTopics() {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  if (loading) return <QuizLoader />;
  if (error)
    return <div className="container py-8 text-red-500">Error: {error}</div>;
  if (topics.length === 0)
    return <div className="container py-8">No topics found.</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      <AnimatePresence>
        {topics.map((topic, index) => {
          const config = topicConfigs[topic.name] || {
            icon: <BookOpen className="h-10 w-10" />,
            color: "bg-gray-100",
            iconColor: "text-gray-600",
            gradient: "from-gray-50 to-gray-200",
          };

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-full"
            >
              <Link to={`/topics/${topic.id}`}>
                <Card
                  className={`h-full bg-gradient-to-br ${
                    config.gradient
                  } rounded-lg border border-gray-200 transition-all hover:scale-105 hover:shadow-lg hover:border-${
                    config.iconColor.split("-")[1]
                  }-300`}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${config.color}`}>
                      <div className={config.iconColor}>{config.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {topic.subtopics.length} Subtopics
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default PopularTopics;
