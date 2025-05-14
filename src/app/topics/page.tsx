import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Calculator,
  Microscope,
  BookOpen,
  Globe,
  Code,
  Music,
  Palette,
  Brain,
  Languages,
  Dumbbell,
  Utensils,
  Leaf,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for topics
const topics = [
  {
    id: 1,
    name: "Mathematics",
    icon: <Calculator className="h-8 w-8" />,
    color: "bg-purple-DEFAULT/10",
    iconColor: "text-purple-DEFAULT",
    quizCount: 45,
    subtopics: ["Arithmetic", "Algebra", "Geometry", "Statistics"],
  },
  {
    id: 2,
    name: "Science",
    icon: <Microscope className="h-8 w-8" />,
    color: "bg-magenta-DEFAULT/10",
    iconColor: "text-magenta-DEFAULT",
    quizCount: 38,
    subtopics: ["Biology", "Chemistry", "Physics", "Astronomy"],
  },
  {
    id: 3,
    name: "History",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-orange-DEFAULT/10",
    iconColor: "text-orange-DEFAULT",
    quizCount: 32,
    subtopics: [
      "Ancient History",
      "Medieval History",
      "Modern History",
      "World Wars",
    ],
  },
  {
    id: 4,
    name: "Geography",
    icon: <Globe className="h-8 w-8" />,
    color: "bg-yellow-DEFAULT/10",
    iconColor: "text-yellow-DEFAULT",
    quizCount: 27,
    subtopics: [
      "Physical Geography",
      "Human Geography",
      "World Geography",
      "Map Skills",
    ],
  },
  {
    id: 5,
    name: "Programming",
    icon: <Code className="h-8 w-8" />,
    color: "bg-purple-DEFAULT/10",
    iconColor: "text-purple-DEFAULT",
    quizCount: 23,
    subtopics: ["Web Development", "Python", "JavaScript", "Data Structures"],
  },
  {
    id: 6,
    name: "Music",
    icon: <Music className="h-8 w-8" />,
    color: "bg-magenta-DEFAULT/10",
    iconColor: "text-magenta-DEFAULT",
    quizCount: 19,
    subtopics: [
      "Music Theory",
      "Instruments",
      "Music History",
      "Famous Composers",
    ],
  },
  {
    id: 7,
    name: "Art",
    icon: <Palette className="h-8 w-8" />,
    color: "bg-orange-DEFAULT/10",
    iconColor: "text-orange-DEFAULT",
    quizCount: 15,
    subtopics: ["Art History", "Drawing", "Painting", "Famous Artists"],
  },
  {
    id: 8,
    name: "Logic & Puzzles",
    icon: <Brain className="h-8 w-8" />,
    color: "bg-yellow-DEFAULT/10",
    iconColor: "text-yellow-DEFAULT",
    quizCount: 21,
    subtopics: [
      "Riddles",
      "Logic Puzzles",
      "Brain Teasers",
      "Critical Thinking",
    ],
  },
  {
    id: 9,
    name: "Languages",
    icon: <Languages className="h-8 w-8" />,
    color: "bg-purple-DEFAULT/10",
    iconColor: "text-purple-DEFAULT",
    quizCount: 18,
    subtopics: ["English", "Spanish", "French", "Vocabulary"],
  },
  {
    id: 10,
    name: "Physical Education",
    icon: <Dumbbell className="h-8 w-8" />,
    color: "bg-magenta-DEFAULT/10",
    iconColor: "text-magenta-DEFAULT",
    quizCount: 12,
    subtopics: ["Sports", "Fitness", "Health", "Nutrition"],
  },
  {
    id: 11,
    name: "Cooking",
    icon: <Utensils className="h-8 w-8" />,
    color: "bg-orange-DEFAULT/10",
    iconColor: "text-orange-DEFAULT",
    quizCount: 10,
    subtopics: ["Recipes", "Baking", "Culinary Techniques", "World Cuisine"],
  },
  {
    id: 12,
    name: "Environmental Science",
    icon: <Leaf className="h-8 w-8" />,
    color: "bg-yellow-DEFAULT/10",
    iconColor: "text-yellow-DEFAULT",
    quizCount: 14,
    subtopics: ["Ecology", "Climate Change", "Conservation", "Sustainability"],
  },
];

export default function TopicsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
          <p className="text-muted-foreground">
            Browse our collection of learning topics and subtopics
          </p>
        </div>
        <Button asChild>
          <Link to="/topics/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Topic
          </Link>
        </Button>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search topics..." className="pl-8" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topics.map((topic) => (
          <Link to={`/topics/${topic.id}`} key={topic.id}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${topic.color}`}>
                    <div className={topic.iconColor}>{topic.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{topic.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {topic.quizCount} Quizzes
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Subtopics:</p>
                  <div className="flex flex-wrap gap-1">
                    {topic.subtopics.map((subtopic, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs rounded-full bg-muted"
                      >
                        {subtopic}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
