import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle, XCircle } from 'lucide-react';

const QuizView = ({ lesson, onQuizComplete, onIncorrectAnswer, lives, quizTitle }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setScore(0);
    }, [lesson]);

    const question = lesson.quiz[currentQuestionIndex];

    const handleAnswer = (answer) => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);
        const correct = answer === question.correctAnswer;
        setIsCorrect(correct);
        if (correct) {
            setScore(s => s + 1);
        } else {
            onIncorrectAnswer();
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        if (currentQuestionIndex < lesson.quiz.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
        } else {
            onQuizComplete(score + (isCorrect ? 1 : 0), lesson.quiz.length);
        }
    };

    const getButtonClass = (option) => {
        if (!selectedAnswer) return 'bg-gray-700 hover:bg-gray-600';
        if (option === question.correctAnswer) return 'bg-green-500 scale-105';
        if (option === selectedAnswer && !isCorrect) return 'bg-red-500';
        return 'bg-gray-700 opacity-50';
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-yellow-500/30 animate-fade-in relative">
            <div className="absolute top-4 right-4 flex items-center space-x-1">
                {[...Array(lives)].map((_, i) => <Heart key={i} className="text-red-500 fill-current" />)}
                {[...Array(3 - lives)].map((_, i) => <Heart key={i} className="text-gray-600" />)}
            </div>
            <h3 className="text-xl font-semibold text-yellow-300 mb-1">{quizTitle}: {lesson.title}</h3>
            <p className="text-gray-400 mb-4">Pregunta {currentQuestionIndex + 1} de {lesson.quiz.length}</p>
            <div className="bg-gray-900 p-4 rounded-lg mb-4"><p className="text-lg text-white">{question.question}</p></div>
            <div className="space-y-3 mb-6">
                {question.options.map((option) => (
                    <button key={option} onClick={() => handleAnswer(option)} disabled={!!selectedAnswer} className={`w-full text-left p-3 rounded-lg transition duration-200 ${getButtonClass(option)}`}>
                        {option}
                    </button>
                ))}
            </div>
            {selectedAnswer && (
                <div className="p-4 rounded-lg text-center" style={{backgroundColor: isCorrect ? 'rgba(44, 187, 99, 0.2)' : 'rgba(239, 68, 68, 0.2)'}}>
                    <div className="flex items-center justify-center">
                        {isCorrect ? <CheckCircle className="text-green-400 mr-2"/> : <XCircle className="text-red-400 mr-2"/>}
                        <h4 className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</h4>
                    </div>
                    {!isCorrect && <p className="text-gray-300 mt-1">La respuesta correcta era: <span className="font-bold">{question.correctAnswer}</span></p>}
                    <button onClick={handleNext} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        {currentQuestionIndex < lesson.quiz.length - 1 ? 'Siguiente Pregunta' : 'Finalizar'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizView;