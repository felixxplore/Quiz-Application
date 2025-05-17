// // import { Link } from "react-router-dom";
// // import {
// //   Card,
// //   CardContent,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Clock, Users } from "lucide-react";
// // import type { RootState } from "@/store/store";
// // import { useSelector } from "react-redux";

// // export function FeaturedQuizzes() {
// //   const { quizzes } = useSelector((state: RootState) => state.quiz);

// //   return (
// //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
// //       {quizzes.map((quiz) => (
// //         <Link to={`/quizzes/${quiz.id}`} key={quiz.id} className="group">
// //           <Card className="rounded-xl  h-[400px] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
// //             <div className="w-full h-44 overflow-hidden">
// //               <img
// //                 src={"./src/assets/image.png"}
// //                 alt={quiz.title}
// //                 className="w-full h-44 object-cover transition-transform group-hover:scale-105"
// //               />
// //             </div>
// //             <CardHeader className="p-4 pb-0">
// //               <div className="flex justify-between items-center mb-0">
// //                 <Badge
// //                   variant={
// //                     quiz.difficultyLevel === "EASY" ||
// //                     quiz.difficultyLevel === "MEDIUM"
// //                       ? "outline"
// //                       : "secondary"
// //                   }
// //                   className={
// //                     quiz.difficultyLevel === "EASY"
// //                       ? "border-yellow-DEFAULT text-yellow-DEFAULT"
// //                       : quiz.difficultyLevel === "MEDIUM"
// //                       ? "bg-orange-DEFAULT hover:bg-orange-DEFAULT/90"
// //                       : "bg-purple-DEFAULT hover:bg-purple-DEFAULT/90"
// //                   }
// //                 >
// //                   {quiz.difficultyLevel}
// //                 </Badge>
// //                 <Badge
// //                   variant="outline"
// //                   className="border-magenta-DEFAULT/50 text-magenta-DEFAULT"
// //                 >
// //                   {quiz.ageGroup || "All Ages"}
// //                 </Badge>
// //               </div>
// //               <CardTitle className="text-lg font-semibold leading-tight text-left">
// //                 {quiz.title}
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="p-4 pt-0 text-sm text-left text-muted-foreground">
// //               <p className="truncate">{quiz.topicName}</p>
// //             </CardContent>
// //             <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
// //               <div className="flex items-center">
// //                 <Clock className="mr-1 h-3 w-3" />
// //                 {quiz.timeLimit} Min
// //               </div>
// //               <div className="flex items-center">
// //                 <Users className="mr-1 h-3 w-3" />
// //                 {quiz.participants || "20"}
// //               </div>
// //             </CardFooter>
// //           </Card>
// //         </Link>
// //       ))}
// //     </div>
// //   );
// // }

// // src/components/FeaturedQuizzes.tsx
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
//  import { fetchQuizzes } from "@/store/quizSlice";
// import { Link } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Code,
//   Database,
//   Braces,
//   Gem,
//   CircuitBoard,
//   BookOpen,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import type { JSX } from "react";
// import type { AppDispatch, RootState } from "@/store/store";

// interface Quiz {
//   id: number;
//   title: string;
//   questionCount: number;
// }

// interface QuizConfig {
//   icon: JSX.Element;
//   color: string;
//   iconColor: string;
// }

// const quizConfigs: Record<string, QuizConfig> = {
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

// export function FeaturedQuizzes() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { quizzes, loading, error } = useSelector(
//     (state: RootState) => state.quiz
//   );

//   useEffect(() => {
//     dispatch(fetchQuizzes());
//   }, [dispatch]);

//   if (loading) return <div className="container py-8">Loading...</div>;
//   if (error) return <div className="container py-8">Error: {error}</div>;
//   if (quizzes.length === 0)
//     return <div className="container py-8">No quizzes found.</div>;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//       <AnimatePresence>
//         {quizzes.slice(0, 6).map((quiz, index) => {
//           const keyword = Object.keys(quizConfigs).find((key) =>
//             quiz.title.toLowerCase().includes(key.toLowerCase())
//           );
//           const config = keyword
//             ? quizConfigs[keyword]
//             : {
//                 icon: <BookOpen className="h-8 w-8" />,
//                 color: "bg-gray-100",
//                 iconColor: "text-gray-600",
//               };

