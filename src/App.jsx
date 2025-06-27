import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

import Modal from './components/Modal.jsx';
import Header from './components/Header.jsx';
import LearningPathView from './components/LearningPathView.jsx';
import QuizView from './components/QuizView.jsx';
import ShopView from './components/ShopView.jsx';
import PracticeView from './components/PracticeView.jsx';
import BottomNavBar from './components/BottomNavBar.jsx';

const sectionsData = [ { sectionTitle: 'Fundamentos de la Grieta', lessons: [ { id: 'last_hitting', title: 'Farmear: El Arte del Last Hit', icon: '🌾', xp: 10, essence: 20, content: `Dar el último golpe a los súbditos es crucial para obtener oro y comprar objetos.`, quiz: [ { question: '¿Qué obtienes principalmente al dar el último golpe a un súbdito?', options: ['Experiencia', 'Oro', 'Maná', 'Visión'], correctAnswer: 'Oro' }, { question: '¿Por qué es importante el oro?', options: ['Para subir de nivel más rápido', 'Para comprar objetos', 'Para regenerar vida', 'Para desbloquear habilidades'], correctAnswer: 'Para comprar objetos' }, ] }, { id: 'wards', title: 'Visión: El Poder de los Wards', icon: '👁️', xp: 15, essence: 30, content: `La visión gana partidas. Los centinelas (wards) te permiten ver áreas del mapa y evitar emboscadas.`, quiz: [ { question: '¿Cuál es la función principal de un centinela (ward)?', options: ['Hacer daño a los enemigos', 'Curar a los aliados', 'Otorgar visión en el mapa', 'Aumentar tu velocidad'], correctAnswer: 'Otorgar visión en el mapa' }, { question: '¿Qué previene principalmente tener buena visión?', options: ['Perder oro', 'Emboscadas (ganks) enemigas', 'El respawn del Dragón', 'La caída de tus torretas'], correctAnswer: 'Emboscadas (ganks) enemigas' }, ] }, { id: 'roles', title: 'Los Roles en la Grieta', icon: '⚔️', xp: 10, essence: 20, content: `Existen cinco roles: Top, Jungla, Mid, ADC y Soporte. Cada uno tiene una función específica.`, quiz: [ { question: '¿Qué rol se enfoca en ayudar al ADC y controlar la visión?', options: ['Mid', 'Jungla', 'Top', 'Soporte'], correctAnswer: 'Soporte' }, { question: '¿Cuál es el objetivo principal del rol de Jungla al principio del juego?', options: ['Quedarse en una línea', 'Ayudar a otras líneas con emboscadas', 'Conseguir la mayor cantidad de oro', 'Destruir la primera torreta'], correctAnswer: 'Ayudar a otras líneas con emboscadas' }, ] }, ] }, { sectionTitle: 'Objetos y Poder', lessons: [ { id: 'damage_types', title: 'Tipos de Daño', icon: '💥', xp: 20, essence: 40, content: `Hay tres tipos de daño: Físico (AD), Mágico (AP) y Verdadero. Aprende a contrarrestarlos.`, quiz: [ { question: '¿Con qué estadística defensiva contrarrestas el Daño Físico?', options: ['Vida Máxima', 'Resistencia Mágica', 'Armadura', 'Velocidad de Movimiento'], correctAnswer: 'Armadura' }, { question: '¿Qué tipo de daño ignora la armadura y la resistencia mágica?', options: ['Daño Físico', 'Daño Verdadero', 'Daño Mágico', 'Daño Adaptable'], correctAnswer: 'Daño Verdadero' }, ] }, { id: 'item_components', title: 'Componentes de Objetos', icon: '🧩', xp: 15, essence: 30, content: `Los objetos grandes se construyen a partir de componentes más pequeños. Comprarlos eficientemente te da ventaja.`, quiz: [ { question: 'Si quieres construir el Filo Infinito, ¿qué componente clave necesitas?', options: ['Espadón', 'Hacha', 'Capa de Agilidad', 'Pico'], correctAnswer: 'Espadón' }, ] }, ] }, { sectionTitle: 'Runas Clave', lessons: [ { id: 'conqueror', title: 'Runa: Conquistador', icon: '🔥', xp: 20, essence: 40, content: 'Ideal para luchadores y campeones de daño sostenido. Ganas daño adaptable con cada ataque o habilidad.', quiz: [ { question: '¿Qué tipo de campeones se benefician más de Conquistador?', options: ['Magos de burst', 'Tanques', 'Luchadores y peleadores', 'Soportes de utilidad'], correctAnswer: 'Luchadores y peleadores' } ] }, { id: 'electrocute', title: 'Runa: Electrocutar', icon: '⚡', xp: 20, essence: 40, content: 'Perfecta para asesinos y magos de burst. Ofrece un pico de daño tras acertar 3 ataques o habilidades distintas.', quiz: [ { question: '¿Cuál es el requisito para activar Electrocutar?', options: ['Usar la habilidad definitiva', 'Golpear a un enemigo 3 veces', 'Estar por debajo del 50% de vida', 'Comprar un objeto mítico'], correctAnswer: 'Golpear a un enemigo 3 veces' } ] }, ] }, ];
const allLessons = sectionsData.flatMap(s => s.lessons);
const achievements = { firstBlood: { id: 'firstBlood', title: 'Primera Sangre', description: 'Completa tu primera lección.', icon: '🩸', condition: (p) => p.completed.size >= 1 }, veteran: { id: 'veteran', title: 'Veterano', description: 'Completa 3 lecciones.', icon: '🎖️', condition: (p) => p.completed.size >= 3 }, unstoppable: { id: 'unstoppable', title: 'Imparable', description: 'Alcanza 100 XP.', icon: '🔥', condition: (p) => p.xp >= 100 }, rich: { id: 'rich', title: 'Rico', description: 'Acumula 150 de Esencia Azul.', icon: '💰', condition: (p) => p.blueEssence >= 150 }, legend: { id: 'legend', title: 'Leyenda', description: 'Completa todas las lecciones.', icon: '👑', condition: (p) => p.completed.size === allLessons.length }, };
const firebaseConfig = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, appId: import.meta.env.VITE_FIREBASE_APP_ID };
const appId = 'lolingo-app';

