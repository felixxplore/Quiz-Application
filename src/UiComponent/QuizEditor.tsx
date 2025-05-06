// import { addQuestion } from "@/store/quizSlice";
// import { AppDispatch, RootState } from "@/store/store";
// import React from "react";
// import { useSelector, useDispatch } from "react-redux";

const QuizEditor: React.FC = () => {
  //   const dispatch = useDispatch<AppDispatch>();
  //   const { currentQuiz, questions, isQuestionModalOpen, topics } = useSelector(
  //     (state: RootState) => state.quiz
  //   );

  //   if (!currentQuiz) {
  //     return (
  //       <div className="p-4 text-center text-gray-500">No quiz selected</div>
  //     );
  //   }

  //   const topic = topics.find((t) => t.id === currentQuiz.topicId);
  //   const subtopic = topic?.subtopics.find(
  //     (s) => s.id === currentQuiz.subtopicId
  //   );

  return (
    <>
      <h1>Radhe Radhe</h1>
    </>

    //     <div className="p-4 sm:ml-64">
    //       <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700 min-h-[96vh]">
    //         <div className="max-w-3xl mx-auto">
    //           <h2 className="text-2xl font-bold mb-4">{currentQuiz.title}</h2>
    //           <div className="bg-white p-6 rounded-lg shadow mb-6">
    //             <p>
    //               <strong>Description:</strong> {currentQuiz.description || "N/A"}
    //             </p>
    //             <p>
    //               <strong>Difficulty:</strong> {currentQuiz.difficultyLevel}
    //             </p>
    //             <p>
    //               <strong>Time Limit:</strong> {currentQuiz.timeLimit} minutes
    //             </p>
    //             <p>
    //               <strong>Topic:</strong> {currentQuiz.topicName}
    //             </p>
    //             <p>
    //               <strong>Subtopic:</strong> {currentQuiz.subtopicName}
    //             </p>
    //           </div>

    //           <div className="mb-6">
    //             <div className="flex justify-between items-center mb-2">
    //               <h3 className="text-xl font-semibold">Questions</h3>
    //               <button
    //                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    //                 onClick={() => dispatch(openQuestionModal())}
    //               >
    //                 Add Question
    //               </button>
    //             </div>
    //             {questions.length === 0 ? (
    //               <p className="text-gray-500">No questions added yet.</p>
    //             ) : (
    //               <div className="bg-white rounded-lg shadow overflow-hidden">
    //                 <table className="w-full">
    //                   <thead className="bg-gray-100">
    //                     <tr>
    //                       <th className="p-3 text-left">Question</th>
    //                       <th className="p-3 text-left">Type</th>
    //                       <th className="p-3 text-left">Options</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {questions.map((question) => (
    //                       <tr key={question.id} className="border-t">
    //                         <td className="p-3">{question.questionText}</td>
    //                         <td className="p-3">{question.questionType}</td>
    //                         <td className="p-3">
    //                           {question.options.map((opt) => (
    //                             <span
    //                               key={opt.id}
    //                               className={opt.isCorrect ? "text-green-600" : ""}
    //                             >
    //                               {opt.optionText}
    //                               {opt.isCorrect ? " (Correct)" : ""},
    //                             </span>
    //                           ))}
    //                         </td>
    //                       </tr>
    //                     ))}
    //                   </tbody>
    //                 </table>
    //               </div>
    //             )}
    //           </div>

    //           <div className="flex justify-end space-x-2">
    //             <button
    //               className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
    //               onClick={() => dispatch(setCurrentQuizId(null))}
    //             >
    //               Back
    //             </button>
    //             <button
    //               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    //               onClick={() => dispatch(publishQuiz(currentQuiz.id))}
    //               disabled={questions.length === 0}
    //             >
    //               Publish Quiz
    //             </button>
    //           </div>
    //         </div>
    //       </div>

    //       <Modal
    //         isOpen={isQuestionModalOpen}
    //         onClose={() => dispatch({ type: "quiz/closeQuestionModal" })}
    //         onSave={(questionInfo) =>
    //           dispatch(addQuestion({ quizId: currentQuiz.id, questionInfo }))
    //         }
    //         title="Add New Question"
    //         type="question"
    //       />
    //     </div>
  );
};

export default QuizEditor;