//           return (
//             <motion.div
//               key={quiz.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3, delay: index * 0.1 }}
//             >
//               <Link to={`/quizzes/${quiz.id}`}>
//                 <Card className="h-full transition-all hover:shadow-md bg-white">
//                   <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
//                     <div className={`p-4 rounded-full ${config.color}`}>
//                       <div className={config.iconColor}>{config.icon}</div>
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-gray-800">
//                         {quiz.title}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {quiz.questionCount} Questions
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

// src/components/FeaturedQuizzes.tsx
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "@/store/store";
// import { fetchQuizzes } from "@/store/quizSlice";
// import { Link } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Clock,
//   Users,
//   Code,
//   Database,
//   Braces,
//   Gem,
//   CircuitBoard,
//   BookOpen,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import type { JSX } from "react";

// interface Quiz {
//   id: number;
//   title: string;
//   questionCount: number;
//   difficultyLevel: string;
//   timeLimit: number;
//   topicName: string;
//   subtopicName?: string;
//   description: string;
//   participants: number;
// }

// interface QuizConfig {
//   icon: JSX.Element;
//   color: string;
//   iconColor: string;
// }

// const quizConfigs: Record<string, QuizConfig> = {
//   Java: {
//     icon: <Code className="h-6 w-6" />,
//     color: "bg-blue-100",
//     iconColor: "text-blue-600",
//   },
//   Javascript: {
//     icon: <Braces className="h-6 w-6" />,
//     color: "bg-yellow-100",
//     iconColor: "text-yellow-600",
//   },
//   Python: {
//     icon: <Code className="h-6 w-6" />,
//     color: "bg-green-100",
//     iconColor: "text-green-600",
//   },
//   SQL: {
//     icon: <Database className="h-6 w-6" />,
//     color: "bg-purple-100",
//     iconColor: "text-purple-600",
//   },
//   Ruby: {
//     icon: <Gem className="h-6 w-6" />,
//     color: "bg-red-100",
//     iconColor: "text-red-600",
//   },
//   "C++": {
//     icon: <CircuitBoard className="h-6 w-6" />,
//     color: "bg-gray-100",
//     iconColor: "text-gray-600",
//   },
// };

// export function FeaturedQuizzes() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { quizzes, loading, error } = useSelector(
//     (state: RootState) => state.quiz
//   );

//   useEffect(() => {
//     dispatch(fetchQuizzes());
//   }, [dispatch]);

//   if (loading) return <div className="container py-8">Loading...</div>;
//   if (error) return <div className="container py-8">Error: {error}</div>;
//   if (quizzes.length === 0)
//     return <div className="container py-8">No quizzes found.</div>;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//       <AnimatePresence>
//         {quizzes.slice(0, 6).map((quiz, index) => {
//           const keyword = Object.keys(quizConfigs).find((key) =>
//             quiz.title.toLowerCase().includes(key.toLowerCase())
//           );
//           const config = keyword
//             ? quizConfigs[keyword]
//             : {
//                 icon: <BookOpen className="h-6 w-6" />,
//                 color: "bg-gray-100",
//                 iconColor: "text-gray-600",
//               };

//           return (
//             <motion.div
//               key={quiz.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3, delay: index * 0.1 }}
//             >
//               <Link to={`/quizzes/${quiz.id}`}>
//                 <Card className="h-full flex flex-col bg-white transition-all hover:shadow-md">
//                   <CardHeader className="p-4">
//                     <div className="flex justify-between items-center mb-2">
//                       <Badge
//                         variant={
//                           quiz.difficultyLevel === "HARD"
//                             ? "default"
//                             : "outline"
//                         }
//                         className={
//                           quiz.difficultyLevel === "EASY"
//                             ? "border-yellow-500 text-yellow-500"
//                             : quiz.difficultyLevel === "MEDIUM"
//                             ? "border-orange-500 text-orange-500"
//                             : "bg-purple-500 text-white hover:bg-purple-600"
//                         }
//                       >
//                         {quiz.difficultyLevel}
//                       </Badge>
//                       <div className={`p-2 rounded-full ${config.color}`}>
//                         <div className={config.iconColor}>{config.icon}</div>
//                       </div>
//                     </div>
//                     <CardTitle className="text-lg font-semibold text-gray-800 text-left">
//                       {quiz.title}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-4 pt-0 text-sm text-gray-600 flex-1">
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       <Badge
//                         variant="outline"
//                         className="border-blue-500 text-blue-500"
//                       >
//                         {quiz.topicName}
//                       </Badge>
//                       {quiz.subtopicName && (
//                         <Badge
//                           variant="outline"
//                           className="border-green-500 text-green-500"
//                         >
//                           {quiz.subtopicName}
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="line-clamp-3">{quiz.description}</p>
//                   </CardContent>
//                   <CardFooter className="p-4 pt-0 flex justify-between text-xs text-gray-600">
//                     <div className="flex items-center">
//                       <Clock className="mr-1 h-4 w-4" />
//                       {quiz.timeLimit} Min
//                     </div>
//                     <div className="flex items-center">
//                       <Users className="mr-1 h-4 w-4" />
//                       {quiz.participants}
//                     </div>
//                   </CardFooter>
//                 </Card>
//               </Link>
//             </motion.div>
//           );
//         })}
//       </AnimatePresence>
//     </div>
//   );
// }

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchQuizzes } from '@/store/quizSlice';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Code, Database, Braces, Gem, CircuitBoard, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JSX } from 'react';

