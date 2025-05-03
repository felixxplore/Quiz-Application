import React, { useState, useEffect } from "react";

interface Subtopic {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
  subtopics: Subtopic[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: any) => void;
  onCreateTopic?: () => void;
  onCreateSubtopic?: () => void;
  title: string;
  placeholder?: string;
  type: "topic" | "subtopic" | "quizInfo";
  topics?: Topic[];
  initialQuizInfo?: {
    title: string;
    description: string;
    difficultyLevel: "EASY" | "MEDIUM" | "HARD";
    timeLimit: number;
    topicId: number;
    subtopicId: number;
  };
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onCreateTopic,
  onCreateSubtopic,
  title,
  placeholder,
  type,
  topics = [],
  initialQuizInfo,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<number>(0);
  const [quizInfo, setQuizInfo] = useState<{
    title: string;
    description: string;
    difficultyLevel: "EASY" | "MEDIUM" | "HARD";
    timeLimit: number;
    topicId: number;
    subtopicId: number;
  }>({
    title: "",
    description: "",
    difficultyLevel: "EASY",
    timeLimit: 0,
    topicId: topics.length > 0 ? topics[0].id : 0,
    subtopicId: 0,
  });

  // Initialize form with existing quiz data when editing
  useEffect(() => {
    if (isOpen) {
      if (type === "quizInfo" && initialQuizInfo) {
        setQuizInfo(initialQuizInfo);
      } else if (type === "quizInfo") {
        setQuizInfo({
          title: "",
          description: "",
          difficultyLevel: "EASY",
          timeLimit: 0,
          topicId: topics.length > 0 ? topics[0].id : 0,
          subtopicId: 0,
        });
      } else {
        setInputValue("");
        setSelectedTopicId(topics.length > 0 ? topics[0].id : 0);
      }
    }
  }, [isOpen, type, topics, initialQuizInfo]);

  // Update subtopicId when topicId changes
  useEffect(() => {
    const selectedTopic = topics.find((topic) => topic.id === quizInfo.topicId);
    const validSubtopics = selectedTopic?.subtopics || [];
    if (validSubtopics.length > 0) {
      // If editing, try to retain the initial subtopicId if valid
      const currentSubtopicId =
        initialQuizInfo?.subtopicId &&
        validSubtopics.some((s) => s.id === initialQuizInfo.subtopicId)
          ? initialQuizInfo.subtopicId
          : validSubtopics[0].id;
      setQuizInfo((prev) => ({
        ...prev,
        subtopicId: currentSubtopicId,
      }));
    } else {
      setQuizInfo((prev) => ({
        ...prev,
        subtopicId: 0,
      }));
    }
  }, [quizInfo.topicId, topics, initialQuizInfo]);

  if (!isOpen) return null;

  const handleQuizInfoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setQuizInfo((prev) => ({
      ...prev,
      [name]:
        name === "topicId" || name === "subtopicId"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopicId(parseInt(e.target.value) || 0);
  };

  const handleSave = () => {
    if (type === "quizInfo") {
      onSave(quizInfo);
      setQuizInfo({
        title: "",
        description: "",
        difficultyLevel: "EASY",
        timeLimit: 0,
        topicId: topics.length > 0 ? topics[0].id : 0,
        subtopicId: 0,
      });
    } else if (type === "subtopic") {
      onSave({ name: inputValue, topicId: selectedTopicId });
      setInputValue("");
      setSelectedTopicId(topics.length > 0 ? topics[0].id : 0);
    } else {
      onSave(inputValue);
      setInputValue("");
    }
  };

  const selectedTopic = topics.find((topic) => topic.id === quizInfo.topicId);
  const subtopics = selectedTopic?.subtopics || [];
  const isSubtopicSaveDisabled =
    type === "subtopic" && (!inputValue.trim() || selectedTopicId === 0);
  const isQuizInfoSaveDisabled =
    type === "quizInfo" &&
    (!quizInfo.title.trim() ||
      quizInfo.topicId === 0 ||
      (subtopics.length > 0 && quizInfo.subtopicId === 0));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {type === "quizInfo" ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Quiz Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={quizInfo.title}
                onChange={handleQuizInfoChange}
                placeholder="Enter quiz title"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={quizInfo.description}
                onChange={handleQuizInfoChange}
                placeholder="Enter quiz description (optional)"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="difficultyLevel"
                className="block text-sm font-medium text-gray-700"
              >
                Difficulty Level
              </label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={quizInfo.difficultyLevel}
                onChange={handleQuizInfoChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="timeLimit"
                className="block text-sm font-medium text-gray-700"
              >
                Time Limit (minutes)
              </label>
              <input
                id="timeLimit"
                type="number"
                name="timeLimit"
                value={quizInfo.timeLimit}
                onChange={handleQuizInfoChange}
                placeholder="Enter time limit (optional)"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="topicId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Topic
                </label>
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={onCreateTopic}
                >
                  Create New Topic
                </button>
              </div>
              <select
                id="topicId"
                name="topicId"
                value={quizInfo.topicId}
                onChange={handleQuizInfoChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                {topics.length > 0 ? (
                  topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))
                ) : (
                  <option value={0}>No topics available</option>
                )}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="subtopicId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subtopic
                </label>
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={onCreateSubtopic}
                >
                  Create New Subtopic
                </button>
              </div>
              <select
                id="subtopicId"
                name="subtopicId"
                value={quizInfo.subtopicId}
                onChange={handleQuizInfoChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                {subtopics.length > 0 ? (
                  subtopics.map((subtopic) => (
                    <option key={subtopic.id} value={subtopic.id}>
                      {subtopic.name}
                    </option>
                  ))
                ) : (
                  <option value={0}>No subtopics available</option>
                )}
              </select>
            </div>
          </div>
        ) : type === "subtopic" ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="topicId"
                className="block text-sm font-medium text-gray-700"
              >
                Topic
              </label>
              <select
                id="topicId"
                name="topicId"
                value={selectedTopicId}
                onChange={handleTopicChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                {topics.length > 0 ? (
                  topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))
                ) : (
                  <option value={0}>No topics available</option>
                )}
              </select>
            </div>
            <div>
              <label
                htmlFor="input"
                className="block text-sm font-medium text-gray-700"
              >
                Subtopic Name
              </label>
              <input
                id="input"
                type="text"
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="input"
              className="block text-sm font-medium text-gray-700"
            >
              Topic Name
            </label>
            <input
              id="input"
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              placeholder={placeholder}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${
              isSubtopicSaveDisabled || isQuizInfoSaveDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleSave}
            disabled={isSubtopicSaveDisabled || isQuizInfoSaveDisabled}
          >
            {type === "quizInfo" ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
