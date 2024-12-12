import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './quiz.css';

declare global {
  interface Window {
    styleQuizConfig: {
      baseUrl: string;
    }
  }
}

const styleRankings = [
  {
    title: "Comfy Casual",
    minScore: 0,
    maxScore: 20,
    description: "You prioritize comfort over everything else! While there's nothing wrong with being cozy, you might want to spice up your wardrobe a bit. Your go-to outfit is probably sweats and a hoodie. Remember: you can be both comfortable AND stylish! 💝",
    image: "/comfy-casual.webp"
  },
  {
    title: "Trendy Beginner",
    minScore: 21,
    maxScore: 40,
    description: "You're starting to experiment with fashion and following some trends! You're not afraid to try new things, but you're still finding your personal style. Keep exploring and don't be afraid to take more fashion risks! ✨",
    image: "/trendy-beginner.webp"
  },
  {
    title: "Style Enthusiast",
    minScore: 41,
    maxScore: 60,
    description: "You've got a good sense of style and know how to put together cute outfits! You follow trends while adding your own personal twist. You're not afraid to stand out, but you also know when to keep it simple. Work it! 💫",
    image: "/style-enthusiast.webp"
  },
  {
    title: "Fashion Icon",
    minScore: 61,
    maxScore: 80,
    description: "Your style game is seriously strong! You're always ahead of the trends and people often ask you for fashion advice. You could probably start your own fashion blog or Instagram account. You're basically the Regina George of fashion (but nicer)! 👑",
    image: "/fashion-icon.webp"
  },
  {
    title: "Style Goddess",
    minScore: 81,
    maxScore: 100,
    description: "OMG, are you secretly a celebrity stylist? Your fashion sense is absolutely incredible! You don't just follow trends - you SET them. Every day is your runway, and you never fail to serve looks. Anna Wintour would totally approve! 🌟",
    image: "/style-goddess.webp"
  }
];

const questions = [
  {
    question: "What's your go-to outfit for a casual day out?",
    options: [
      { text: "Sweats and a hoodie", score: 2 },
      { text: "Stylish dress with accessories", score: 10 },
      { text: "Jeans and a cute top", score: 6 },
      { text: "Trendy matching set", score: 8 }
    ]
  },
  {
    question: "How do you usually style your accessories?",
    options: [
      { text: "Carefully curated to complete each outfit", score: 10 },
      { text: "What accessories? 🤷‍♀️", score: 2 },
      { text: "Mix and match trendy pieces", score: 8 },
      { text: "Just the basics - watch and simple necklace", score: 5 }
    ]
  },
  {
    question: "Where's your favorite place to shop?",
    options: [
      { text: "Zara and Mango", score: 8 },
      { text: "Boutiques and designer stores", score: 10 },
      { text: "Wherever has the best deals", score: 4 },
      { text: "H&M and Forever 21", score: 6 }
    ]
  },
  {
    question: "How often do you try new fashion trends?",
    options: [
      { text: "Often - I love experimenting!", score: 8 },
      { text: "Never - I stick to what I know", score: 2 },
      { text: "I'm usually wearing trends before they're trends", score: 10 },
      { text: "Only when they're really popular", score: 5 }
    ]
  },
  {
    question: "What's your shoe collection like?",
    options: [
      { text: "An enviable collection of statement pieces", score: 10 },
      { text: "Just the essentials", score: 3 },
      { text: "Lots of trendy options", score: 8 },
      { text: "A few cute pairs for different occasions", score: 6 }
    ]
  },
  {
    question: "How do you prepare your outfits?",
    options: [
      { text: "Plan detailed outfits for the week", score: 8 },
      { text: "Maintain a carefully organized wardrobe system", score: 10 },
      { text: "Grab whatever's clean", score: 2 },
      { text: "Basic planning the night before", score: 5 }
    ]
  },
  {
    question: "What's your makeup routine like?",
    options: [
      { text: "Full face for most occasions", score: 8 },
      { text: "Quick and natural look", score: 6 },
      { text: "Always experimenting with new looks", score: 10 },
      { text: "Barely wear any", score: 3 }
    ]
  },
  {
    question: "How would your friends describe your style?",
    options: [
      { text: "Trendy and fun", score: 8 },
      { text: "Absolutely fabulous!", score: 10 },
      { text: "Nice and put-together", score: 6 },
      { text: "Practical and simple", score: 3 }
    ]
  },
  {
    question: "What's your hair styling routine?",
    options: [
      { text: "Different styles depending on the outfit", score: 8 },
      { text: "Brush and go", score: 2 },
      { text: "Full styling with heat tools and accessories", score: 10 },
      { text: "Basic styling - ponytail or bun", score: 5 }
    ]
  },
  {
    question: "How do you feel about color in your wardrobe?",
    options: [
      { text: "Love mixing different colors", score: 8 },
      { text: "Add a pop of color sometimes", score: 6 },
      { text: "Expert at color coordination and bold choices", score: 10 },
      { text: "Stick to neutrals only", score: 4 }
    ]
  }
];

const StyleImage = ({ src, alt, className }: { src: string, alt: string, className: string }) => (
  <img 
    src={`${window.styleQuizConfig.baseUrl}/wp-content/themes/your-theme/style-quiz/images${src}`}
    alt={alt}
    className={className}
  />
);

const StyleQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    return answers.reduce((total, answer, index) => {
      if (answer === -1) return total;
      return total + questions[index].options[answer].score;
    }, 0);
  };

  const getStyleRanking = (score: number) => {
    return styleRankings.find(ranking => 
      score >= ranking.minScore && score <= ranking.maxScore
    ) || styleRankings[0];
  };

  const canGoNext = answers[currentQuestion] !== -1;
  const canGoBack = currentQuestion > 0;

  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {!showResults ? (
          <>
            <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">
              How Stylish Are You? 💅
            </h1>
            <div className="mb-8">
              <div className="text-sm text-pink-400 mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <h2 className="text-xl font-semibold mb-6">
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 text-left rounded-lg transition-colors ${
                      answers[currentQuestion] === index
                        ? "bg-pink-500 text-white"
                        : "bg-pink-50 hover:bg-pink-100"
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                disabled={!canGoBack}
                className={`px-6 py-2 rounded-full ${
                  canGoBack
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (currentQuestion === questions.length - 1) {
                    setShowResults(true);
                  } else {
                    setCurrentQuestion(prev => prev + 1);
                  }
                }}
                disabled={!canGoNext}
                className={`px-6 py-2 rounded-full ${
                  canGoNext
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-pink-600 mb-4">
              Your Style Results! ✨
            </h1>
            <div className="text-6xl font-bold text-pink-500 mb-4">
              {calculateScore()}/100
            </div>
            <div className="mb-6">
              <StyleImage
                src={getStyleRanking(calculateScore())?.image || '/style-default.webp'}
                alt={getStyleRanking(calculateScore())?.title || 'Style Result'}
                className="mx-auto rounded-lg shadow-lg"
              />
            </div>
            <h2 className="text-2xl font-bold text-pink-600 mb-4">
              You are: {getStyleRanking(calculateScore())?.title}
            </h2>
            <p className="text-gray-600 mb-8">
              {getStyleRanking(calculateScore())?.description}
            </p>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers(new Array(questions.length).fill(-1));
              }}
              className="px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600"
            >
              Take Quiz Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('style-quiz-root');
  if (root) {
    ReactDOM.render(<StyleQuiz />, root);
  }
}); 