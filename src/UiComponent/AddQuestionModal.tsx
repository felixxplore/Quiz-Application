import React, { useState, useEffect } from 'react';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: { text: string; options: string[]; correctAnswer: number }) => void;
  quizId: number;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ isOpen, onClose, onSave, quizId }) => {
  const [question, setQuestion] = useState<{
    text: string;
    options: string[];
    correctAnswer: number;
  }>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: -1,
  });

  useEffect(() => {
    if (isOpen) {
      setQuestion({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: -1,
      });
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === 'option' && index !== undefined) {
      const newOptions = [...question.options];
      newOptions[index] = value;
      setQuestion({ ...question, options: newOptions });
    } else if (name === 'correctAnswer') {
      setQuestion({ ...question, correctAnswer: parseInt(value) });
    } else {
      setQuestion({ ...question, [name]: value });
    }
  };

  const handleSave = () => {
    onSave({
      text: question.text,
      options: question.options,
      correctAnswer: question.correctAnswer,
    });
    onClose();
  };

  const isSaveDisabled =
    !question.text.trim() ||
    question.options.some((opt) => !opt.trim()) ||
    question.correctAnswer < 0 ||
    question.correctAnswer > 3;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Question to Quiz #{quizId}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Question Text
            </label>
            <textarea
              id="text"
              name="text"
              value={question.text}
              onChange={handleChange}
              placeholder="Enter question text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              rows={4}
            />
          </div>
          {question.options.map((option, index) => (
            <div key={index}>
              <label htmlFor={`option-${index}`} className="block text-sm font-medium text-gray-700">
                Option {index + 1}
              </label>
              <input
                id={`option-${index}`}
                type="text"
                name="option"
                value={option}
                onChange={(e) => handleChange(e, index)}
                placeholder={`Enter option ${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
          ))}
          <div>
            <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700">
              Correct Answer
            </label>
            <select
              id="correctAnswer"
              name="correctAnswer"
              value={question.correctAnswer}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value={-1}>Select correct answer</option>
              {question.options.map((_, index) => (
                <option key={index} value={index}>
                  Option {index + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${
              isSaveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;