import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

type Quiz = {
  id: number;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: number;
  timeLimit: string;
  participants: number;
  ageGroup: string;
  image: string;
};

const featuredQuizzes: Quiz[] = [
  {
    id: 1,
    title: "Math Basics: Addition & Subtraction",
    topic: "Mathematics",
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
    difficulty: "Hard",
    questions: 20,
    timeLimit: "30 min",
    participants: 543,
    ageGroup: "16-30",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export function FeaturedQuizzes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {featuredQuizzes.map((quiz) => (
        <Link to={`/quizzes/${quiz.id}`} key={quiz.id} className="group">
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
              <CardTitle className="text-lg mt-2">{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">{quiz.topic}</p>
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
  );
}
