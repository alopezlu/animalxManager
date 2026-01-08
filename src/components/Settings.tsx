
import React, { useState } from 'react';

interface SettingsProps {
  template: string;
  onTemplateChange: (newTemplate: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ template, onTemplateChange }) => {
  const [localTemplate, setLocalTemplate] = useState(template);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    onTemplateChange(localTemplate);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const sampleMember = {
    nombre: 'Juan Pérez',
    plan: 'Plan Premium',
  };

  const previewMessage = localTemplate
    .replace(/{nombre}/g, sampleMember.nombre)
    .replace(/{plan}/g, sampleMember.plan);

  return (
    <div className="pt-16 lg:pt-0">
      <h2 className="text-3xl font-bold text-white mb-6">Configuración</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Plantilla de Mensaje de Cumpleaños</h3>
          <p className="text-gray-400 mb-2 text-sm">
            Personaliza el mensaje que se enviará a los miembros en su cumpleaños.
          </p>
          <p className="text-gray-400 mb-4 text-sm">
            Variables disponibles: <code className="bg-gray-800 text-red-400 px-1 rounded">{'{nombre}'}</code>, <code className="bg-gray-800 text-red-400 px-1 rounded">{'{plan}'}</code>
          </p>
          
          <textarea
            value={localTemplate}
            onChange={(e) => setLocalTemplate(e.target.value)}
            rows={6}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            placeholder="Escribe tu mensaje aquí..."
          />
          
          <button
            onClick={handleSave}
            className="mt-4 w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center"
          >
            Guardar Cambios
            {showSuccess && (
                <svg className="w-5 h-5 ml-2 text-white animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            )}
          </button>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Vista Previa</h3>
          <div className="bg-gray-800 p-4 rounded-md text-gray-300">
            <p className="font-semibold text-white mb-2">Para: {sampleMember.nombre}</p>
            <div className="border-t border-gray-700 pt-2">
              <p>{previewMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
