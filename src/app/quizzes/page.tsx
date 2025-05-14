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

// Mock data for quizzes
const quizzes = [
  {
    id: 1,
    title: "Math Basics: Addition & Subtraction",
    topic: "Mathematics",
    subtopic: "Arithmetic",
    difficulty: "Easy",
    questions: 10,
    timeLimit: "15 min",
    participants: 1245,
    ageGroup: "7-12",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Science: The Solar System",
    topic: "Science",
    subtopic: "Astronomy",
    difficulty: "Medium",
    questions: 15,
    timeLimit: "20 min",
    participants: 987,
    ageGroup: "10-15",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "History: Ancient Civilizations",
    topic: "History",
    subtopic: "Ancient History",
    difficulty: "Medium",
    questions: 12,
    timeLimit: "18 min",
    participants: 756,
    ageGroup: "13-18",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Coding Fundamentals: JavaScript",
    topic: "Programming",
    subtopic: "Web Development",
    difficulty: "Hard",
    questions: 20,
    timeLimit: "30 min",
    participants: 543,
    ageGroup: "16-30",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "English Grammar: Parts of Speech",
    topic: "English",
    subtopic: "Grammar",
    difficulty: "Easy",
    questions: 15,
    timeLimit: "20 min",
    participants: 892,
    ageGroup: "10-15",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Geography: World Capitals",
    topic: "Geography",
    subtopic: "World Geography",
    difficulty: "Medium",
    questions: 20,
    timeLimit: "25 min",
    participants: 678,
    ageGroup: "13-18",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 7,
    title: "Science: Human Body Systems",
    topic: "Science",
    subtopic: "Biology",
    difficulty: "Medium",
    questions: 15,
    timeLimit: "20 min",
    participants: 723,
    ageGroup: "13-18",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 8,
    title: "Math: Algebra Basics",
    topic: "Mathematics",
    subtopic: "Algebra",
    difficulty: "Hard",
    questions: 12,
    timeLimit: "25 min",
    participants: 456,
    ageGroup: "13-18",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export default function QuizzesPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
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
                        src={quiz.image || "/placeholder.svg"}
                        alt={quiz.title}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant={
                            quiz.difficulty === "Easy"
                              ? "outline"
                              : quiz.difficulty === "Medium"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            quiz.difficulty === "Easy"
                              ? "border-yellow-DEFAULT text-yellow-DEFAULT"
                              : quiz.difficulty === "Medium"
                              ? "bg-orange-DEFAULT hover:bg-orange-DEFAULT/90"
                              : "bg-purple-DEFAULT hover:bg-purple-DEFAULT/90"
                          }
                        >
                          {quiz.difficulty}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-magenta-DEFAULT/50 text-magenta-DEFAULT"
                        >
                          {quiz.ageGroup}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-2 line-clamp-2">
                        {quiz.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        {quiz.topic} • {quiz.subtopic}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {quiz.timeLimit}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {quiz.participants.toLocaleString()}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <Link to={`/quizzes/${quiz.id}`} key={quiz.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-32 sm:h-auto overflow-hidden">
                        <img
                          src={quiz.image || "/placeholder.svg"}
                          alt={quiz.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant={
                              quiz.difficulty === "Easy"
                                ? "outline"
                                : quiz.difficulty === "Medium"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              quiz.difficulty === "Easy"
                                ? "border-yellow-DEFAULT text-yellow-DEFAULT"
                                : quiz.difficulty === "Medium"
                                ? "bg-orange-DEFAULT hover:bg-orange-DEFAULT/90"
                                : "bg-purple-DEFAULT hover:bg-purple-DEFAULT/90"
                            }
                          >
                            {quiz.difficulty}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-magenta-DEFAULT/50 text-magenta-DEFAULT"
                          >
                            {quiz.ageGroup}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {quiz.topic} • {quiz.subtopic}
                        </p>
                        <div className="mt-auto flex justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {quiz.timeLimit}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {quiz.participants.toLocaleString()} participants
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
}
