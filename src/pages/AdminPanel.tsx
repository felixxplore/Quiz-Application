"use client";

import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Menu, Sun, Moon, Trash2, Edit, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchTopics,
  createTopic,
  fetchSubtopics,
  createSubtopic,
  fetchQuizzes,
  createQuiz,
  fetchQuizById,
  updateQuiz,
  deleteQuiz,
  fetchQuestionsByQuizId,
  addQuestion,
  editQuestion,
  deleteQuestion,
  editQuiz,
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

// Theme Toggle Component
const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsDark(!isDark)}
      className="text-muted-foreground hover:text-foreground"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

// Sidebar Component
const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
  isOpen,
  toggleSidebar,
}) => {
  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Topics", path: "/admin/topics" },
    { name: "Subtopics", path: "/admin/subtopics" },
    { name: "Quizzes", path: "/admin/quizzes" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          exit={{ x: -256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border md:static md:z-auto"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
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
                    className="block p-2 rounded-md text-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  >
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
      alert("Please enter a topic name");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="New topic name"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <Button onClick={handleCreateTopic}>
            <Plus className="mr-2 h-4 w-4" /> Add Topic
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : topics.length === 0 ? (
          <p>No topics found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell>{topic.id}</TableCell>
                  <TableCell>{topic.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
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
      alert("Please enter a subtopic name and select a topic");
    }
  };

  console.log("Topics:", topics);
  const topicArray = Object.values(topics); // Convert topics object to array
  // const allSubtopics = topics.flatMap((topic) => topic.subtopics || []);
  const allSubtopics = topicArray.flatMap((topic) =>
    (topic.subtopics || []).map((subtopic) => ({
      ...subtopic,
      topicName: topic.name, // Add topicName to each subtopic
    }))
  );
  console.log("All Subtopics:", allSubtopics);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subtopics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="subtopic-name">Subtopic Name</Label>
            <Input
              id="subtopic-name"
              placeholder="New subtopic name"
              value={newSubtopic.name}
              onChange={(e) =>
                setNewSubtopic({ ...newSubtopic, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="topic-select">Topic</Label>
            <Select
              value={newSubtopic.topicId}
              onValueChange={(value) =>
                setNewSubtopic({ ...newSubtopic, topicId: value })
              }
            >
              <SelectTrigger id="topic-select">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent className="bg-white ">
                {topicArray.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id.toString()}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateSubtopic} className="sm:col-span-2">
            <Plus className="mr-2 h-4 w-4" /> Add Subtopic
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : allSubtopics.length === 0 ? (
          <p>No subtopics found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Topic</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSubtopics.map((subtopic) => (
                <TableRow
                  key={subtopic.id}
                  className="hover:bg-white focus:bg-white dark:hover:bg-gray-800 dark:focus:bg-gray-800 dar:hover:rounded-lg hover:text-white   transition-all duration-200 "
                >
                  <TableCell>{subtopic.id}</TableCell>
                  <TableCell>{subtopic.name}</TableCell>
                  <TableCell>{subtopic.topicName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

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
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            id={id}
          >
            {selectedOption ? selectedOption.name : placeholder}
            <Check
              className={`ml-2 h-4 w-4 ${value ? "opacity-100" : "opacity-0"}`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full  bg-white ">
          <Command>
            <CommandInput
              className="mt-2 pl-2"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
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
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === option.id.toString()
                          ? "opacity-100"
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
// Interfaces for Question and AnswerOptionOption
interface AnswerOptionOption {
  id?: number;
  optionText: string;
  isCorrect: boolean;
  optionIndex: number;
  questionId?: number;
}
interface Question {
  id?: number;
  questionText: string;
  questionType: "FILL_BLANK" | "TRUE_FALSE" | "MCQ";
  quizId: number;
  options: AnswerOptionOption[];
}
// Quiz List Component
const QuizList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, topics, questions, loading, error } = useSelector(
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

  // const [editQuizData, setEditQuizData] = useState<{
  //   id: number;
  //   title: string;
  //   description: string;
  //   difficultyLevel: "EASY" | "MEDIUM" | "HARD";
  //   timeLimit: string;
  //   topicId: string;
  //   subtopicId: string;
  // } | null>(null);
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteQuizId, setDeleteQuizId] = useState<number | null>(null);

  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] =
    useState(false);
  const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] =
    useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({
    questionText: "",
    explanation: "",
    questionType: "MCQ",
    options: [
      { optionText: "", isCorrect: false, optionIndex: 0 },
      { optionText: "", isCorrect: false, optionIndex: 1 },
      { optionText: "", isCorrect: false, optionIndex: 2 },
      { optionText: "", isCorrect: false, optionIndex: 3 },
    ],
  });
  const [editQuestionData, setEditQuestionData] = useState<Question | null>(
    null
  );
  const [deleteQuestionId, setDeleteQuestionId] = useState<
    number | undefined | null
  >(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchTopics());
  }, [dispatch]);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // create quiz
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
      console.log("Quiz Data:", quizData);
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
        setIsDialogOpen(false); // Close dialog
        await Promise.all([dispatch(fetchTopics())]);
      } catch (error: any) {
        console.error("Error creating quiz:", error);
        toast.error(error || "Failed to create quiz. Please try again.");
      } finally {
        setIsCreating(false);
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  // edit quiz
  const handleEditQuiz = async () => {
    if (
      editQuizData &&
      editQuizData.title.trim() &&
      editQuizData.description.trim() &&
      editQuizData.difficultyLevel &&
      editQuizData.timeLimit &&
      editQuizData.topicId &&
      editQuizData.subtopicId
    ) {
      const quizInfo = {
        title: editQuizData.title,
        description: editQuizData.description,
        difficultyLevel: editQuizData.difficultyLevel as
          | "EASY"
          | "MEDIUM"
          | "HARD",
        timeLimit: Number(editQuizData.timeLimit),
        topicId: Number(editQuizData.topicId),
        subtopicId: Number(editQuizData.subtopicId),
        id: Number(editQuizData.id),
      };
      try {
        await dispatch(
          editQuiz({ quizId: editQuizData.id, quizInfo })
        ).unwrap();
        toast.success("Quiz updated successfully!");
        setIsEditDialogOpen(false);
        await dispatch(fetchQuizzes());
      } catch (error: any) {
        console.error("Error updating quiz:", error);
        toast.error(error || "Failed to update quiz. Please try again.");
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  // handle delete quiz :
  const handleDeleteQuiz = async () => {
    if (deleteQuizId !== null) {
      try {
        await dispatch(deleteQuiz(deleteQuizId)).unwrap();
        toast.success("Quiz deleted successfully!");
        setDeleteQuizId(null);
        await dispatch(fetchQuizzes());
      } catch (error: any) {
        console.error("Error deleting quiz:", error);
        toast.error(error || "Failed to delete quiz. Please try again.");
      }
    }
  };

  // handle add question
  const handleAddQuestion = async () => {
    if (
      editQuizData &&
      newQuestion.questionText.trim() &&
      newQuestion.options.every((opt) => opt.optionText.trim()) &&
      newQuestion.options.some((opt) => opt.isCorrect) &&
      newQuestion.questionType
    ) {
      try {
        await dispatch(
          addQuestion({ quizId: editQuizData.id, question: newQuestion })
        ).unwrap();
        toast.success("Question added successfully!");
        setNewQuestion({
          questionText: "",
          explanation: "",
          questionType: "MCQ",
          options: [
            { optionText: "", isCorrect: false, optionIndex: 0 },
            { optionText: "", isCorrect: false, optionIndex: 1 },
            { optionText: "", isCorrect: false, optionIndex: 2 },
            { optionText: "", isCorrect: false, optionIndex: 3 },
          ],
        });
        setIsQuestionDialogOpen(false);
        await dispatch(fetchQuestionsByQuizId(editQuizData.id));
      } catch (error: any) {
        console.error("Error adding question:", error);
        toast.error(error || "Failed to add question. Please try again.");
      }
    } else {
      toast.error("Please fill in all question fields correctly.");
    }
  };

  // handle edit question
  const handleEditQuestion = async () => {
    if (
      editQuestionData &&
      editQuestionData.questionText.trim() &&
      editQuestionData.options.every((opt) => opt.optionText.trim()) &&
      editQuestionData.options.some((opt) => opt.isCorrect) &&
      editQuestionData.questionType
    ) {
      try {
        await dispatch(
          editQuestion({
            questionId: editQuestionData.id,
            question: editQuestionData,
          })
        ).unwrap();
        toast.success("Question updated successfully!");
        setIsEditQuestionDialogOpen(false);
        if (editQuizData) {
          await dispatch(fetchQuestionsByQuizId(editQuizData.id));
        }
      } catch (error: any) {
        console.error("Error updating question:", error);
        toast.error(error || "Failed to update question. Please try again.");
      }
    } else {
      toast.error(
        "Please fill in all question fields correctly and select a correct option."
      );
    }
  };

  // handle delete question
  // const handleDeleteQuestion = async () => {
  //   if (deleteQuestionId !== null) {
  //     try {
  //       await dispatch(deleteQuestion(deleteQuestionId)).unwrap();
  //       toast.success("Question deleted successfully!");
  //       setDeleteQuestionId(null);
  //       if (editQuizData) {
  //         await dispatch(fetchQuestionsByQuizId(editQuizData.id));
  //       }
  //     } catch (error: any) {
  //       console.error("Error deleting question:", error);
  //       toast.error(error || "Failed to delete question. Please try again.");
  //     }
  //   }
  // };

  console.log("Topics:", topics);
  const allSubtopics = topics.flatMap((topic) =>
    (topic.subtopics || []).map((subtopic) => ({
      ...subtopic,
      topicId: topic.id,
    }))
  );
  console.log("All Subtopics:", allSubtopics);

  const filteredSubtopics = allSubtopics.filter((sub) =>
    newQuiz.topicId ? sub.topicId === Number(newQuiz.topicId) : true
  );
  console.log("Filtered Subtopics:", filteredSubtopics);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quizzes</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Create quiz dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">
              <Plus className="mr-2 h-4 w-4" /> Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="quiz-title" className="mb-2">
                  Title
                </Label>
                <Input
                  placeholder="Enter quiz title"
                  id="quiz-title"
                  value={newQuiz.title}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="quiz-description" className="mb-2">
                  Description
                </Label>
                <Input
                  placeholder="Enter quiz description"
                  id="quiz-description"
                  value={newQuiz.description}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="quiz-difficulty" className="mb-2">
                  Difficulty
                </Label>
                <Select
                  value={newQuiz.difficultyLevel}
                  onValueChange={(value) =>
                    setNewQuiz({ ...newQuiz, difficultyLevel: value })
                  }
                >
                  <SelectTrigger id="quiz-difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="Z-[1000] bg-white">
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quiz-time-limit" className="mb-2">
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
                />
              </div>

              {/* for topic*/}
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

              {/* for subtopic */}
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

              <Button onClick={handleCreateQuiz} disabled={isCreating}>
                {isCreating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {isCreating ? "Creating..." : "Create Quiz"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Quiz Dialog */}
        {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Quiz</DialogTitle>
            </DialogHeader>
            {editQuizData && (
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="edit-quiz-title" className="mb-2">
                    Title
                  </Label>
                  <Input
                    id="edit-quiz-title"
                    value={editQuizData.title}
                    onChange={(e) =>
                      setEditQuizData({
                        ...editQuizData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-quiz-description" className="mb-2">
                    Description
                  </Label>
                  <Input
                    id="edit-quiz-description"
                    value={editQuizData.description}
                    onChange={(e) =>
                      setEditQuizData({
                        ...editQuizData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-quiz-difficulty" className="mb-2">
                    Difficulty
                  </Label>
                  <Select
                    value={editQuizData.difficultyLevel}
                    onValueChange={(value) =>
                      setEditQuizData({
                        ...editQuizData,
                        difficultyLevel: value as "EASY" | "MEDIUM" | "HARD",
                      })
                    }
                  >
                    <SelectTrigger id="edit-quiz-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="z-[1000] bg-white">
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-quiz-time-limit" className="mb-2">
                    Time Limit (minutes)
                  </Label>
                  <Input
                    id="edit-quiz-time-limit"
                    type="number"
                    value={editQuizData.timeLimit}
                    onChange={(e) =>
                      setEditQuizData({
                        ...editQuizData,
                        timeLimit: e.target.value,
                      })
                    }
                  />
                </div>
                <SearchableSelect
                  options={topics.map((topic) => ({
                    id: topic.id,
                    name: topic.name,
                  }))}
                  value={editQuizData.topicId}
                  onChange={(value) =>
                    setEditQuizData({
                      ...editQuizData,
                      topicId: value,
                      subtopicId: "",
                    })
                  }
                  placeholder="Select topic"
                  label="Topic"
                  id="edit-quiz-topic"
                />
                <SearchableSelect
                  options={filteredSubtopicsForEdit.map((subtopic) => ({
                    id: subtopic.id,
                    name: subtopic.name,
                  }))}
                  value={editQuizData.subtopicId}
                  onChange={(value) =>
                    setEditQuizData({ ...editQuizData, subtopicId: value })
                  }
                  placeholder="Select subtopic"
                  label="Subtopic"
                  id="edit-quiz-subtopic"
                />
                <Button onClick={handleEditQuiz}>Save Changes</Button>

                {/* Questions Section */}
        {/* <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Questions</h3>
                    <Button onClick={() => setIsQuestionDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                  </div>
                  {questions.length === 0 ? (
                    <p>No questions found for this quiz.</p>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <div
                          key={question.id}
                          className="border p-4 rounded-md"
                        >
                          <p className="font-medium">{question.questionText}</p>
                          <p className="text-sm text-gray-500">
                            Type: {question.questionType}
                          </p>
                          {question.explanation && (
                            <p className="text-sm text-gray-500">
                              Explanation: {question.explanation}
                            </p>
                          )}
                          <ul className="list-disc pl-5 mt-2">
                            {question.options.map((option) => (
                              <li
                                key={option.optionIndex}
                                className={
                                  option.isCorrect ? "text-green-600" : ""
                                }
                              >
                                {option.optionText}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-2 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditQuestionData({
                                  id: question.id,
                                  questionText: question.questionText,
                                  explanation: question.explanation || "",
                                  questionType: question.questionType,
                                  options: [...question.options],
                                });
                                setIsEditQuestionDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setDeleteQuestionId(question.id);
                                setIsDeleteQuestionDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div> */}
        {/* )} */}
        {/* </DialogContent> */}
        {/* </Dialog> */}

        {/* Add Question Dialog */}
        {/* <Dialog
          open={isQuestionDialogOpen}
          onOpenChange={setIsQuestionDialogOpen}
        >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="question-text" className="mb-2">
                  Question Text
                </Label>
                <Input
                  id="question-text"
                  value={newQuestion.questionText}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      questionText: e.target.value,
                    })
                  }
                  placeholder="Enter question text"
                />
              </div>
              <div>
                <Label htmlFor="question-type" className="mb-2">
                  Question Type
                </Label>
                <Select
                  value={newQuestion.questionType}
                  onValueChange={(value) =>
                    setNewQuestion({
                      ...newQuestion,
                      questionType: value as
                        | "FILL_BLANK"
                        | "TRUE_FALSE"
                        | "MCQ",
                      options:
                        value === "TRUE_FALSE"
                          ? [
                              {
                                optionText: "True",
                                isCorrect: false,
                                optionIndex: 0,
                              },
                              {
                                optionText: "False",
                                isCorrect: false,
                                optionIndex: 1,
                              },
                            ]
                          : [
                              {
                                optionText: "",
                                isCorrect: false,
                                optionIndex: 0,
                              },
                              {
                                optionText: "",
                                isCorrect: false,
                                optionIndex: 1,
                              },
                              {
                                optionText: "",
                                isCorrect: false,
                                optionIndex: 2,
                              },
                              {
                                optionText: "",
                                isCorrect: false,
                                optionIndex: 3,
                              },
                            ],
                    })
                  }
                >
                  <SelectTrigger id="question-type">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000] bg-white">
                    <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
                    <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                    <SelectItem value="FILL_BLANK">
                      Fill in the Blank
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="explanation" className="mb-2">
                  Explanation (Optional)
                </Label>
                <Input
                  id="explanation"
                  value={newQuestion.explanation || ""}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      explanation: e.target.value,
                    })
                  }
                  placeholder="Enter explanation"
                />
              </div>
              {newQuestion.questionType !== "FILL_BLANK" && (
                <>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label
                          htmlFor={`option-${index}`}
                          className="mb-2"
                        >{`Option ${index + 1}`}</Label>
                        <Input
                          id={`option-${index}`}
                          value={option.optionText}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options];
                            newOptions[index] = {
                              ...newOptions[index],
                              optionText: e.target.value,
                            };
                            setNewQuestion({
                              ...newQuestion,
                              options: newOptions,
                            });
                          }}
                          placeholder={`Enter option ${index + 1}`}
                          disabled={newQuestion.questionType === "TRUE_FALSE"}
                        />
                      </div>
                      <div>
                        <Label className="mb-2">Correct</Label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options].map(
                                (opt, idx) => ({
                                  ...opt,
                                  isCorrect:
                                    idx === index ? e.target.checked : false,
                                })
                              );
                              setNewQuestion({
                                ...newQuestion,
                                options: newOptions,
                              });
                            }}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <Button onClick={handleAddQuestion}>Add Question</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Question Dialog */}
        {/* <Dialog
          open={isEditQuestionDialogOpen}
          onOpenChange={setIsEditQuestionDialogOpen}
        >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            {editQuestionData && (
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="edit-question-text" className="mb-2">
                    Question Text
                  </Label>
                  <Input
                    id="edit-question-text"
                    value={editQuestionData.questionText}
                    onChange={(e) =>
                      setEditQuestionData({
                        ...editQuestionData,
                        questionText: e.target.value,
                      })
                    }
                    placeholder="Enter question text"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-question-type" className="mb-2">
                    Question Type
                  </Label>
                  <Select
                    value={editQuestionData.questionType}
                    onValueChange={(value) =>
                      setEditQuestionData({
                        ...editQuestionData,
                        questionType: value as
                          | "FILL_BLANK"
                          | "TRUE_FALSE"
                          | "MCQ",
                        options:
                          value === "TRUE_FALSE"
                            ? [
                                {
                                  optionText: "True",
                                  isCorrect: false,
                                  optionIndex: 0,
                                },
                                {
                                  optionText: "False",
                                  isCorrect: false,
                                  optionIndex: 1,
                                },
                              ]
                            : editQuestionData.options.length === 2
                            ? [
                                {
                                  optionText: "",
                                  isCorrect: false,
                                  optionIndex: 0,
                                },
                                {
                                  optionText: "",
                                  isCorrect: false,
                                  optionIndex: 1,
                                },
                                {
                                  optionText: "",
                                  isCorrect: false,
                                  optionIndex: 2,
                                },
                                {
                                  optionText: "",
                                  isCorrect: false,
                                  optionIndex: 3,
                                },
                              ]
                            : editQuestionData.options,
                      })
                    }
                  >
                    <SelectTrigger id="edit-question-type">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent className="z-[1000] bg-white">
                      <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
                      <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                      <SelectItem value="FILL_BLANK">
                        Fill in the Blank
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-explanation" className="mb-2">
                    Explanation (Optional)
                  </Label>
                  <Input
                    id="edit-explanation"
                    value={editQuestionData.explanation || ""}
                    onChange={(e) =>
                      setEditQuestionData({
                        ...editQuestionData,
                        explanation: e.target.value,
                      })
                    }
                    placeholder="Enter explanation"
                  />
                </div>
                {editQuestionData.questionType !== "FILL_BLANK" && (
                  <>
                    {editQuestionData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label
                            htmlFor={`edit-option-${index}`}
                            className="mb-2"
                          >{`Option ${index + 1}`}</Label>
                          <Input
                            id={`edit-option-${index}`}
                            value={option.optionText}
                            onChange={(e) => {
                              const newOptions = [...editQuestionData.options];
                              newOptions[index] = {
                                ...newOptions[index],
                                optionText: e.target.value,
                              };
                              setEditQuestionData({
                                ...editQuestionData,
                                options: newOptions,
                              });
                            }}
                            placeholder={`Enter option ${index + 1}`}
                            disabled={
                              editQuestionData.questionType === "TRUE_FALSE"
                            }
                          />
                        </div>
                        <div>
                          <Label className="mb-2">Correct</Label>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={(e) => {
                                const newOptions = [
                                  ...editQuestionData.options,
                                ].map((opt, idx) => ({
                                  ...opt,
                                  isCorrect:
                                    idx === index ? e.target.checked : false,
                                }));
                                setEditQuestionData({
                                  ...editQuestionData,
                                  options: newOptions,
                                });
                              }}
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <Button onClick={handleEditQuestion}>Save Changes</Button>
              </div>
            )}
          </DialogContent>
        </Dialog> */}

        {/* Delete Question Dialog */}
        {/* <Dialog
          open={isDeleteQuestionDialogOpen}
          onOpenChange={setIsDeleteQuestionDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteQuestionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteQuestion}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>  */}

        {/* Quiz Table */}
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : quizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Subtopic</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>{quiz.id}</TableCell>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.topicName}</TableCell>
                  <TableCell>{quiz.subtopicName}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Link to={`/admin/quizzes/edit/${quiz.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteQuizId(quiz.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4 bg-red" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Delete Quiz Confirmation */}
        <Dialog
          open={deleteQuizId !== null}
          onOpenChange={() => setDeleteQuizId(null)}
        >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteQuizId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-red-500"
                onClick={handleDeleteQuiz}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// Quiz Details Component
const QuizDetails: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { quiz, questions, topics, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const [editQuiz, setEditQuiz] = useState<
    Partial<{
      id: number;
      title: string;
      description: string;
      difficultyLevel: "EASY" | "MEDIUM" | "HARD";
      timeLimit: number;
      createdBy: string;
      topicId: number;
      subtopicId: number;
      topicName: string;
      subtopicName: string;
    }>
  >({});
  const [newQuestion, setNewQuestion] = useState<{
    questionText: string;
    questionType: "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "";
    options: { optionText: string; isCorrect: boolean }[];
  }>({
    questionText: "",
    questionType: "",
    options: [],
  });
  const [editQuestionData, setEditQuestionData] = useState<{
    id: number;
    questionText: string;
    questionType: "MCQ" | "TRUE_FALSE" | "FILL_BLANK";
    quizId: number;
    options: { optionText: string; isCorrect: boolean; id?: number }[];
  } | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizById(Number(quizId)));
      dispatch(fetchQuestionsByQuizId(Number(quizId)));
      dispatch(fetchTopics());
      dispatch(fetchSubtopics());
    }
  }, [dispatch, quizId]);

  useEffect(() => {
    if (quiz) {
      setEditQuiz({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        difficultyLevel: quiz.difficultyLevel,
        timeLimit: quiz.timeLimit,
        createdBy: quiz.createdBy || "admin",
        topicId: quiz.topicId,
        subtopicId: quiz.subtopicId,
        topicName: quiz.topicName,
        subtopicName: quiz.subtopicName,
      });
    }
  }, [quiz]);

  const handleUpdateQuiz = () => {
    if (
      quizId &&
      editQuiz.title &&
      editQuiz.description &&
      editQuiz.difficultyLevel &&
      editQuiz.timeLimit &&
      editQuiz.topicId &&
      editQuiz.subtopicId
    ) {
      dispatch(
        updateQuiz({
          id: Number(quizId),
          title: editQuiz.title,
          description: editQuiz.description,
          difficultyLevel: editQuiz.difficultyLevel as
            | "EASY"
            | "MEDIUM"
            | "HARD",
          timeLimit: Number(editQuiz.timeLimit),
          createdBy: editQuiz.createdBy || "admin",
          topicId: Number(editQuiz.topicId),
          subtopicId: Number(editQuiz.subtopicId),
          topicName:
            editQuiz.topicName ||
            topics.find((t) => t.id === editQuiz.topicId)?.name ||
            "",
          subtopicName:
            editQuiz.subtopicName ||
            topics
              .flatMap((t) => t.subtopics || [])
              .find((s) => s.id === editQuiz.subtopicId)?.name ||
            "",
          topic: {
            id: Number(editQuiz.topicId),
            name:
              editQuiz.topicName ||
              topics.find((t) => t.id === editQuiz.topicId)?.name ||
              "",
          },
        })
      );
    }
  };

  const handleAddQuestion = () => {
    if (quizId && newQuestion.questionText && newQuestion.questionType) {
      dispatch(
        addQuestion({
          quizId: Number(quizId),
          question: {
            questionText: newQuestion.questionText,
            questionType: newQuestion.questionType,
            quizId: Number(quizId),
            options:
              newQuestion.questionType === "FILL_BLANK"
                ? []
                : newQuestion.options,
          },
        })
      );
      setNewQuestion({ questionText: "", questionType: "", options: [] });
    }
  };

  const handleEditQuestion = () => {
    if (editQuestionData && quizId) {
      dispatch(
        editQuestion({
          id: editQuestionData.id,
          questionText: editQuestionData.questionText,
          questionType: editQuestionData.questionType,
          quizId: Number(quizId),
          options: editQuestionData.options,
        })
      );
      setEditQuestionData(null);
    }
  };

  const handleDeleteQuestion = () => {
    if (deleteQuestionId !== null) {
      dispatch(deleteQuestion(deleteQuestionId));
      setDeleteQuestionId(null);
    }
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { optionText: "", isCorrect: false }],
    });
  };

  const updateOption = (
    index: number,
    field: "optionText" | "isCorrect",
    value: string | boolean
  ) => {
    const updatedOptions = newQuestion.options.map((opt, i) =>
      i === index ? { ...opt, [field]: value } : opt
    );
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const updateEditOption = (
    index: number,
    field: "optionText" | "isCorrect",
    value: string | boolean
  ) => {
    if (editQuestionData) {
      const updatedOptions = editQuestionData.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      );
      setEditQuestionData({ ...editQuestionData, options: updatedOptions });
    }
  };

  const allSubtopics = topics.flatMap((topic) => topic.subtopics || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Details</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : !quiz ? (
          <p>Quiz not found.</p>
        ) : (
          <div className="space-y-6">
            {/* Edit Quiz Form */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Edit Quiz</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editQuiz.title || ""}
                    onChange={(e) =>
                      setEditQuiz({ ...editQuiz, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editQuiz.description || ""}
                    onChange={(e) =>
                      setEditQuiz({ ...editQuiz, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-difficulty">Difficulty</Label>
                  <Select
                    value={editQuiz.difficultyLevel || ""}
                    onValueChange={(value) =>
                      setEditQuiz({ ...editQuiz, difficultyLevel: value })
                    }
                  >
                    <SelectTrigger id="edit-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-time-limit">Time Limit (minutes)</Label>
                  <Input
                    id="edit-time-limit"
                    type="number"
                    value={editQuiz.timeLimit || ""}
                    onChange={(e) =>
                      setEditQuiz({
                        ...editQuiz,
                        timeLimit: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-created-by">Created By</Label>
                  <Input
                    id="edit-created-by"
                    value={editQuiz.createdBy || ""}
                    onChange={(e) =>
                      setEditQuiz({ ...editQuiz, createdBy: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-topic">Topic</Label>
                  <Select
                    value={editQuiz.topicId?.toString() || ""}
                    onValueChange={(value) =>
                      setEditQuiz({
                        ...editQuiz,
                        topicId: Number(value),
                        subtopicId: undefined,
                      })
                    }
                  >
                    <SelectTrigger id="edit-topic">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id.toString()}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-subtopic">Subtopic</Label>
                  <Select
                    value={editQuiz.subtopicId?.toString() || ""}
                    onValueChange={(value) =>
                      setEditQuiz({ ...editQuiz, subtopicId: Number(value) })
                    }
                  >
                    <SelectTrigger id="edit-subtopic">
                      <SelectValue placeholder="Select subtopic" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSubtopics
                        .filter((sub) =>
                          editQuiz.topicId
                            ? sub.topicId === editQuiz.topicId
                            : true
                        )
                        .map((subtopic) => (
                          <SelectItem
                            key={subtopic.id}
                            value={subtopic.id.toString()}
                          >
                            {subtopic.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleUpdateQuiz}>Update Quiz</Button>
              </div>
            </div>
            {/* Add Question Form */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Add Question</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="question-text">Question Text</Label>
                  <Input
                    id="question-text"
                    value={newQuestion.questionText}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        questionText: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="question-type">Question Type</Label>
                  <Select
                    value={newQuestion.questionType}
                    onValueChange={(value) =>
                      setNewQuestion({
                        ...newQuestion,
                        questionType: value as
                          | "MCQ"
                          | "TRUE_FALSE"
                          | "FILL_BLANK",
                        options:
                          value === "TRUE_FALSE"
                            ? [
                                { optionText: "True", isCorrect: false },
                                { optionText: "False", isCorrect: false },
                              ]
                            : value === "FILL_BLANK"
                            ? []
                            : newQuestion.options,
                      })
                    }
                  >
                    <SelectTrigger id="question-type">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MCQ">Multiple Choice</SelectItem>
                      <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                      <SelectItem value="FILL_BLANK">
                        Fill in the Blank
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newQuestion.questionType === "MCQ" && (
                  <div>
                    <Label>Options</Label>
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option.optionText}
                          onChange={(e) =>
                            updateOption(index, "optionText", e.target.value)
                          }
                        />
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) =>
                            updateOption(index, "isCorrect", e.target.checked)
                          }
                        />
                        <Label>Correct</Label>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addOption}>
                      Add Option
                    </Button>
                  </div>
                )}
                <Button onClick={handleAddQuestion}>Add Question</Button>
              </div>
            </div>
            {/* Questions List */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Questions</h3>
              {questions.length === 0 ? (
                <p>No questions found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Question Text</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>{question.id}</TableCell>
                        <TableCell>{question.questionText}</TableCell>
                        <TableCell>{question.questionType}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setEditQuestionData({
                                id: question.id!,
                                questionText: question.questionText,
                                questionType: question.questionType,
                                quizId: Number(quizId),
                                options: question.options,
                              })
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setDeleteQuestionId(question.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            {/* Edit Question Dialog */}
            {editQuestionData && (
              <Dialog
                open={!!editQuestionData}
                onOpenChange={() => setEditQuestionData(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Question</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="edit-question-text">Question Text</Label>
                      <Input
                        id="edit-question-text"
                        value={editQuestionData.questionText}
                        onChange={(e) =>
                          setEditQuestionData({
                            ...editQuestionData,
                            questionText: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-question-type">Question Type</Label>
                      <Select
                        value={editQuestionData.questionType}
                        onValueChange={(value) =>
                          setEditQuestionData({
                            ...editQuestionData,
                            questionType: value as
                              | "MCQ"
                              | "TRUE_FALSE"
                              | "FILL_BLANK",
                            options:
                              value === "TRUE_FALSE"
                                ? [
                                    { optionText: "True", isCorrect: false },
                                    { optionText: "False", isCorrect: false },
                                  ]
                                : value === "FILL_BLANK"
                                ? []
                                : editQuestionData.options,
                          })
                        }
                      >
                        <SelectTrigger id="edit-question-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MCQ">Multiple Choice</SelectItem>
                          <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                          <SelectItem value="FILL_BLANK">
                            Fill in the Blank
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {editQuestionData.questionType === "MCQ" && (
                      <div>
                        <Label>Options</Label>
                        {editQuestionData.options.map((option, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              value={option.optionText}
                              onChange={(e) =>
                                updateEditOption(
                                  index,
                                  "optionText",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={(e) =>
                                updateEditOption(
                                  index,
                                  "isCorrect",
                                  e.target.checked
                                )
                              }
                            />
                            <Label>Correct</Label>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() =>
                            setEditQuestionData({
                              ...editQuestionData,
                              options: [
                                ...editQuestionData.options,
                                { optionText: "", isCorrect: false },
                              ],
                            })
                          }
                        >
                          Add Option
                        </Button>
                      </div>
                    )}
                    <Button onClick={handleEditQuestion}>
                      Update Question
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            {/* Delete Question Confirmation Dialog */}
            <Dialog
              open={deleteQuestionId !== null}
              onOpenChange={() => setDeleteQuestionId(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <p>
                  Are you sure you want to delete this question? This action
                  cannot be undone.
                </p>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteQuestionId(null)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteQuestion}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
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
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Welcome, Admin!</h3>
            <p>Manage your quiz content from the sidebar.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{topics.length}</p>
                  <Link to="/admin/topics">
                    <Button variant="link" className="p-0">
                      Manage Topics
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Subtopics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{subtopicCount}</p>
                  <Link to="/admin/subtopics">
                    <Button variant="link" className="p-0">
                      Manage Subtopics
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{quizzes.length}</p>
                  <Link to="/admin/quizzes">
                    <Button variant="link" className="p-0">
                      Manage Quizzes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Admin Panel Component
const AdminPanel: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div className="flex h-screen bg-gray-100  ">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white  shadow">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold ml-4">Admin Panel</h1>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/topics" element={<TopicList />} />
            <Route path="/subtopics" element={<SubtopicList />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:quizId" element={<QuizDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
