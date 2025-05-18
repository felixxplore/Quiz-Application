// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "@/store/store";
// import { fetchTopics } from "@/store/quizSlice";
// import { Link, useParams } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { BookOpen, ArrowLeft } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const TopicDetail: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { topics, loading, error } = useSelector(
//     (state: RootState) => state.quiz
//   );
//   const { topicId } = useParams<{ topicId: string }>();

//   useEffect(() => {
//     if (topics.length === 0) {
//       dispatch(fetchTopics());
//     }
//   }, [dispatch, topics]);

//   const topic = topics.find((t) => t.id === Number(topicId));

//   if (loading) return <div className="container py-8">Loading...</div>;
//   if (error) return <div className="container py-8">Error: {error}</div>;
//   if (!topic) return <div className="container py-8">Topic not found.</div>;

//   return (
//     <div className="container py-8 max-w-4xl">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="mb-6"
//       >
//         <Button
//           asChild
//           variant="outline"
//           className="hover:bg-blue-50 transition-colors duration-200"
//         >
//           <Link to="/topics">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Topics
//           </Link>
//         </Button>
//       </motion.div>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Card className="bg-white shadow-sm">
//           <CardHeader>
//             <CardTitle className="text-2xl text-gray-800">
//               {topic.name}
//             </CardTitle>
//             <p className="text-sm text-gray-600">
//               {topic.subtopics.length} Subtopics
//             </p>
//           </CardHeader>
//           <CardContent>
//             {topic.subtopics.length === 0 ? (
//               <p className="text-gray-600">No subtopics available.</p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <AnimatePresence>
//                   {topic.subtopics.map((subtopic, index) => (
//                     <motion.div
//                       key={subtopic.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3, delay: index * 0.1 }}
//                     >
//                       <Card className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
//                         <CardContent className="p-4 flex items-center gap-3">
//                           <BookOpen className="h-6 w-6 text-blue-500" />
//                           <p className="text-gray-800 font-medium">
//                             {subtopic.name}
//                           </p>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };

// export default TopicDetail;
// src/components/TopicDetail.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchTopics } from '@/store/quizSlice';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowLeft, Code, Database, Braces, Gem, CircuitBoard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizLoader from './QuizLoader';
import type { JSX } from 'react';

interface Topic {
  id: number;
  name: string;
  subtopics: { id: number; name: string }[];
}

interface TopicConfig {
  icon: JSX.Element;
  color: string;
  iconColor: string;
  gradient: string;
}

const topicConfigs: Record<string, TopicConfig> = {
  Java: {
    icon: <Code className="h-8 w-8" />,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-50 to-blue-200',
  },
  Javascript: {
    icon: <Braces className="h-8 w-8" />,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    gradient: 'from-yellow-50 to-yellow-200',
  },
  Python: {
    icon: <Code className="h-8 w-8" />,
    color: 'bg-green-100',
    iconColor: 'text-green-600',
    gradient: 'from-green-50 to-green-200',
  },
  SQL: {
    icon: <Database className="h-8 w-8" />,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-50 to-purple-200',
  },
  Ruby: {
    icon: <Gem className="h-8 w-8" />,
    color: 'bg-red-100',
    iconColor: 'text-red-600',
    gradient: 'from-red-50 to-red-200',
  },
  'C++': {
    icon: <CircuitBoard className="h-8 w-8" />,
    color: 'bg-gray-100',
    iconColor: 'text-gray-600',
    gradient: 'from-gray-50 to-gray-200',
  },
};

const TopicDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading, error } = useSelector((state: RootState) => state.quiz);
  const { topicId } = useParams<{ topicId: string }>();

  useEffect(() => {
    if (topics.length === 0) {
      dispatch(fetchTopics());
    }
  }, [dispatch, topics]);

  const topic = topics.find((t) => t.id === Number(topicId));
  const config = topic ? topicConfigs[topic.name] || {
    icon: <BookOpen className="h-8 w-8" />,
    color: 'bg-gray-100',
    iconColor: 'text-gray-600',
    gradient: 'from-gray-50 to-gray-200',
  } : null;

  if (loading) return <QuizLoader />;
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>;
  if (!topic || !config) return <div className="container py-8">Topic not found.</div>;

  return (
    <div className="container py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Button
          asChild
          variant="outline"
          className="group bg-white border-blue-200 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Link to="/topics">
            <ArrowLeft className="mr-2 h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
            <span className="text-blue-600 group-hover:text-blue-700 font-medium">Back to Topics</span>
          </Link>
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`bg-gradient-to-br ${config.gradient} rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all`}>
          <CardHeader className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${config.color}`}>
                <div className={config.iconColor}>{config.icon}</div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-800">{topic.name}</CardTitle>
                <Badge
                  variant="outline"
                  className="mt-2 border-blue-500 text-blue-500 text-sm font-medium"
                >
                  {topic.subtopics.length} Subtopics
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {topic.subtopics.length === 0 ? (
              <Card className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-4">
                <BookOpen className="h-8 w-8 text-gray-500" />
                <p className="text-gray-600 text-lg font-medium">No subtopics available.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {topic.subtopics.map((subtopic, index) => (
                    <motion.div
                      key={subtopic.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className={`bg-white rounded-lg border border-gray-200 hover:scale-105 hover:shadow-lg hover:border-${config.iconColor.split('-')[1]}-300 transition-all`}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <BookOpen className={`h-6 w-6 ${config.iconColor}`} />
                          <p className="text-lg font-medium text-gray-800">{subtopic.name}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TopicDetail;