import { useEffect } from "react";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";

import { fetchQuizzes } from "@/store/quizSlice";

const Quizzes: React.FC = () => {
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
      </div>

      <div className="grid gap-6">
        <Tabs defaultValue="grid" className="w-full">
          {/* Grid View */}
          <TabsContent value="grid">
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