export default function App() {
  const [db, setDb] = useState(null); const [auth, setAuth] = useState(null); const [userId, setUserId] = useState(null); const [isAuthReady, setIsAuthReady] = useState(false); const [activeView, setActiveView] = useState('path'); const [quizContext, setQuizContext] = useState({ lesson: allLessons[0], type: 'lesson' }); const [userProgress, setUserProgress] = useState({ completed: new Set(), unlockedAchievements: new Set(), xp: 0, blueEssence: 0 }); const [lives, setLives] = useState(3); const [modalState, setModalState] = useState({ isOpen: false, title: '', content: null });

  useEffect(() => { if (firebaseConfig.apiKey) { try { const app = initializeApp(firebaseConfig); setDb(getFirestore(app)); setAuth(getAuth(app)); } catch(e) { console.error("Error initializing Firebase:", e); } } }, []);
  useEffect(() => { if (!auth) return; const unsub = onAuthStateChanged(auth, async (user) => { if (user) { setUserId(user.uid); } else { try { await signInAnonymously(auth); } catch (error) { console.error("Error signing in anonymously:", error); } } setIsAuthReady(true); }); return () => unsub(); }, [auth]);
  const updateProgressInFirestore = useCallback(async (dataToUpdate) => { if (!db || !userId) return; const docRef = doc(db, `artifacts/${appId}/users/${userId}/progress`, 'main'); try { const payload = { ...dataToUpdate }; if (payload.completed) payload.completed = Array.from(payload.completed); if (payload.unlockedAchievements) payload.unlockedAchievements = Array.from(payload.unlockedAchievements); await setDoc(docRef, payload, { merge: true }); } catch (error) { console.error("Error updating progress:", error); } }, [db, userId]);
  useEffect(() => { if (!isAuthReady || !db || !userId) return; const docRef = doc(db, `artifacts/${appId}/users/${userId}/progress`, 'main'); const unsub = onSnapshot(docRef, (docSnap) => { if (docSnap.exists()) { const data = docSnap.data(); setUserProgress({ completed: new Set(data.completed || []), unlockedAchievements: new Set(data.achievements || []), xp: data.xp || 0, blueEssence: data.blueEssence || 0 }); } }, (error) => { console.error("Error fetching progress:", error); }); return () => unsub(); }, [isAuthReady, db, userId]);

  const findNextLesson = (completedSet) => allLessons.find(lesson => !completedSet.has(lesson.id)) || allLessons[allLessons.length - 1];
  const handleSelectLesson = (lessonId) => { const lesson = allLessons.find(l => l.id === lessonId); if (lesson) { setLives(3); setQuizContext({ lesson: lesson, type: 'lesson' }); setActiveView('quiz'); } };
  const startPracticeSession = () => { const completed = Array.from(userProgress.completed); const questions = allLessons .filter(l => completed.includes(l.id)) .flatMap(l => l.quiz.map(q => ({...q, lessonTitle: l.title}))); const practiceQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5); const practiceLesson = { id: 'practice_session', title: 'Sesión de Práctica', quiz: practiceQuestions, }; setLives(3); setQuizContext({ lesson: practiceLesson, type: 'practice' }); setActiveView('quiz'); };
  const handleIncorrectAnswer = () => { const newLives = lives - 1; setLives(newLives); if (newLives <= 0) { setModalState({ isOpen: true, title: '¡Has fallado!', content: <p>Te has quedado sin vidas. ¡Puedes comprar más en la tienda o repasar la lección!</p> }); setActiveView(quizContext.type === 'lesson' ? 'path' : 'practice'); } };

  const handleQuizComplete = (finalScore, totalQuestions) => {
    console.log
    const isSuccess = finalScore === totalQuestions;
    if (!isSuccess) { setActiveView(quizContext.type === 'lesson' ? 'path' : 'practice'); return; }

    const currentLesson = quizContext.lesson;

    setUserProgress(currentProgress => {
      let hasChanges = false;
      let newProgress = { ...currentProgress, completed: new Set(currentProgress.completed), unlockedAchievements: new Set(currentProgress.unlockedAchievements) };

      if (quizContext.type === 'practice') {
        hasChanges = true;
        newProgress.xp += 10;
        newProgress.blueEssence += 20;
        setModalState({isOpen: true, title: '¡Práctica Completada!', content: <p>Ganaste <span className="font-bold text-yellow-400">10 XP</span> y <span className="font-bold text-cyan-400">20 EA</span>.</p> });
      } else if (quizContext.type === 'lesson' && !currentProgress.completed.has(currentLesson.id)) {
        hasChanges = true;
        newProgress.xp += currentLesson.xp;
        newProgress.blueEssence += currentLesson.essence;
        newProgress.completed.add(currentLesson.id);

        let newAchievementToShow = null;
        for (const key in achievements) {
          const achievement = achievements[key];
          if (!newProgress.unlockedAchievements.has(achievement.id) && achievement.condition(newProgress)) {
            newProgress.unlockedAchievements.add(achievement.id);
            if (!newAchievementToShow) newAchievementToShow = achievement;
          }
        }

        if (newAchievementToShow) {
          setModalState({ isOpen: true, title: '¡Logro Desbloqueado!', content: <div className="flex flex-col items-center"><span className="text-4xl mb-2">{newAchievementToShow.icon}</span><h4 className="font-bold text-lg text-white">{newAchievementToShow.title}</h4><p>{newAchievementToShow.description}</p></div> });
        } else {
          setModalState({ isOpen: true, title: '¡Lección Superada!', content: <p className="text-lg">¡Felicidades! Has ganado <span className="font-bold text-yellow-400">{currentLesson.xp} XP</span> y <span className="font-bold text-cyan-400">{currentLesson.essence} EA</span>.</p> });
        }
      }

      if (hasChanges) {
        console.log
          updateProgressInFirestore({
              xp: newProgress.xp,
              blueEssence: newProgress.blueEssence,
              completed: Array.from(newProgress.completed),
              achievements: Array.from(newProgress.unlockedAchievements)
          });
      }

      return newProgress;
    });

    setActiveView(quizContext.type === 'lesson' ? 'path' : 'practice');
  };

  const handleBuy = (itemId, cost) => { if (itemId === 'life_refill' && userProgress.blueEssence >= cost) { const progressUpdate = { blueEssence: userProgress.blueEssence - cost }; setUserProgress(prev => ({...prev, blueEssence: prev.blueEssence - cost})); updateProgressInFirestore(progressUpdate); setLives(3); } };
  const showAchievements = () => { setModalState({isOpen: true, title: 'Mis Logros', content: ( <div className="space-y-3"> {Object.values(achievements).map(ach => ( <div key={ach.id} className={`flex items-center p-2 rounded-lg ${userProgress.unlockedAchievements.has(ach.id) ? 'bg-yellow-500/20' : 'bg-gray-700 opacity-60'}`}> <span className="text-3xl mr-3">{userProgress.unlockedAchievements.has(ach.id) ? ach.icon : '❔'}</span> <div> <p className="font-bold text-white">{ach.title}</p> <p className="text-sm text-gray-300">{ach.description}</p> </div> </div> ))} </div> )}) };
  const closeModal = () => setModalState({ isOpen: false, title: '', content: null });

  const renderContent = () => {
      switch(activeView) {
          case 'path': return <LearningPathView sections={sectionsData} onSelectLesson={handleSelectLesson} completedLessons={userProgress.completed} currentLessonId={findNextLesson(userProgress.completed)?.id} />;
          case 'quiz': return <QuizView lesson={quizContext.lesson} onQuizComplete={handleQuizComplete} onIncorrectAnswer={handleIncorrectAnswer} lives={lives} quizTitle={quizContext.type === 'lesson' ? 'Lección' : 'Práctica'}/>;
          case 'practice': return <PracticeView completedLessons={userProgress.completed} startPracticeSession={startPracticeSession} setModalState={setModalState} />;
          case 'shop': return <ShopView blueEssence={userProgress.blueEssence} onBuy={handleBuy} setModalState={setModalState} />;
          default: return <LearningPathView sections={sectionsData} onSelectLesson={handleSelectLesson} completedLessons={userProgress.completed} currentLessonId={findNextLesson(userProgress.completed)?.id} />;
      }
  };

  if (!isAuthReady) { return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><p>Cargando Academia...</p></div>; }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap'); body { font-family: 'Inter', sans-serif; } @font-face { font-family: 'Beaufort'; src: url('https://universe.leagueoflegends.com/fonts/beaufortforlol-bold.woff2') format('woff2'); font-weight: bold; } .animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
      <div className="max-w-2xl mx-auto pb-24">
        <Modal isOpen={modalState.isOpen} title={modalState.title} onClose={closeModal}>{modalState.content}</Modal>
        <Header xp={userProgress.xp} blueEssence={userProgress.blueEssence} onAchievementsClick={showAchievements} />
        <main className="mt-8 px-4"> {renderContent()} </main>
      </div>
      <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}
