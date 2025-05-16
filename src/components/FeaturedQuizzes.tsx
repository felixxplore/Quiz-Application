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
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export function FeaturedQuizzes() {
  const { quizzes } = useSelector((state: RootState) => state.quiz);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {quizzes.map((quiz) => (
        <Link to={`/quizzes/${quiz.id}`} key={quiz.id} className="group">
          <Card className="rounded-xl  h-[400px] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <div className="w-full h-44 overflow-hidden">
              <img
                src={"./src/assets/image.png"}
                alt={quiz.title}
                className="w-full h-44 object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-center mb-0">
                <Badge
                  variant={
                    quiz.difficultyLevel === "EASY" ||
                    quiz.difficultyLevel === "MEDIUM"
                      ? "outline"
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
                  {quiz.ageGroup || "All Ages"}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold leading-tight text-left">
                {quiz.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-left text-muted-foreground">
              <p className="truncate">{quiz.topicName}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {quiz.timeLimit} Min
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-3 w-3" />
                {quiz.participants || "20"}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
