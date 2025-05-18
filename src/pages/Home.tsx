// src/pages/Home.tsx (or wherever your route is defined)
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Award, TrendingUp } from "lucide-react";
import { FeaturedQuizzes } from "@/components/FeaturedQuizzes";
import { PopularTopics } from "@/components/PopularTopics";
import { useEffect, type FC } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/store/store";
import { fetchQuizzes } from "@/store/quizSlice";

const Home: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);
  return (
    <main className=" flex flex-col">
      {/* Hero Section */}
      <section className=" w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-DEFAULT/10 to-magenta-DEFAULT/5">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className=" space-y-2">
                <h1 className=" text-3xl text-left font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Learn, Play, Grow with QuizWiz
                </h1>
                <p className="text-left max-w-[600px] text-muted-foreground md:text-xl">
                  Discover fun and interactive quizzes for all ages. Challenge
                  yourself, learn new topics, and track your progress.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/quizzes">
                  <Button size="lg">Start a Quiz</Button>
                </Link>
                <Link to="/topics">
                  <Button
                    size="lg"
                    className="border-2 border-gray-600"
                    variant="outline"
                  >
                    Browse Topics
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative mr-10  w-full max-w-[500px] aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src="https://asset.cloudinary.com/dwdyrv73w/a4ae20b37dc003f323ee691a3f233d57"
                  alt="Students enjoying interactive quizzes"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Why Choose QuizWiz?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Our platform is designed to make learning fun and engaging for
                everyone.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Diverse Topics</h3>
                <p className="text-muted-foreground">
                  Explore a wide range of subjects from math and science to
                  history and arts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Age-Appropriate</h3>
                <p className="text-muted-foreground">
                  Content tailored for different age groups, from children to
                  young adults.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your learning journey with detailed performance
                  analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Quizzes Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <h2 className="text-3xl text-left font-bold tracking-tighter md:text-4xl">
                Featured Quizzes
              </h2>
              <p className="max-w-[700px] text-muted-foreground">
                Check out our most popular quizzes across different topics.
              </p>
            </div>
            <Link to="/quizzes">
              <Button variant="outline">View All Quizzes</Button>
            </Link>
          </div>
          <FeaturedQuizzes />
        </div>
      </section>

      {/* Popular Topics Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <h2 className="text-3xl text-left font-bold tracking-tighter md:text-4xl">
                Popular Topics
              </h2>
              <p className="max-w-[700px] text-muted-foreground">
                Explore our most popular learning categories.
              </p>
            </div>
            <Link to="/topics">
              <Button variant="outline">View All Topics</Button>
            </Link>
          </div>
          <PopularTopics />
        </div>
      </section>

      {/* CTA Section */}
      <section className=" w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-DEFAULT to-magenta-DEFAULT text-white">
        <div className="text-black container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Start Learning?
              </h2>
              <p className="max-w-[700px] md:text-xl">
                Join thousands of learners who are expanding their knowledge
                with QuizWiz.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/signup">
                <Button
                  size="lg"
                  variant="default"
                  className="bg-primary text-black hover:bg-yellow-DEFAULT/90"
                >
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/quizzes">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-600"
                >
                  Explore Quizzes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
