import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';

const LearningPathView = ({ sections, onSelectLesson, completedLessons, currentLessonId }) => {
    let previousSectionCompleted = true; // La primera sección siempre está desbloqueada

    return (
        <div className="space-y-8">
            {sections.map((section, sectionIndex) => {
                const isLocked = !previousSectionCompleted;

                const isCurrentSectionComplete = section.lessons.every(l => completedLessons.has(l.id));
                previousSectionCompleted = isCurrentSectionComplete;

                return (
                    <div key={sectionIndex} className={`p-4 rounded-lg transition-opacity duration-500 ${isLocked ? 'opacity-50' : 'opacity-100'}`}>
                        <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center">
                            {isLocked && <Lock className="mr-2" size={20} />}
                            {section.sectionTitle}
                        </h3>
                        <div className="relative space-y-4">
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>
                            {section.lessons.map((lesson) => {
                                const isCompleted = completedLessons.has(lesson.id);
                                const isCurrent = lesson.id === currentLessonId;
                                let statusColor = isCompleted ? 'bg-green-500' : isCurrent && !isLocked ? 'bg-blue-500 animate-pulse' : 'bg-gray-700';

                                return (
                                    <div key={lesson.id} className="flex items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl z-10 ${statusColor}`}>
                                            {isCompleted ? <CheckCircle className="text-white"/> : lesson.icon}
                                        </div>
                                        <button onClick={() => !isLocked && onSelectLesson(lesson.id)} disabled={isLocked} className="ml-4 p-4 bg-gray-800 rounded-lg flex-1 text-left hover:bg-gray-700 transition-colors disabled:cursor-not-allowed disabled:hover:bg-gray-800">
                                            <p className="font-bold text-white">{lesson.title}</p>
                                            <p className="text-sm text-yellow-400">+{lesson.xp} XP / +{lesson.essence} EA</p>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LearningPathView;