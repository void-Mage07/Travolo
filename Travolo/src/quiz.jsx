import { useState } from "react";
import "./quiz.css";

const questions = [
  {
    question: "Which city is the Amer Fort located in?",
    options: [
      "Jaipur",
      "Jodhpur",
      "Udaipur",
      "Bikaner",
    ],
    answer: 0,
  },
  {
    question: "What is the Sheesh Mahal famous for?",
    options: [
      "Its underground tunnels",
      "Its mirror and glass decorations",
      "Its huge elephant statues",
      "Its royal gardens",
    ],
    answer: 1,
  },
];

export default function Quiz({ onBack, onEarnXP, onComplete  }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswer = (index) => {
    if (selected !== null) return;

    setSelected(index);

    if (index === question.answer) {
      setScore((prev) => prev + 1);
      onEarnXP(100);
    }
  };

  const nextQuestion = () => {
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion((prev) => prev + 1);
    setSelected(null);
  } else {
    setFinished(true);
    onComplete?.();
  }
};

  if (finished) {
    return (
      <div className="quiz-page">
        <div className="quiz-card result-card">
          <div className="quiz-trophy">🏆</div>

          <h1>Quiz Complete!</h1>

          <p className="quiz-score">
            You scored <strong>{score}</strong> / {questions.length}
          </p>

          {score === 2 ? (
            <p className="quiz-message">
              Amazing! You are becoming an Amer Fort Explorer! 🏰
            </p>
          ) : score === 1 ? (
            <p className="quiz-message">
              Good job! Keep exploring to learn more! 🌟
            </p>
          ) : (
            <p className="quiz-message">
              Keep exploring the fort and try again! 🗺️
            </p>
          )}

          <div className="xp-earned">
            ⭐ +{score * 100} XP
          </div>

          <button className="quiz-back-button" onClick={onBack}>
            🗺️ Back to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-card">

        <button className="quiz-close" onClick={onBack}>
          ×
        </button>

        <div className="quiz-header">
          <span className="quiz-robot">🤖</span>

          <div>
            <h1>Test Your Knowledge!</h1>
            <p>Answer correctly to earn XP</p>
          </div>
        </div>

        <div className="quiz-progress">
          <div>
            Question {currentQuestion + 1} of {questions.length}
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="question-section">
          <h2>{question.question}</h2>

          <div className="options">
            {question.options.map((option, index) => {
              let optionClass = "quiz-option";

              if (selected !== null) {
                if (index === question.answer) {
                  optionClass += " correct";
                } else if (index === selected) {
                  optionClass += " wrong";
                }
              }

              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => handleAnswer(index)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>{option}</span>

                  {selected !== null && index === question.answer && (
                    <span className="answer-icon">✓</span>
                  )}

                  {selected === index && index !== question.answer && (
                    <span className="answer-icon">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selected !== null && (
          <div className="quiz-bottom">
            {selected === question.answer ? (
              <p className="correct-message">
                🎉 Correct! You earned <strong>100 XP</strong>!
              </p>
            ) : (
              <p className="wrong-message">
                💡 Not quite! The correct answer is highlighted above.
              </p>
            )}

            <button className="next-button" onClick={nextQuestion}>
              {currentQuestion === questions.length - 1
                ? "Finish Quiz 🏆"
                : "Next Question ➜"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}