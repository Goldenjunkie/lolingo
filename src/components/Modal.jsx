import React from 'react';

const Modal = ({ isOpen, title, children, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm border-2 border-yellow-500/50 text-center">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center justify-center">{title}</h3>
                <div className="text-gray-300 mb-6">{children}</div>
                <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">Entendido</button>
            </div>
        </div>
    );
};

export default Modal;