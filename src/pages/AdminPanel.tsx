"use client";

import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Menu,
  Trash2,
  Edit,
  Plus,
  X,
  Loader2,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchTopics,
  createTopic,
  fetchSubtopics,
  createSubtopic,
  fetchQuizzes,
  createQuiz,
  deleteQuiz,
  // fetchQuestionsByQuizId,
  // addQuestion,
  // editQuestion,
  // editQuiz,
} from "@/store/quizSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Sidebar Component
const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
  isOpen,
  toggleSidebar,
}) => {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: BookOpen },
    { name: "Topics", path: "/admin/topics", icon: BookOpen },
    { name: "Subtopics", path: "/admin/subtopics", icon: BookOpen },
    { name: "Quizzes", path: "/admin/quizzes", icon: BookOpen },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          exit={{ x: -256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 shadow-xl md:static md:z-auto"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold tracking-tight">QuizWiz Admin</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-gray-600 hover:bg-gray-200 md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium hover:bg-blue-100 hover:text-blue-600 hover:scale-105 transition-all duration-200"
                    onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Topic List Component
const TopicList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleCreateTopic = () => {
    if (newTopic.trim()) {
      dispatch(createTopic(newTopic));
      setNewTopic("");
    } else {
      toast.error("Please enter a topic name");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Topics</h2>
      </div>
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Enter new topic name"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
          />
          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          onClick={handleCreateTopic}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Topic
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : topics.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No topics found. Start by adding one!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700 font-semibold">
                  ID
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Name
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow
                  key={topic.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <TableCell className="text-gray-800">{topic.id}</TableCell>
                  <TableCell className="text-gray-800">{topic.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

// Subtopic List Component
const SubtopicList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const [newSubtopic, setNewSubtopic] = useState({ name: "", topicId: "" });

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleCreateSubtopic = () => {
    if (newSubtopic.name.trim() && newSubtopic.topicId) {
      dispatch(
        createSubtopic({
          name: newSubtopic.name,
          topicId: Number(newSubtopic.topicId),
        })
      );
      setNewSubtopic({ name: "", topicId: "" });
    } else {
      toast.error("Please enter a subtopic name and select a topic");
    }
  };

  const topicArray = Object.values(topics);
  const allSubtopics = topicArray.flatMap((topic) =>
    (topic.subtopics || []).map((subtopic) => ({
      ...subtopic,
      topicName: topic.name,
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Subtopics</h2>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <Label htmlFor="subtopic-name" className="text-gray-700">
            Subtopic Name
          </Label>
          <Input
            id="subtopic-name"
            placeholder="Enter subtopic name"
            value={newSubtopic.name}
            onChange={(e) =>
              setNewSubtopic({ ...newSubtopic, name: e.target.value })
            }
            className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
          />
          <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div>
          <Label htmlFor="topic-select" className="text-gray-700">
            Topic
          </Label>
          <Select
            value={newSubtopic.topicId}
            onValueChange={(value) =>
              setNewSubtopic({ ...newSubtopic, topicId: value })
            }
          >
            <SelectTrigger
              id="topic-select"
              className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-lg shadow-lg">
              {topicArray.map((topic) => (
                <SelectItem
                  key={topic.id}
                  value={topic.id.toString()}
                  className="hover:bg-blue-100"
                >
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleCreateSubtopic}
          className="sm:col-span-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Subtopic
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : allSubtopics.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No subtopics found. Start by adding one!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700 font-semibold">
                  ID
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Name
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Topic
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSubtopics.map((subtopic) => (
                <TableRow
                  key={subtopic.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <TableCell className="text-gray-800">{subtopic.id}</TableCell>
                  <TableCell className="text-gray-800">
                    {subtopic.name}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {subtopic.topicName}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

// Searchable Select Component
interface SearchableSelectProps {
  options: { id: string | number; name: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  id: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(
    (option) => option.id.toString() === value
  );

  return (
    <div>
      <Label htmlFor={id} className="text-gray-500 mb-2 ml-3">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between rounded-lg border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-all duration-200"
            id={id}
          >
            {selectedOption ? selectedOption.name : placeholder}
            <Check
              className={`ml-2 h-4 w-4 ${
                value ? "opacity-100" : "opacity-0"
              } text-blue-500`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full bg-white rounded-lg shadow-lg p-0">
          <Command>
            <CommandInput
              className="mt-2 pl-2 border-b border-gray-200"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty className="p-2 text-gray-500">
                No {label.toLowerCase()} found.
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    onSelect={() => {
                      onChange(option.id.toString());
                      setOpen(false);
                      setSearch("");
                    }}
                    className="cursor-pointer hover:bg-blue-100 text-gray-800"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === option.id.toString()
                          ? "opacity-100 text-blue-500"
                          : "opacity-0"
                      }`}
                    />
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Interfaces for Question and AnswerOption
// interface AnswerOption {
//   id?: number;
//   optionText: string;
//   isCorrect: boolean;
//   optionIndex: number;
//   questionId?: number;
// }
// interface Question {
//   id?: number;
//   questionText: string;
//   questionType: "FILL_BLANK" | "TRUE_FALSE" | "MCQ";
//   quizId: number;
//   options: AnswerOption[];
// }

// Quiz List Component
const QuizList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, topics, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    difficultyLevel: "",
    timeLimit: "",
    topicId: "",
    subtopicId: "",
  });
  const [deleteQuizId, setDeleteQuizId] = useState<number | null>(null);
  // const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  // const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] =
  //   useState(false);
  // const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] =
  //   useState(false);
  // const [newQuestion, setNewQuestion] = useState<Question>({
  //   questionText: "",
  //   questionType: "MCQ",
  //   quizId: 0,
  //   options: [
  //     { optionText: "", isCorrect: false, optionIndex: 0 },
  //     { optionText: "", isCorrect: false, optionIndex: 1 },
  //     { optionText: "", isCorrect: false, optionIndex: 2 },
  //     { optionText: "", isCorrect: false, optionIndex: 3 },
  //   ],
  // });
  // const [editQuestionData, setEditQuestionData] = useState<Question | null>(
  //   null
  // );
  // const [deleteQuestionId, setDeleteQuestionId] = useState<
  //   number | undefined | null
  // >(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleCreateQuiz = async () => {
    if (
      newQuiz.title.trim() &&
      newQuiz.description.trim() &&
      newQuiz.difficultyLevel &&
      newQuiz.timeLimit &&
      newQuiz.topicId &&
      newQuiz.subtopicId
    ) {
      const quizData = {
        title: newQuiz.title,
        description: newQuiz.description,
        difficultyLevel: newQuiz.difficultyLevel as "EASY" | "MEDIUM" | "HARD",
        timeLimit: Number(newQuiz.timeLimit),
        topicId: Number(newQuiz.topicId),
        subtopicId: Number(newQuiz.subtopicId),
      };
      setIsCreating(true);
      try {
        await dispatch(createQuiz(quizData)).unwrap();
        toast.success("Quiz created successfully!");
        setNewQuiz({
          title: "",
          description: "",
          difficultyLevel: "",
          timeLimit: "",
          topicId: "",
          subtopicId: "",
        });
        setIsDialogOpen(false);
        await Promise.all([dispatch(fetchTopics())]);
      } catch (error: any) {
        toast.error(error || "Failed to create quiz. Please try again.");
      } finally {
        setIsCreating(false);
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  // const handleEditQuiz = async () => {
  //   if (
  //     editQuestionData &&
  //     editQuestionData.title &&
  //     editQuestionData.description &&
  //     editQuestionData.difficultyLevel &&
  //     editQuestionData.timeLimit &&
  //     editQuestionData.topicId &&
  //     editQuestionData.subtopicId
  //   ) {
  //     const quizInfo = {
  //       title: editQuestionData.title,
  //       description: editQuestionData.description,
  //       difficultyLevel: editQuestionData.difficultyLevel as
  //         | "EASY"
  //         | "MEDIUM"
  //         | "HARD",
  //       timeLimit: Number(editQuestionData.timeLimit),
  //       topicId: Number(editQuestionData.topicId),
  //       subtopicId: Number(editQuestionData.subtopicId),
  //       id: Number(editQuestionData.id),
  //     };
  //     try {
  //       await dispatch(
  //         editQuiz({ quizId: editQuestionData.id, quizInfo })
  //       ).unwrap();
  //       toast.success("Quiz updated successfully!");
  //       setIsEditQuestionDialogOpen(false);
  //       await dispatch(fetchQuizzes());
  //     } catch (error: any) {
  //       toast.error(error || "Failed to update quiz. Please try again.");
  //     }
  //   } else {
  //     toast.error("Please fill in all fields.");
  //   }
  // };

  const handleDeleteQuiz = async () => {
    if (deleteQuizId !== null) {
      try {
        await dispatch(deleteQuiz(deleteQuizId)).unwrap();
        toast.success("Quiz deleted successfully!");
        setDeleteQuizId(null);
        await dispatch(fetchQuizzes());
      } catch (error: any) {
        toast.error(error || "Failed to delete quiz. Please try again.");
      }
    }
  };

  // const handleAddQuestion = async () => {
  //   if (
  //     editQuestionData &&
  //     newQuestion.questionText.trim() &&
  //     newQuestion.options.every((opt) => opt.optionText.trim()) &&
  //     newQuestion.options.some((opt) => opt.isCorrect) &&
  //     newQuestion.questionType
  //   ) {
  //     try {
  //       await dispatch(
  //         addQuestion({ quizId: editQuestionData.id, question: newQuestion })
  //       ).unwrap();
  //       toast.success("Question added successfully!");
  //       setNewQuestion({
  //         questionText: "",
  //         questionType: "MCQ",
  //         quizId: 0,
  //         options: [
  //           { optionText: "", isCorrect: false, optionIndex: 0 },
  //           { optionText: "", isCorrect: false, optionIndex: 1 },
  //           { optionText: "", isCorrect: false, optionIndex: 2 },
  //           { optionText: "", isCorrect: false, optionIndex: 3 },
  //         ],
  //       });
  //       setIsQuestionDialogOpen(false);
  //       await dispatch(fetchQuestionsByQuizId(editQuestionData.id));
  //     } catch (error: any) {
  //       toast.error(error || "Failed to add question. Please try again.");
  //     }
  //   } else {
  //     toast.error("Please fill in all question fields correctly.");
  //   }
  // };

  // const handleEditQuestion = async () => {
  //   if (
  //     editQuestionData &&
  //     editQuestionData.questionText.trim() &&
  //     editQuestionData.options.every((opt) => opt.optionText.trim()) &&
  //     editQuestionData.options.some((opt) => opt.isCorrect) &&
  //     editQuestionData.questionType
  //   ) {
  //     try {
  //       await dispatch(
  //         editQuestion({
  //           questionId: editQuestionData.id,
  //           question: editQuestionData,
  //         })
  //       ).unwrap();
  //       toast.success("Question updated successfully!");
  //       setIsEditQuestionDialogOpen(false);
  //       if (editQuestionData) {
  //         await dispatch(fetchQuestionsByQuizId(editQuestionData.id));
  //       }
  //     } catch (error: any) {
  //       toast.error(error || "Failed to update question. Please try again.");
  //     }
  //   } else {
  //     toast.error(
  //       "Please fill in all question fields correctly and select a correct option."
  //     );
  //   }
  // };

  const allSubtopics = topics.flatMap((topic) =>
    (topic.subtopics || []).map((subtopic) => ({
      ...subtopic,
      topicId: topic.id,
    }))
  );
  const filteredSubtopics = allSubtopics.filter((sub) =>
    newQuiz.topicId ? sub.topicId === Number(newQuiz.topicId) : true
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Quizzes</h2>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200">
            <Plus className="h-4 w-4" />
            Create Quiz
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white rounded-2xl shadow-xl max-w-lg">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Create New Quiz
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 mt-4">
              <div className="relative">
                <Label htmlFor="quiz-title" className="text-gray-700">
                  Title
                </Label>
                <Input
                  placeholder="Enter quiz title"
                  id="quiz-title"
                  value={newQuiz.title}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
                />
                <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <Label htmlFor="quiz-description" className="text-gray-700">
                  Description
                </Label>
                <Input
                  placeholder="Enter quiz description"
                  id="quiz-description"
                  value={newQuiz.description}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
                />
                <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div>
                <Label htmlFor="quiz-difficulty" className="text-gray-700">
                  Difficulty
                </Label>
                <Select
                  value={newQuiz.difficultyLevel}
                  onValueChange={(value) =>
                    setNewQuiz({ ...newQuiz, difficultyLevel: value })
                  }
                >
                  <SelectTrigger
                    id="quiz-difficulty"
                    className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-lg shadow-lg">
                    <SelectItem value="EASY" className="hover:bg-blue-100">
                      Easy
                    </SelectItem>
                    <SelectItem value="MEDIUM" className="hover:bg-blue-100">
                      Medium
                    </SelectItem>
                    <SelectItem value="HARD" className="hover:bg-blue-100">
                      Hard
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Label htmlFor="quiz-time-limit" className="text-gray-700">
                  Time Limit (minutes)
                </Label>
                <Input
                  placeholder="Enter time limit"
                  id="quiz-time-limit"
                  type="number"
                  value={newQuiz.timeLimit}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, timeLimit: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transitioned-all duration-200 pl-10"
                />
                <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <SearchableSelect
                options={topics.map((topic) => ({
                  id: topic.id,
                  name: topic.name,
                }))}
                value={newQuiz.topicId}
                onChange={(value) =>
                  setNewQuiz({ ...newQuiz, topicId: value, subtopicId: "" })
                }
                placeholder="Select topic"
                label="Topic"
                id="quiz-topic"
              />
              <SearchableSelect
                options={filteredSubtopics.map((subtopic) => ({
                  id: subtopic.id,
                  name: subtopic.name,
                }))}
                value={newQuiz.subtopicId}
                onChange={(value) =>
                  setNewQuiz({ ...newQuiz, subtopicId: value })
                }
                placeholder="Select subtopic"
                label="Subtopic"
                id="quiz-subtopic"
              />
              <Button
                onClick={handleCreateQuiz}
                disabled={isCreating}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {isCreating ? "Creating..." : "Create Quiz"}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : quizzes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No quizzes found. Start by creating one!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700 font-semibold">
                  ID
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Title
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Topic
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Subtopic
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <TableCell className="text-gray-800">{quiz.id}</TableCell>
                  <TableCell className="text-gray-800">{quiz.title}</TableCell>
                  <TableCell className="text-gray-800">
                    {quiz.topicName}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {quiz.subtopicName}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-200"
                    >
                      <Link to={`/admin/quizzes/edit/${quiz.id}`}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteQuizId(quiz.id)}
                      className="rounded-full bg-red-100 hover:bg-red-200 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog
        open={deleteQuizId !== null}
        onOpenChange={() => setDeleteQuizId(null)}
      >
        <DialogContent className="bg-white rounded-2xl shadow-xl">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Confirm Delete
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </p>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteQuizId(null)}
                className="rounded-lg border-gray-200 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteQuiz}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg"
              >
                Delete
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Quiz Details Component
// const QuizDetails: React.FC = () => {
//   const { quizId } = useParams<{ quizId: string }>();
//   const dispatch = useDispatch<AppDispatch>();
//   const { quiz, questions, topics, loading, error } = useSelector(
//     (state: RootState) => state.quiz
//   );
//   const [editQuiz, setEditQuiz] = useState<
//     Partial<{
//       id: number;
//       title: string;
//       description: string;
//       difficultyLevel: "EASY" | "MEDIUM" | "HARD";
//       timeLimit: number;
//       createdBy: string;
//       topicId: number;
//       subtopicId: number;
//       topicName: string;
//       subtopicName: string;
//     }>
//   >({});
//   const [newQuestion, setNewQuestion] = useState<{
//     questionText: string;
//     questionType: "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "";
//     options: { optionText: string; isCorrect: boolean }[];
//   }>({
//     questionText: "",
//     questionType: "",
//     options: [],
//   });
//   const [editQuestionData, setEditQuestionData] = useState<{
//     id: number;
//     questionText: string;
//     questionType: "MCQ" | "TRUE_FALSE" | "FILL_BLANK";
//     quizId: number;
//     options: { optionText: string; isCorrect: boolean; id?: number }[];
//   } | null>(null);
//   const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);

//   useEffect(() => {
//     if (quizId) {
//       dispatch(fetchQuizById(Number(quizId)));
//       dispatch(fetchQuestionsByQuizId(Number(quizId)));
//       dispatch(fetchTopics());
//       dispatch(fetchSubtopics());
//     }
//   }, [dispatch, quizId]);

//   useEffect(() => {
//     if (quiz) {
//       setEditQuiz({
//         id: quiz.id,
//         title: quiz.title,
//         description: quiz.description,
//         difficultyLevel: quiz.difficultyLevel,
//         timeLimit: quiz.timeLimit,
//         createdBy: quiz.createdBy || "admin",
//         topicId: quiz.topicId,
//         subtopicId: quiz.subtopicId,
//         topicName: quiz.topicName,
//         subtopicName: quiz.subtopicName,
//       });
//     }
//   }, [quiz]);

//   const handleUpdateQuiz = () => {
//     if (
//       quizId &&
//       editQuiz.title &&
//       editQuiz.description &&
//       editQuiz.difficultyLevel &&
//       editQuiz.timeLimit &&
//       editQuiz.topicId &&
//       editQuiz.subtopicId
//     ) {
//       dispatch(
//         updateQuiz({
//           id: Number(quizId),
//           title: editQuiz.title,
//           description: editQuiz.description,
//           difficultyLevel: editQuiz.difficultyLevel as
//             | "EASY"
//             | "MEDIUM"
//             | "HARD",
//           timeLimit: Number(editQuiz.timeLimit),
//           createdBy: editQuiz.createdBy || "admin",
//           topicId: Number(editQuiz.topicId),
//           subtopicId: Number(editQuiz.subtopicId),
//           topicName:
//             editQuiz.topicName ||
//             topics.find((t) => t.id === editQuiz.topicId)?.name ||
//             "",
//           subtopicName:
//             editQuiz.subtopicName ||
//             topics
//               .flatMap((t) => t.subtopics || [])
//               .find((s) => s.id === editQuiz.subtopicId)?.name ||
//             "",
//           topic: {
//             id: Number(editQuiz.topicId),
//             name:
//               editQuiz.topicName ||
//               topics.find((t) => t.id === editQuiz.topicId)?.name ||
//               "",
//           },
//         })
//       );
//     }
//   };

//   const handleAddQuestion = () => {
//     if (quizId && newQuestion.questionText && newQuestion.questionType) {
//       dispatch(
//         addQuestion({
//           quizId: Number(quizId),
//           question: {
//             questionText: newQuestion.questionText,
//             questionType: newQuestion.questionType,
//             quizId: Number(quizId),
//             options:
//               newQuestion.questionType === "FILL_BLANK"
//                 ? []
//                 : newQuestion.options,
//           },
//         })
//       );
//       setNewQuestion({ questionText: "", questionType: "", options: [] });
//     }
//   };

//   const handleEditQuestion = () => {
//     if (editQuestionData && quizId) {
//       dispatch(
//         editQuestion({
//           id: editQuestionData.id,
//           questionText: editQuestionData.questionText,
//           questionType: editQuestionData.questionType,
//           quizId: Number(quizId),
//           options: editQuestionData.options,
//         })
//       );
//       setEditQuestionData(null);
//     }
//   };

//   const handleDeleteQuestion = () => {
//     if (deleteQuestionId !== null) {
//       dispatch(deleteQuestion(deleteQuestionId));
//       setDeleteQuestionId(null);
//     }
//   };

//   const addOption = () => {
//     setNewQuestion({
//       ...newQuestion,
//       options: [...newQuestion.options, { optionText: "", isCorrect: false }],
//     });
//   };

//   const updateOption = (
//     index: number,
//     field: "optionText" | "isCorrect",
//     value: string | boolean
//   ) => {
//     const updatedOptions = newQuestion.options.map((opt, i) =>
//       i === index ? { ...opt, [field]: value } : opt
//     );
//     setNewQuestion({ ...newQuestion, options: updatedOptions });
//   };

//   const updateEditOption = (
//     index: number,
//     field: "optionText" | "isCorrect",
//     value: string | boolean
//   ) => {
//     if (editQuestionData) {
//       const updatedOptions = editQuestionData.options.map((opt, i) =>
//         i === index ? { ...opt, [field]: value } : opt
//       );
//       setEditQuestionData({ ...editQuestionData, options: updatedOptions });
//     }
//   };

//   const allSubtopics = topics.flatMap((topic) => topic.subtopics || []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Quiz Details</h2>
//       </div>
//       {loading ? (
//         <div className="flex justify-center py-8">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//         </div>
//       ) : error ? (
//         <Alert variant="destructive" className="rounded-lg">
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       ) : !quiz ? (
//         <p className="text-gray-500 text-center py-8">Quiz not found.</p>
//       ) : (
//         <div className="space-y-8">
//           <div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">
//               Edit Quiz
//             </h3>
//             <div className="grid gap-4">
//               <div className="relative">
//                 <Label htmlFor="edit-title" className="text-gray-700">
//                   Title
//                 </Label>
//                 <Input
//                   id="edit-title"
//                   value={editQuiz.title || ""}
//                   onChange={(e) =>
//                     setEditQuiz({ ...editQuiz, title: e.target.value })
//                   }
//                   className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
//                 />
//                 <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//               <div className="relative">
//                 <Label htmlFor="edit-description" className="text-gray-700">
//                   Description
//                 </Label>
//                 <Input
//                   id="edit-description"
//                   value={editQuiz.description || ""}
//                   onChange={(e) =>
//                     setEditQuiz({ ...editQuiz, description: e.target.value })
//                   }
//                   className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
//                 />
//                 <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//               <div>
//                 <Label htmlFor="edit-difficulty" className="text-gray-700">
//                   Difficulty
//                 </Label>
//                 <Select
//                   value={editQuiz.difficultyLevel || ""}
//                   onValueChange={(value) =>
//                     setEditQuiz({ ...editQuiz, difficultyLevel: value })
//                   }
//                 >
//                   <SelectTrigger
//                     id="edit-difficulty"
//                     className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
//                   >
//                     <SelectValue placeholder="Select difficulty" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white rounded-lg shadow-lg">
//                     <SelectItem value="EASY" className="hover:bg-blue-100">
//                       Easy
//                     </SelectItem>
//                     <SelectItem value="MEDIUM" className="hover:bg-blue-100">
//                       Medium
//                     </SelectItem>
//                     <SelectItem value="HARD" className="hover:bg-blue-100">
//                       Hard
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="relative">
//                 <Label htmlFor="edit-time-limit" className="text-gray-700">
//                   Time Limit (minutes)
//                 </Label>
//                 <Input
//                   id="edit-time-limit"
//                   type="number"
//                   value={editQuiz.timeLimit || ""}
//                   onChange={(e) =>
//                     setEditQuiz({
//                       ...editQuiz,
//                       timeLimit: Number(e.target.value),
//                     })
//                   }
//                   className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
//                 />
//                 <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//               <div className="relative">
//                 <Label htmlFor="edit-created-by" className="text-gray-700">
//                   Created By
//                 </Label>
//                 <Input
//                   id="edit-created-by"
//                   value={editQuiz.createdBy || ""}
//                   onChange={(e) =>
//                     setEditQuiz({ ...editQuiz, createdBy: e.target.value })
//                   }
//                   className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
//                 />
//                 <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//               <div>
//                 <Label htmlFor="edit-topic" className="text-gray-700">
//                   Topic
//                 </Label>
//                 <Select
//                   value={editQuiz.topicId?.toString() || ""}
//                   onValueChange={(value) =>
//                     setEditQuiz({
//                       ...editQuiz,
//                       topicId: Number(value),
//                       subtopicId: undefined,
//                     })
//                   }
//                 >
//                   <SelectTrigger
//                     id="edit-topic"
//                     className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
//                   >
//                     <SelectValue placeholder="Select topic" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white rounded-lg shadow-lg">
//                     {topics.map((topic) => (
//                       <SelectItem
//                         key={topic.id}
//                         value={topic.id.toString()}
//                         className="hover:bg-blue-100"
//                       >
//                         {topic.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="edit-subtopic" className="text-gray-700">
//                   Subtopic
//                 </Label>
//                 <Select
//                   value={editQuiz.subtopicId?.toString() || ""}
//                   onValueChange={(value) =>
//                     setEditQuiz({ ...editQuiz, subtopicId: Number(value) })
//                   }
//                 >
//                   <SelectTrigger
//                     id="edit-subtopic"
//                     className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
//                   >
//                     <SelectValue placeholder="Select subtopic" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white rounded-lg shadow-lg">
//                     {allSubtopics
//                       .filter((sub) =>
//                         editQuiz.topicId
//                           ? sub.topicId === editQuiz.topicId
//                           : true
//                       )
//                       .map((subtopic) => (
//                         <SelectItem
//                           key={subtopic合格.id}
//                           value={subtopic.id.toString()}
//                           className="hover:bg-blue-100"
//                         >
//                           {subtopic.name}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <Button
//                 onClick={handleUpdateQuiz}
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200"
//               >
//                 <ChevronRight className="h-4 w-4" />
//                 Update Quiz
//               </Button>
//             </div>
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">
//               Add Question
//             </h3>
//             <div className="grid gap-4">
//               <div className="relative">
//                 <Label htmlFor="question-text" className="text-gray-700">
//                   Question Text
//                 </Label>
//                 <Input
//                   id="question-text"
//                   value={newQuestion.questionText}
//                   onChange={(e) =>
//                     setNewQuestion({
//                       ...newQuestion,
//                       questionText: e.target.value,
//                     })
//                   }
//                   className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
//                 />
//                 <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//               <div>
//                 <Label htmlFor="question-type" className="text-gray-700">
//                   Question Type
//                 </Label>
//                 <Select
//                   value={newQuestion.questionType}
//                   onValueChange={(value) =>
//                     setNewQuestion({
//                       ...newQuestion,
//                       questionType: value as
//                         | "MCQ"
//                         | "TRUE_FALSE"
//                         | "FILL_BLANK",
//                       options:
//                         value === "TRUE_FALSE"
//                           ? [
//                               { optionText: "True", isCorrect: false },
//                               { optionText: "False", isCorrect: false },
//                             ]
//                           : value === "FILL_BLANK"
//                           ? []
//                           : newQuestion.options,
//                     })
//                   }
//                 >
//                   <SelectTrigger
//                     id="question-type"
//                     className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
//                   >
//                     <SelectValue placeholder="Select question type" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white rounded-lg shadow-lg">
//                     <SelectItem value="MCQ" className="hover:bg-blue-100">
//                       Multiple Choice
//                     </SelectItem>
//                     <SelectItem
//                       value="TRUE_FALSE"
//                       className="hover:bg-blue-100"
//                     >
//                       True/False
//                     </SelectItem>
//                     <SelectItem
//                       value="FILL_BLANK"
//                       className="hover:bg-blue-100"
//                     >
//                       Fill in the Blank
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               {newQuestion.questionType === "MCQ" && (
//                 <div>
//                   <Label className="text-gray-700">Options</Label>
//                   {newQuestion.options.map((option, index) => (
//                     <div key={index} className="flex gap-2 mb-2 items-center">
//                       <Input
//                         placeholder={`Option ${index + 1}`}
//                         value={option.optionText}
//                         onChange={(e) =>
//                           updateOption(index, "optionText", e.target.value)
//                         }
//                         className="rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
//                       />
//                       <input
//                         type="checkbox"
//                         checked={option.isCorrect}
//                         onChange={(e) =>
//                           updateOption(index, "isCorrect", e.target.checked)
//                         }
//                         className="h-5 w-5 text-blue-500"
//                       />
//                       <Label className="text-gray-700">Correct</Label>
//                     </div>
//                   ))}
//                   <Button
//                     variant="outline"
//                     onClick={addOption}
//                     className="rounded-lg border-gray-200 hover:bg-gray-100"
//                   >
//                     Add Option
//                   </Button>
//                 </div>
//               )}
//               <Button
//                 onClick={handleAddQuestion}
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add Question
//               </Button>
//             </div>
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-4">
//               Questions
//             </h3>
//             {questions.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">
//                 No questions found.
//               </p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table className="w-full">
//                   <TableHeader>
//                     <TableRow className="bg-gray-50">
//                       <TableHead className="text-gray-700 font-semibold">
//                         ID
//                       </TableHead>
//                       <TableHead className="text-gray-700 font-semibold">
//                         Question Text
//                       </TableHead>
//                       <TableHead className="text-gray-700 font-semibold">
//                         Type
//                       </TableHead>
//                       <TableHead className="text-gray-700 font-semibold">
//                         Actions
//                       </TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {questions.map((question) => (
//                       <TableRow
//                         key={question.id}
//                         className="hover:bg-gray-50 transition-all duration-200"
//                       >
//                         <TableCell className="text-gray-800">
//                           {question.id}
//                         </TableCell>
//                         <TableCell className="text-gray-800">
//                           {question.questionText}
//                         </TableCell>
//                         <TableCell className="text-gray-800">
//                           {question.questionType}
//                         </TableCell>
//                         <TableCell className="flex gap-2">
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             onClick={() =>
//                               setEditQuestionData({
//                                 id: question.id!,
//                                 questionText: question.questionText,
//                                 questionType: question.questionType,
//                                 quizId: Number(quizId),
//                                 options: question.options,
//                               })
//                             }
//                             className="rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-200"
//                           >
//                             <Edit className="h-4 w-4 text-blue-500" />
//                           </Button>
//                           <Button
//                             variant="destructive"
//                             size="icon"
//                             onClick={() => setDeleteQuestionId(question.id!)}
//                             className="rounded-full bg-red-100 hover:bg-red-200 transition-all duration-200"
//                           >
//                             <Trash2 className="h-4 w-4 text-red-500" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </div>
//           {editQuestionData && (
//             <Dialog
//               open={!!editQuestionData}
//               onOpenChange={() => setEditQuestionData(null)}
//             >
//               <DialogContent className="bg-white rounded-2xl shadow-xl max-w-lg">
//                 <motion.div
//                   initial={{ scale: 0.95, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <DialogHeader>
//                     <DialogTitle className="text-xl font-bold text-gray-800">
//                       Edit Question
//                     </DialogTitle>
//                   </DialogHeader>
//                   <div className="grid gap-4 mt-4">
//                     <div className="relative">
//                       <Label
//                         htmlFor="edit-question-text"
//                         className="text-gray-700"
//                       >
//                         Question Text
//                       </Label>
//                       <Input
//                         id="edit-question-text"
//                         value={editQuestionData.questionText}
//                         onChange={(e) =>
//                           setEditQuestionData({
//                             ...editQuestionData,
//                             questionText: e.target.value,
//                           })
//                         }
//                         className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
//                       />
//                       <BookOpen className="absolute left-3 top-9 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     </div>
//                     <div>
//                       <Label
//                         htmlFor="edit-question-type"
//                         className="text-gray-700"
//                       >
//                         Question Type
//                       </Label>
//                       <Select
//                         value={editQuestionData.questionType}
//                         onValueChange={(value) =>
//                           setEditQuestionData({
//                             ...editQuestionData,
//                             questionType: value as
//                               | "MCQ"
//                               | "TRUE_FALSE"
//                               | "FILL_BLANK",
//                             options:
//                               value === "TRUE_FALSE"
//                                 ? [
//                                     { optionText: "True", isCorrect: false },
//                                     { optionText: "False", isCorrect: false },
//                                   ]
//                                 : value === "FILL_BLANK"
//                                 ? []
//                                 : editQuestionData.options,
//                           })
//                         }
//                       >
//                         <SelectTrigger
//                           id="edit-question-type"
//                           className="mt-1 w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
//                         >
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white rounded-lg shadow-lg">
//                           <SelectItem value="MCQ" className="hover:bg-blue-100">
//                             Multiple Choice
//                           </SelectItem>
//                           <SelectItem
//                             value="TRUE_FALSE"
//                             className="hover:bg-blue-100"
//                           >
//                             True/False
//                           </SelectItem>
//                           <SelectItem
//                             value="FILL_BLANK"
//                             className="hover:bg-blue-100"
//                           >
//                             Fill in the Blank
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     {editQuestionData.questionType === "MCQ" && (
//                       <div>
//                         <Label className="text-gray-700">Options</Label>
//                         {editQuestionData.options.map((option, index) => (
//                           <div
//                             key={index}
//                             className="flex gap-2 mb-2 items-center"
//                           >
//                             <Input
//                               value={option.optionText}
//                               onChange={(e) =>
//                                 updateEditOption(
//                                   index,
//                                   "optionText",
//                                   e.target.value
//                                 )
//                               }
//                               className="rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
//                             />
//                             <input
//                               type="checkbox"
//                               checked={option.isCorrect}
//                               onChange={(e) =>
//                                 updateEditOption(
//                                   index,
//                                   "isCorrect",
//                                   e.target.checked
//                                 )
//                               }
//                               className="h-5 w-5 text-blue-500"
//                             />
//                             <Label className="text-gray-700">Correct</Label>
//                           </div>
//                         ))}
//                         <Button
//                           variant="outline"
//                           onClick={() =>
//                             setEditQuestionData({
//                               ...editQuestionData,
//                               options: [
//                                 ...editQuestionData.options,
//                                 { optionText: "", isCorrect: false },
//                               ],
//                             })
//                           }
//                           className="rounded-lg border-gray-200 hover:bg-gray-100"
//                         >
//                           Add Option
//                         </Button>
//                       </div>
//                     )}
//                     <Button
//                       onClick={handleEditQuestion}
//                       className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200"
//                     >
//                       <ChevronRight className="h-4 w-4" />
//                       Update Question
//                     </Button>
//                   </div>
//                 </motion.div>
//               </DialogContent>
//             </Dialog>
//           )}
//           <Dialog
//             open={deleteQuestionId !== null}
//             onOpenChange={() => setDeleteQuestionId(null)}
//           >
//             <DialogContent className="bg-white rounded-2xl shadow-xl">
//               <motion.div
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <DialogHeader>
//                   <DialogTitle className="text-xl font-bold text-gray-800">
//                     Confirm Delete
//                   </DialogTitle>
//                 </DialogHeader>
//                 <p className="text-gray-600">
//                   Are you sure you want to delete this question? This action
//                   cannot be undone.
//                 </p>
//                 <DialogFooter className="mt-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => setDeleteQuestionId(null)}
//                     className="rounded-lg border-gray-200 hover:bg-gray-100"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     onClick={handleDeleteQuestion}
//                     className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg"
//                   >
//                     Delete
//                   </Button>
//                 </DialogFooter>
//               </motion.div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// Dashboard Home Component
const DashboardHome: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, quizzes, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );

  useEffect(() => {
    dispatch(fetchTopics());
    dispatch(fetchSubtopics());
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const subtopicCount = topics.flatMap((topic) => topic.subtopics || []).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Welcome, Admin!
          </h3>
          <p className="text-gray-600">
            Manage your quiz content from the sidebar.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-md"
            >
              <h4 className="text-base font-semibold text-gray-800">Topics</h4>
              <p className="text-2xl font-bold text-blue-600">
                {topics.length}
              </p>
              <Link to="/admin/topics">
                <Button
                  variant="link"
                  className="p-0 text-blue-500 hover:text-blue-600"
                >
                  Manage Topics
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-md"
            >
              <h4 className="text-base font-semibold text-gray-800">
                Subtopics
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {subtopicCount}
              </p>
              <Link to="/admin/subtopics">
                <Button
                  variant="link"
                  className="p-0 text-green-500 hover:text-green-600"
                >
                  Manage Subtopics
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-md"
            >
              <h4 className="text-base font-semibold text-gray-800">Quizzes</h4>
              <p className="text-2xl font-bold text-purple-600">
                {quizzes.length}
              </p>
              <Link to="/admin/quizzes">
                <Button
                  variant="link"
                  className="p-0 text-purple-500 hover:text-purple-600"
                >
                  Manage Quizzes
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Main Admin Panel Component
const AdminPanel: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800 ml-4">
              QuizWiz Admin Panel
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/topics" element={<TopicList />} />
            <Route path="/subtopics" element={<SubtopicList />} />
            <Route path="/quizzes" element={<QuizList />} />
            {/* <Route path="/quizzes/edit/:quizId" element={<QuizDetails />} /> */}
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminPanel;
