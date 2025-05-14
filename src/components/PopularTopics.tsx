import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  Microscope,
  BookOpen,
  Globe,
  Code,
  Music,
  Palette,
  Brain,
} from "lucide-react";
import type { JSX } from "react";

type Topic = {
  id: number;
  name: string;
  icon: JSX.Element;
  color: string;
  iconColor: string;
  quizCount: number;
};

const popularTopics: Topic[] = [
  {
    id: 1,
    name: "Mathematics",
    icon: <Calculator className="h-8 w-8" />,
    color: "bg-purple-DEFAULT/10",
    iconColor: "text-purple-DEFAULT",
    quizCount: 45,
  },
  {
    id: 2,
    name: "Science",
    icon: <Microscope className="h-8 w-8" />,
    color: "bg-magenta-DEFAULT/10",
    iconColor: "text-magenta-DEFAULT",
    quizCount: 38,
  },
  {
    id: 3,
    name: "History",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-orange-DEFAULT/10",
    iconColor: "text-orange-DEFAULT",
    quizCount: 32,
  },
  {
    id: 4,
    name: "Geography",
    icon: <Globe className="h-8 w-8" />,
    color: "bg-yellow-DEFAULT/10",
    iconColor: "text-yellow-DEFAULT",
    quizCount: 27,
  },
  {
    id: 5,
    name: "Programming",
    icon: <Code className="h-8 w-8" />,
    color: "bg-purple-DEFAULT/10",
    iconColor: "text-purple-DEFAULT",
    quizCount: 23,
  },
  {
    id: 6,
    name: "Music",
    icon: <Music className="h-8 w-8" />,
    color: "bg-magenta-DEFAULT/10",
    iconColor: "text-magenta-DEFAULT",
    quizCount: 19,
  },
  {
    id: 7,
    name: "Art",
    icon: <Palette className="h-8 w-8" />,
    color: "bg-orange-DEFAULT/10",
    iconColor: "text-orange-DEFAULT",
    quizCount: 15,
  },
  {
    id: 8,
    name: "Logic & Puzzles",
    icon: <Brain className="h-8 w-8" />,
    color: "bg-yellow-DEFAULT/10",
    iconColor: "text-yellow-DEFAULT",
    quizCount: 21,
  },
];

export function PopularTopics() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {popularTopics.map((topic) => (
        <Link to={`/topics/${topic.id}`} key={topic.id}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-full ${topic.color}`}>
                <div className={topic.iconColor}>{topic.icon}</div>
              </div>
              <div>
                <h3 className="font-medium">{topic.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {topic.quizCount} Quizzes
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
