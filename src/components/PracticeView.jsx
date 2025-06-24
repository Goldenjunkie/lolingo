import React from 'react';
import { RefreshCw } from 'lucide-react';

const PracticeView = ({ completedLessons, startPracticeSession, setModalState }) => {
    const handleStart = () => {
        if (completedLessons.size < 1) {
            setModalState({isOpen: true, title: "Lecciones Requeridas", content: <p>Completa al menos una lección antes de poder practicar.</p>});
            return;
        }
        startPracticeSession();
    };

    return (
        <div className="p-6 bg-gray-800 rounded-lg text-center animate-fade-in">
             <h3 className="text-2xl font-bold text-yellow-300 mb-2">Modo de Práctica</h3>
             <p className="text-gray-400 mb-6">Refuerza tus conocimientos con preguntas de las lecciones completadas.</p>
             <button onClick={handleStart} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg">
                <RefreshCw className="mr-2"/> Iniciar Práctica
             </button>
        </div>
    );
};

export default PracticeView;