interface Quiz {
  id: number;
  title: string;
  questionCount: number;
  difficultyLevel: string;
  timeLimit: number;
  topicName: string;
  subtopicName?: string;
  description: string;
  participants: number;
}

interface QuizConfig {
  icon: JSX.Element;
  color: string;
  iconColor: string;
}

const quizConfigs: Record<string, QuizConfig> = {
  Java: {
    icon: <Code className="h-5 w-5" />,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  Javascript: {
    icon: <Braces className="h-5 w-5" />,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  Python: {
    icon: <Code className="h-5 w-5" />,
    color: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  SQL: {
    icon: <Database className="h-5 w-5" />,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  Ruby: {
    icon: <Gem className="h-5 w-5" />,
    color: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  'C++': {
    icon: <CircuitBoard className="h-5 w-5" />,
    color: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
};

export function FeaturedQuizzes() {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, loading, error } = useSelector((state: RootState) => state.quiz);
  const location = useLocation();
  const isQuizzesPage = location.pathname === '/quizzes';

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  if (loading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8">Error: {error}</div>;
  if (quizzes.length === 0) return <div className="container py-8">No quizzes found.</div>;

  const displayedQuizzes = isQuizzesPage ? quizzes : quizzes.slice(0, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      <AnimatePresence>
        {displayedQuizzes.map((quiz, index) => {
          const keyword = Object.keys(quizConfigs).find((key) =>
            quiz.title.toLowerCase().includes(key.toLowerCase())
          );
          const config = keyword
            ? quizConfigs[keyword]
            : {
                icon: <BookOpen className="h-5 w-5" />,
                color: 'bg-gray-100',
                iconColor: 'text-gray-600',
              };

          return (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="max-w-sm w-full"
            >
              <Link to={`/quizzes/${quiz.id}`}>
                <Card className="h-full flex flex-col bg-white transition-all hover:shadow-md">
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <Badge
                        variant={quiz.difficultyLevel === 'HARD' ? 'default' : 'outline'}
                        className={
                          quiz.difficultyLevel === 'EASY'
                            ? 'border-yellow-500 text-yellow-500 text-xs'
                            : quiz.difficultyLevel === 'MEDIUM'
                            ? 'border-orange-500 text-orange-500 text-xs'
                            : 'bg-purple-500 text-white hover:bg-purple-600 text-xs'
                        }
                      >
                        {quiz.difficultyLevel}
                      </Badge>
                      <div className={`p-1.5 rounded-full ${config.color}`}>
                        <div className={config.iconColor}>{config.icon}</div>
                      </div>
                    </div>
                    <CardTitle className="text-base font-semibold text-gray-800 text-left line-clamp-2">
                      {quiz.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-xs text-gray-600 flex-1">
                    <div className="flex flex-wrap gap-1 mb-1">
                      <Badge variant="outline" className="border-blue-500 text-blue-500 text-xs">
                        {quiz.topicName}
                      </Badge>
                      {quiz.subtopicName && (
                        <Badge variant="outline" className="border-green-500 text-green-500 text-xs">
                          {quiz.subtopicName}
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-2">{quiz.description}</p>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between text-xs text-gray-600">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {quiz.timeLimit} Min
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {quiz.participants}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}