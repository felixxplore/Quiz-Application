import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchTopics } from "@/store/quizSlice";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TopicDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const { topicId } = useParams<{ topicId: string }>();

  useEffect(() => {
    if (topics.length === 0) {
      dispatch(fetchTopics());
    }
  }, [dispatch, topics]);

  const topic = topics.find((t) => t.id === Number(topicId));

  if (loading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8">Error: {error}</div>;
  if (!topic) return <div className="container py-8">Topic not found.</div>;

  return (
    <div className="container py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Button
          asChild
          variant="outline"
          className="hover:bg-blue-50 transition-colors duration-200"
        >
          <Link to="/topics">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Link>
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">
              {topic.name}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {topic.subtopics.length} Subtopics
            </p>
          </CardHeader>
          <CardContent>
            {topic.subtopics.length === 0 ? (
              <p className="text-gray-600">No subtopics available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {topic.subtopics.map((subtopic, index) => (
                    <motion.div
                      key={subtopic.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <CardContent className="p-4 flex items-center gap-3">
                          <BookOpen className="h-6 w-6 text-blue-500" />
                          <p className="text-gray-800 font-medium">
                            {subtopic.name}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TopicDetail;
