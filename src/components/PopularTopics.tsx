// import { Link } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Calculator,
//   Microscope,
//   BookOpen,
//   Globe,
//   Code,
//   Music,
//   Palette,
//   Brain,
// } from "lucide-react";
// import type { JSX } from "react";

// type Topic = {
//   id: number;
//   name: string;
//   icon: JSX.Element;
//   color: string;
//   iconColor: string;
//   quizCount: number;
// };

// const popularTopics: Topic[] = [
//   {
//     id: 1,
//     name: "Mathematics",
//     icon: <Calculator className="h-8 w-8" />,
//     color: "bg-purple-DEFAULT/10",
//     iconColor: "text-purple-DEFAULT",
//     quizCount: 45,
//   },
//   {
//     id: 2,
//     name: "Science",
//     icon: <Microscope className="h-8 w-8" />,
//     color: "bg-magenta-DEFAULT/10",
//     iconColor: "text-magenta-DEFAULT",
//     quizCount: 38,
//   },
//   {
//     id: 3,
//     name: "History",
//     icon: <BookOpen className="h-8 w-8" />,
//     color: "bg-orange-DEFAULT/10",
//     iconColor: "text-orange-DEFAULT",
//     quizCount: 32,
//   },
//   {
//     id: 4,
//     name: "Geography",
//     icon: <Globe className="h-8 w-8" />,
//     color: "bg-yellow-DEFAULT/10",
//     iconColor: "text-yellow-DEFAULT",
//     quizCount: 27,
//   },
//   {
//     id: 5,
//     name: "Programming",
//     icon: <Code className="h-8 w-8" />,
//     color: "bg-purple-DEFAULT/10",
//     iconColor: "text-purple-DEFAULT",
//     quizCount: 23,
//   },
//   {
//     id: 6,
//     name: "Music",
//     icon: <Music className="h-8 w-8" />,
//     color: "bg-magenta-DEFAULT/10",
//     iconColor: "text-magenta-DEFAULT",
//     quizCount: 19,
//   },
//   {
//     id: 7,
//     name: "Art",
//     icon: <Palette className="h-8 w-8" />,
//     color: "bg-orange-DEFAULT/10",
//     iconColor: "text-orange-DEFAULT",
//     quizCount: 15,
//   },
//   {
//     id: 8,
//     name: "Logic & Puzzles",
//     icon: <Brain className="h-8 w-8" />,
//     color: "bg-yellow-DEFAULT/10",
//     iconColor: "text-yellow-DEFAULT",
//     quizCount: 21,
//   },
// ];

// export function PopularTopics() {
//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
//       {popularTopics.map((topic) => (
//         <Link to={`/topics/${topic.id}`} key={topic.id}>
//           <Card className="h-full transition-all hover:shadow-md">
//             <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
//               <div className={`p-4 rounded-full ${topic.color}`}>
//                 <div className={topic.iconColor}>{topic.icon}</div>
//               </div>
//               <div>
//                 <h3 className="font-medium">{topic.name}</h3>
//                 <p className="text-sm text-muted-foreground">
//                   {topic.quizCount} Quizzes
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </Link>
//       ))}
//     </div>
//   );
// }

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopics } from "@/store/quizSlice";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Database, Braces, Gem, CircuitBoard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { JSX } from "react";
import type { AppDispatch, RootState } from "@/store/store";

interface Subtopic {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
  subtopics: Subtopic[];
}

interface TopicConfig {
  icon: JSX.Element;
  color: string;
  iconColor: string;
}

const topicConfigs: Record<string, TopicConfig> = {
  Java: {
    icon: <Code className="h-8 w-8" />,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  Javascript: {
    icon: <Braces className="h-8 w-8" />,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  Python: {
    icon: <Code className="h-8 w-8" />,
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  SQL: {
    icon: <Database className="h-8 w-8" />,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  Ruby: {
    icon: <Gem className="h-8 w-8" />,
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
  "C++": {
    icon: <CircuitBoard className="h-8 w-8" />,
    color: "bg-gray-100",
    iconColor: "text-gray-600",
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

  if (loading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8">Error: {error}</div>;
  if (topics.length === 0)
    return <div className="container py-8">No topics found.</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      <AnimatePresence>
        {topics.map((topic, index) => {
          const config = topicConfigs[topic.name] || {
            icon: <Code className="h-8 w-8" />,
            color: "bg-gray-100",
            iconColor: "text-gray-600",
          };

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link to={`/topics/${topic.id}`}>
                <Card className="h-full transition-all hover:shadow-md bg-white">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${config.color}`}>
                      <div className={config.iconColor}>{config.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-gray-600">
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