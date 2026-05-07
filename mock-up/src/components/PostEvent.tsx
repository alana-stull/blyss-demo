import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, Check } from 'lucide-react';

const questions = [
  {
    id: '1',
    question: 'How was the experience?',
    type: 'rating' as const,
  },
  {
    id: '2',
    question: 'Would you go again?',
    type: 'choice' as const,
    options: ['Definitely', 'Maybe', 'Not really'],
  },
  {
    id: '3',
    question: 'Any highlights you want to remember?',
    type: 'text' as const,
  },
];

export function PostEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const question = questions[currentQuestion];

  const handleRatingChange = (rating: number) => {
    setAnswers({ ...answers, [question.id]: rating });
  };

  const handleChoiceChange = (choice: string) => {
    setAnswers({ ...answers, [question.id]: choice });
  };

  const handleTextChange = (text: string) => {
    setAnswers({ ...answers, [question.id]: text });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowConfirmation(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  const canProceed = () => {
    return answers[question.id] !== undefined && answers[question.id] !== '';
  };

  if (showConfirmation) {
    return (
      <div className="min-h-full bg-background flex flex-col items-center justify-center px-5 pb-20">
        <div className="w-16 h-16 rounded-full bg-[#5ba8d3] flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2">Thanks for sharing!</h2>
        <p className="text-[#8b8f94] text-center">
          Your reflection has been saved to your event journal
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </button>
          <h1 className="flex-1">Reflect on your event</h1>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1.5">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentQuestion ? 'bg-[#5ba8d3]' : 'bg-[#e3e4e6]'
              }`}
            />
          ))}
        </div>
      </header>

      <div className="px-5 pt-8">
        {/* Event context */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-[#b7d3e0] text-[#375169] rounded-full text-sm mb-3">
            Modern Art Gallery Opening
          </span>
          <p className="text-sm text-[#8b8f94]">Sat, Feb 8 · 7:00 PM</p>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="mb-6">{question.question}</h2>

          {/* Rating input */}
          {question.type === 'rating' && (
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className="p-2 transition-transform active:scale-90"
                >
                  <Star
                    className={`w-10 h-10 ${
                      answers[question.id] >= rating
                        ? 'fill-[#f2c05a] text-[#f2c05a]'
                        : 'text-[#e3e4e6]'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Choice input */}
          {question.type === 'choice' && (
            <div className="space-y-3">
              {question.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleChoiceChange(option)}
                  className={`w-full p-4 rounded-xl border transition-all ${
                    answers[question.id] === option
                      ? 'border-[#5ba8d3] bg-[#5ba8d3]/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <span className="font-medium text-[#333333]">{option}</span>
                </button>
              ))}
            </div>
          )}

          {/* Text input */}
          {question.type === 'text' && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Share your thoughts..."
              rows={6}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30 resize-none"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="flex-1 py-3.5 bg-card border border-border text-[#333333] rounded-xl hover:bg-[#e3e4e6] transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 py-3.5 bg-[#5ba8d3] text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4a96c2] transition-colors"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
