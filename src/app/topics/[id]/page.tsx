import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for a specific topic and its subtopics
const topicData = {
  id: 2,
  name: "Science",
  description:
    "Explore the wonders of science through our interactive quizzes covering various scientific disciplines.",
  quizCount: 38,
  subtopics: [
    {
      id: 1,
      name: "Biology",
      description:
        "Learn about living organisms, their structure, function, growth, and evolution.",
      quizCount: 12,
      quizzes: [
        {
          id: 101,
          title: "Human Body Systems",
          difficulty: "Medium",
          questions: 15,
          timeLimit: "20 min",
          participants: 723,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 102,
          title: "Cell Structure and Function",
          difficulty: "Hard",
          questions: 12,
          timeLimit: "18 min",
          participants: 542,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 103,
          title: "Plants and Photosynthesis",
          difficulty: "Easy",
          questions: 10,
          timeLimit: "15 min",
          participants: 631,
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    {
      id: 2,
      name: "Chemistry",
      description:
        "Discover the composition, structure, properties, and changes of matter.",
      quizCount: 10,
      quizzes: [
        {
          id: 201,
          title: "Periodic Table Elements",
          difficulty: "Medium",
          questions: 20,
          timeLimit: "25 min",
          participants: 489,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 202,
          title: "Chemical Reactions",
          difficulty: "Hard",
          questions: 15,
          timeLimit: "20 min",
          participants: 356,
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    {
      id: 3,
      name: "Physics",
      description: "Study the nature and properties of matter and energy.",
      quizCount: 8,
      quizzes: [
        {
          id: 301,
          title: "Forces and Motion",
          difficulty: "Medium",
          questions: 12,
          timeLimit: "18 min",
          participants: 412,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 302,
          title: "Electricity and Magnetism",
          difficulty: "Hard",
          questions: 15,
          timeLimit: "22 min",
          participants: 287,
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    {
      id: 4,
      name: "Astronomy",
      description:
        "Explore the universe, celestial objects, and phenomena beyond Earth's atmosphere.",
      quizCount: 8,
      quizzes: [
        {
          id: 401,
          title: "The Solar System",
          difficulty: "Medium",
          questions: 15,
          timeLimit: "20 min",
          participants: 987,
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 402,
          title: "Stars and Galaxies",
          difficulty: "Hard",
          questions: 12,
          timeLimit: "18 min",
          participants: 432,
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
  ],
};

export default function TopicPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link
          to="/topics"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Topics
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {topicData.name}
          </h1>
          <p className="text-muted-foreground">{topicData.description}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link to={`/topics/${topicData.id}/create-subtopic`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subtopic
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/quizzes/create?topic=${topicData.id}`}>
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {topicData.subtopics.map((subtopic) => (
          <div key={subtopic.id} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h2 className="text-2xl font-bold">{subtopic.name}</h2>
                <p className="text-muted-foreground">{subtopic.description}</p>
              </div>
              <Badge variant="outline" className="text-sm">
                {subtopic.quizCount} Quizzes
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subtopic.quizzes.map((quiz) => (
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
                              ? "success"
                              : quiz.difficulty === "Medium"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {quiz.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">
                        {quiz.title}
                      </CardTitle>
                    </CardHeader>
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

              <Link
                to={`/quizzes/create?topic=${topicData.id}&subtopic=${subtopic.id}`}
              >
                <Card className="h-full border-dashed hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-muted mb-4">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">Create New Quiz</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add a new quiz to {subtopic.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
