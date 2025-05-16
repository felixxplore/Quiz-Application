import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Users, BookOpen, SortAsc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import Navbar from "./Navbar";
import { fetchQuizzes } from "@/store/quizSlice";

const Quizzes: React.FC = () => {
  const [search, setSearch] = useState("");
  const { quizzes } = useSelector((state: RootState) => state.quiz);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  return (
    <div className="flex flex-col">
      <div className="mt-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className=" text-left text-3xl font-bold tracking-tight">
            Quizzes
          </h1>
          <p className="text-muted-foreground">
            Explore our collection of interactive quizzes across various topics
          </p>
        </div>
        <Button asChild>
          <Link to="/quizzes/create">Create Quiz</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid View */}
          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quizzes.map((quiz) => (
                <Link
                  to={`/quizzes/${quiz.id}`}
                  key={quiz.id}
                  className="group"
                >
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={"./src/assets/image.png"}
                        alt={quiz.title}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant={
                            quiz.difficultyLevel === "EASY"
                              ? "outline"
                              : quiz.difficultyLevel === "MEDIUM"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            quiz.difficultyLevel === "EASY"
                              ? "border-yellow-DEFAULT text-yellow-DEFAULT"
                              : quiz.difficultyLevel === "MEDIUM"
                              ? "bg-orange-DEFAULT hover:bg-orange-DEFAULT/90"
                              : "bg-purple-DEFAULT hover:bg-purple-DEFAULT/90"
                          }
                        >
                          {quiz.difficultyLevel}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-magenta-DEFAULT/50 text-magenta-DEFAULT"
                        >
                          {quiz?.ageGroup || "All Ages"}
                        </Badge>
                      </div>
                      <CardTitle className="text-left text-lg mt-2 line-clamp-2">
                        {quiz.title}
                      </CardTitle>
                      <p className="text-left text-sm text-muted-foreground">
                        {quiz.topicName} • {quiz.subtopicName}
                      </p>
                    </CardHeader>

                    <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {quiz.timeLimit} Min
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {quiz?.participants || "20"}{" "}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="mt-6">
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <Link to={`/quizzes/${quiz.id}`} key={quiz.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-32 sm:h-auto overflow-hidden">
                        <img
                          src={"./src/assets/image.png"}
                          alt={quiz.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant={
                              quiz.difficultyLevel === "EASY"
                                ? "outline"
                                : quiz.difficultyLevel === "MEDIUM"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              quiz.difficultyLevel === "EASY"
                                ? "border-yellow-DEFAULT text-yellow-DEFAULT"
                                : quiz.difficultyLevel === "MEDIUM"
                                ? "bg-orange-DEFAULT hover:bg-orange-DEFAULT/90"
                                : "bg-purple-DEFAULT hover:bg-purple-DEFAULT/90"
                            }
                          >
                            {quiz.difficultyLevel}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-magenta-DEFAULT/50 text-magenta-DEFAULT"
                          >
                            {quiz?.ageGroup || "All Ages"}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {quiz.topicName} • {quiz.subtopicName}
                        </p>
                        <div className="mt-auto flex justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {quiz.timeLimit} Min
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {quiz?.participants || "20"} participants
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Quizzes;
