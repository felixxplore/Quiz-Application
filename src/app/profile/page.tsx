"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  BarChart3,
  BookOpen,
  Edit,
  GraduationCap,
  History,
  Star,
  Trophy,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock components for the profile page
const Calculator = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="8" x2="8" y1="12" y2="12" />
    <line x1="12" x2="12" y1="12" y2="12" />
    <line x1="16" x2="16" y1="12" y2="12" />
    <line x1="8" x2="8" y1="16" y2="16" />
    <line x1="12" x2="12" y1="16" y2="16" />
    <line x1="16" x2="16" y1="16" y2="16" />
  </svg>
);

const Microscope = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0 0-14h-1" />
    <path d="M9 14h2" />
    <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
    <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
  </svg>
);

// Mock user data
const userData = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  age: "13-18",
  joinDate: "January 15, 2023",
  avatar: "/placeholder.svg?height=100&width=100",
  stats: {
    quizzesTaken: 42,
    averageScore: 78,
    topicsExplored: 8,
    totalQuestions: 420,
    correctAnswers: 328,
    streakDays: 7,
  },
  badges: [
    {
      id: 1,
      name: "Math Whiz",
      icon: <Calculator className="h-4 w-4" />,
      date: "Mar 12, 2023",
    },
    {
      id: 2,
      name: "Science Explorer",
      icon: <Microscope className="h-4 w-4" />,
      date: "Apr 5, 2023",
    },
    {
      id: 3,
      name: "History Buff",
      icon: <BookOpen className="h-4 w-4" />,
      date: "May 20, 2023",
    },
    {
      id: 4,
      name: "Quiz Master",
      icon: <Award className="h-4 w-4" />,
      date: "Jun 15, 2023",
    },
  ],
  recentQuizzes: [
    {
      id: 1,
      title: "Math Basics: Addition & Subtraction",
      date: "May 10, 2023",
      score: 90,
      total: 100,
      topic: "Mathematics",
    },
    {
      id: 2,
      title: "Science: The Solar System",
      date: "May 8, 2023",
      score: 85,
      total: 100,
      topic: "Science",
    },
    {
      id: 3,
      title: "History: Ancient Civilizations",
      date: "May 5, 2023",
      score: 75,
      total: 100,
      topic: "History",
    },
    {
      id: 4,
      title: "English Grammar: Parts of Speech",
      date: "May 1, 2023",
      score: 80,
      total: 100,
      topic: "English",
    },
    {
      id: 5,
      title: "Geography: World Capitals",
      date: "Apr 28, 2023",
      score: 70,
      total: 100,
      topic: "Geography",
    },
  ],
  topicPerformance: [
    { topic: "Mathematics", quizzes: 12, averageScore: 85 },
    { topic: "Science", quizzes: 10, averageScore: 78 },
    { topic: "History", quizzes: 8, averageScore: 72 },
    { topic: "English", quizzes: 7, averageScore: 80 },
    { topic: "Geography", quizzes: 5, averageScore: 68 },
  ],
};

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">
            View your quiz history, achievements, and statistics
          </p>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={userData.avatar || "/placeholder.svg"}
                  alt={userData.name}
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{userData.name}</CardTitle>
                <CardDescription>{userData.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Age Group</p>
                  <p className="font-medium">{userData.age}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{userData.joinDate}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="mr-1 h-3 w-3" />
                      Quizzes Taken
                    </div>
                    <p className="font-medium">{userData.stats.quizzesTaken}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BarChart3 className="mr-1 h-3 w-3" />
                      Avg. Score
                    </div>
                    <p className="font-medium">
                      {userData.stats.averageScore}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GraduationCap className="mr-1 h-3 w-3" />
                      Topics Explored
                    </div>
                    <p className="font-medium">
                      {userData.stats.topicsExplored}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Trophy className="mr-1 h-3 w-3" />
                      Streak
                    </div>
                    <p className="font-medium">
                      {userData.stats.streakDays} days
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Badges Earned</h3>
                <div className="grid grid-cols-2 gap-3">
                  {userData.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center p-2 border rounded-md text-center"
                    >
                      <div className="p-2 rounded-full bg-purple-DEFAULT/10 mb-2">
                        {badge.icon}
                      </div>
                      <p className="text-xs font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {badge.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="history">
                <History className="mr-2 h-4 w-4" />
                Quiz History
              </TabsTrigger>
              <TabsTrigger value="performance">
                <BarChart3 className="mr-2 h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Award className="mr-2 h-4 w-4" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Quiz Submissions</CardTitle>
                  <CardDescription>
                    Your most recent quiz attempts and scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quiz</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userData.recentQuizzes.map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell className="font-medium">
                            {quiz.title}
                          </TableCell>
                          <TableCell>{quiz.topic}</TableCell>
                          <TableCell>{quiz.date}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                quiz.score >= 80
                                  ? "text-green-500"
                                  : quiz.score >= 60
                                  ? "text-amber-500"
                                  : "text-red-500"
                              }
                            >
                              {quiz.score}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full">
                View All Quiz History
              </Button>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Performance</CardTitle>
                  <CardDescription>
                    Your quiz performance across different topics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Questions Answered</span>
                      <span className="font-medium">
                        {userData.stats.totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Correct Answers</span>
                      <span className="font-medium">
                        {userData.stats.correctAnswers} (
                        {Math.round(
                          (userData.stats.correctAnswers /
                            userData.stats.totalQuestions) *
                            100
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={
                        (userData.stats.correctAnswers /
                          userData.stats.totalQuestions) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-4">Topic Performance</h3>
                    <div className="space-y-4">
                      {userData.topicPerformance.map((topic, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="font-medium">{topic.topic}</span>
                              <Badge variant="outline" className="ml-2">
                                {topic.quizzes} quizzes
                              </Badge>
                            </div>
                            <span
                              className={
                                topic.averageScore >= 80
                                  ? "text-magenta-DEFAULT"
                                  : topic.averageScore >= 60
                                  ? "text-orange-DEFAULT"
                                  : "text-red-500"
                              }
                            >
                              {topic.averageScore}%
                            </span>
                          </div>
                          <Progress
                            value={topic.averageScore}
                            className="h-2"
                            indicatorColor={
                              topic.averageScore >= 80                                                                                                                             
                                ? "bg-magenta-DEFAULT"
                                : topic.averageScore >= 60
                                ? "bg-orange-DEFAULT"
                                : "bg-red-500"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>
                    Badges and rewards you've earned through your learning
                    journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userData.badges.map((badge) => (
                      <Card
                        key={badge.id}
                        className="border-2 border-primary/10"
                      >
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                          <div className="p-3 rounded-full bg-primary/10">
                            {badge.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{badge.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              Earned on {badge.date}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Locked badges */}
                    <Card className="border border-dashed opacity-60">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                        <div className="p-3 rounded-full bg-muted">
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">Geography Pro</h3>
                          <p className="text-xs text-muted-foreground">
                            Complete 10 geography quizzes
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-dashed opacity-60">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                        <div className="p-3 rounded-full bg-muted">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">Perfect Score</h3>
                          <p className="text-xs text-muted-foreground">
                            Get 100% on any quiz
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
