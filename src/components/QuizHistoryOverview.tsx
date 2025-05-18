// import { useEffect, useState, useMemo } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { BookOpen, Clock, ChevronRight, Search, XCircle } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "@/store/store";
// import { fetchUserSubmissions } from "@/store/quizSlice";
// import QuizLoader from "./QuizLoader";
// import { useDebounce } from "use-debounce";

// export const QuizHistoryOverview: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { submissionsHistory, loading, error } = useSelector(
//     (state: RootState) => state.quiz
//   );
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

//   useEffect(() => {
//     dispatch(fetchUserSubmissions());
//   }, [dispatch]);

//   const filteredSubmissions = useMemo(() => {
//     if (!debouncedSearchTerm) return submissionsHistory;

//     const lowerSearch = debouncedSearchTerm.toLowerCase();
//     const matches = submissionsHistory.filter((submission) =>
//       submission.quizTitle.toLowerCase().includes(lowerSearch)
//     );

//     // Sort by relevance: exact match, starts with, then partial matches
//     return matches.sort((a, b) => {
//       const aTitle = a.quizTitle.toLowerCase();
//       const bTitle = b.quizTitle.toLowerCase();

//       // Exact match
//       if (aTitle === lowerSearch && bTitle !== lowerSearch) return -1;
//       if (bTitle === lowerSearch && aTitle !== lowerSearch) return 1;

//       // Starts with
//       if (aTitle.startsWith(lowerSearch) && !bTitle.startsWith(lowerSearch)) return -1;
//       if (bTitle.startsWith(lowerSearch) && !aTitle.startsWith(lowerSearch)) return 1;

//       // Partial match position (earlier in title is higher)
//       const aIndex = aTitle.indexOf(lowerSearch);
//       const bIndex = bTitle.indexOf(lowerSearch);
//       return aIndex - bIndex;
//     });
//   }, [submissionsHistory, debouncedSearchTerm]);

//   const handleClearSearch = () => {
//     setSearchTerm("");
//   };

//   if (loading) return <QuizLoader />;
//   if (error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.3 }}
//         className="container py-8 max-w-4xl mx-auto flex justify-center"
//       >
//         <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
//           <CardContent className="p-6 flex items-center gap-4">
//             <BookOpen className="h-8 w-8 text-red-500" />
//             <p className="text-lg font-medium text-gray-600">Error: {error}</p>
//           </CardContent>
//         </Card>
//       </motion.div>
//     );
//   }
//   if (submissionsHistory.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.3 }}
//         className="container py-8 max-w-4xl mx-auto flex justify-center"
//       >
//         <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
//           <CardContent className="p-6 flex items-center gap-4">
//             <BookOpen className="h-8 w-8 text-gray-500" />
//             <p className="text-lg font-medium text-gray-600">
//               Start taking quizzes to see your history!
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>
//     );
//   }

//   return (
//     <div className="container py-8 max-w-5xl mx-auto flex flex-col items-center">
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="text-4xl font-bold mb-6 text-gray-800 text-center"
//       >
//         Your Quiz History
//       </motion.h1>
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: 0.1 }}
//         className="mb-6 w-full max-w-md"
//       >
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
//           <Input
//             type="text"
//             placeholder="Search by quiz title..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 pr-10 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 text-gray-800 placeholder-gray-400 rounded-lg shadow-sm w-full"
//           />
//           {searchTerm && (
//             <button
//               onClick={handleClearSearch}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//             >
//               <XCircle className="h-5 w-5" />
//             </button>
//           )}
//         </div>
//       </motion.div>
//       {filteredSubmissions.length === 0 && debouncedSearchTerm ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           className="w-full max-w-md"
//         >
//           <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
//             <CardContent className="p-6 flex items-center gap-4">
//               <BookOpen className="h-8 w-8 text-gray-500" />
//               <p className="text-lg font-medium text-gray-600">
//                 No results found for "{debouncedSearchTerm}".
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
//           <AnimatePresence>
//             {filteredSubmissions.map((submission) => (
//               <motion.div
//                 key={submission.quizId}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="flex"
//               >
//                 <Card className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 h-full flex flex-col w-full">
//                   <CardHeader className="flex flex-row items-center p-4">
//                     <div className="flex items-center gap-3">
//                       <BookOpen className="h-6 w-6 text-blue-600" />
//                       <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
//                         {submission.quizTitle}
//                       </CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="p-4 pt-0 flex-grow">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <Clock className="h-5 w-5 text-gray-500" />
//                         <span className="text-sm font-medium text-gray-600">
//                           {new Date(submission.submittedAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="text-sm text-left font-medium text-gray-600">
//                         Score: {submission.score}/{submission.totalQuestions} (
//                         {submission.percentage}%)
//                       </div>
//                     </div>
//                   </CardContent>
//                   <CardFooter className="p-4 pt-0">
//                     <Button
//                       asChild
//                       variant="outline"
//                       className="group w-full bg-white border-blue-200 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
//                     >
//                       <Link to={`/history/${submission.submissionId}`}>
//                         View Details
//                         <ChevronRight className="ml-2 h-4 w-4 text-blue-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
//                       </Link>
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizHistoryOverview;
 
import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, ChevronRight, Search, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchUserSubmissions } from "@/store/quizSlice";
import QuizLoader from "./QuizLoader";
import { useDebounce } from "use-debounce";

export const QuizHistoryOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { submissionsHistory, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch(fetchUserSubmissions());
  }, [dispatch]);

  const filteredSubmissions = useMemo(() => {
    const sortedSubmissions = [...submissionsHistory].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    if (!debouncedSearchTerm) return sortedSubmissions;

    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return sortedSubmissions.filter((submission) =>
      submission.quizTitle.toLowerCase().includes(lowerSearch)
    );
  }, [submissionsHistory, debouncedSearchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) return <QuizLoader />;
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container py-8 max-w-4xl mx-auto flex justify-center"
      >
        <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
          <CardContent className="p-6 flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-red-500" />
            <p className="text-lg font-medium text-gray-600">Error: {error}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  if (submissionsHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container py-8 max-w-4xl mx-auto flex justify-center"
      >
        <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
          <CardContent className="p-6 flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-gray-500" />
            <p className="text-lg font-medium text-gray-600">
              Start taking quizzes to see your history!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-bold mb-6 text-gray-800 text-center"
      >
        Your Quiz History
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 w-full max-w-md"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by quiz title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 text-gray-800 placeholder-gray-400 rounded-lg shadow-sm w-full"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </motion.div>
      {filteredSubmissions.length === 0 && debouncedSearchTerm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-gray-500" />
              <p className="text-lg font-medium text-gray-600">
                No results found for "{debouncedSearchTerm}".
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="w-full max-w-4xl space-y-2">
          <AnimatePresence>
            {filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission.submissionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xs font-medium text-gray-600 w-6">
                        #{filteredSubmissions.length - index}
                      </span>
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span className="text-base font-bold text-gray-800 truncate flex-1">
                        {submission.quizTitle}
                      </span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">
                          {formatDateTime(submission.submittedAt)}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-600 mx-4">
                        Score: {submission.score}/{submission.totalQuestions} ({submission.percentage}%)
                      </span>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="group bg-white border-blue-200 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md text-sm py-1 px-3"
                    >
                      <Link to={`/history/${submission.submissionId}`}>
                        View Details
                        <ChevronRight className="ml-1 h-3 w-3 text-blue-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default QuizHistoryOverview;