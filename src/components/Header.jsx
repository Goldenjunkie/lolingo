import React from 'react';
import { Award, Diamond, Star } from 'lucide-react';

const Header = ({ xp, blueEssence, onAchievementsClick }) => (
    <header className="text-center pt-4 px-4 relative">
        <h1 className="text-3xl font-bold text-yellow-400 tracking-wider" style={{ fontFamily: 'Beaufort, serif' }}>Academia de la Grieta</h1>
        <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={onAchievementsClick} className="bg-gray-900/80 border border-yellow-500/30 rounded-lg px-3 py-2 flex items-center hover:bg-yellow-500/20 transition-colors" title="Ver Logros">
                <Award className="text-yellow-400" size={20}/>
            </button>
            <div className="bg-gray-900/80 border border-cyan-500/30 rounded-lg px-3 py-2 flex items-center" title="Esencia Azul">
                <Diamond className="text-cyan-400 mr-2" size={20}/>
                <span className="font-bold text-lg text-white">{blueEssence}</span>
            </div>
            <div className="bg-gray-900/80 border border-yellow-500/30 rounded-lg px-3 py-2 flex items-center" title="Puntos de Experiencia">
                <Star className="text-yellow-400 mr-2" size={20}/>
                <span className="font-bold text-lg text-white">{xp}</span>
            </div>
        </div>
    </header>
);

export default Header;