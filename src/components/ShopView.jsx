import React from 'react';
import { Diamond } from 'lucide-react';

const ShopView = ({ blueEssence, onBuy, setModalState }) => {
    const lifeRefillCost = 100;
    const canAfford = blueEssence >= lifeRefillCost;

    const handleBuy = () => {
        if(canAfford) {
            onBuy('life_refill', lifeRefillCost);
            setModalState({isOpen: true, title: "¡Compra Realizada!", content: <p>Tus vidas han sido restauradas.</p>});
        } else {
            setModalState({isOpen: true, title: "Fondos Insuficientes", content: <p>Necesitas más Esencia Azul para comprar esto.</p>});
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg animate-fade-in">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">Tienda</h3>
            <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <p className="text-lg font-bold text-white">Recarga de Vidas</p>
                    <p className="text-sm text-gray-400">Restaura tus 3 vidas al instante.</p>
                </div>
                <button onClick={handleBuy} disabled={!canAfford} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Diamond size={16} className="mr-2"/> {lifeRefillCost}
                </button>
            </div>
        </div>
    );
};

export default ShopView;
