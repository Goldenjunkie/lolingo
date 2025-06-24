import React from 'react';
import { BookOpen, RefreshCw, ShoppingCart } from 'lucide-react';

const BottomNavBar = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'path', label: 'Aprender', icon: BookOpen },
        { id: 'practice', label: 'Practicar', icon: RefreshCw },
        { id: 'shop', label: 'Tienda', icon: ShoppingCart },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t-2 border-yellow-500/30 max-w-2xl mx-auto rounded-t-lg">
            <div className="flex justify-around">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setActiveView(item.id)}
                        className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${activeView === item.id ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}>
                        <item.icon size={24} />
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavBar;