
import React, { useState, useCallback, useEffect } from 'react';
import { GymMember } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import Communications from './components/Communications';
import Settings from './components/Settings';
import { fetchMembers } from './services/apiService';
import SpinnerIcon from './components/icons/SpinnerIcon';

type View = 'dashboard' | 'members' | 'communications' | 'settings';

const App: React.FC = () => {
  const [members, setMembers] = useState<GymMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [birthdayMessageTemplate, setBirthdayMessageTemplate] = useState(
    '¡Hola {nombre}! 🎉 En AnimalX Gym te deseamos un muy feliz cumpleaños. ¡Que tengas un día increíble y lleno de energía! 💪'
  );

  const loadMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedMembers = await fetchMembers();
      setMembers(fetchedMembers.sort((a, b) => a.Nombre.localeCompare(b.Nombre)));
    } catch (err) {
      setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en localhost:8080.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleDataLoaded = useCallback(async () => {
    await loadMembers();
  }, [loadMembers]);

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full pt-16 lg:pt-0">
          <SpinnerIcon className="w-12 h-12 text-red-500 animate-spin" />
          <p className="mt-4 text-lg text-gray-400">Cargando datos de AnimalX...</p>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-full pt-16 lg:pt-0 text-center">
            <h3 className="text-2xl font-bold text-red-500">Error de Conexión</h3>
            <p className="mt-2 text-gray-400 max-w-md">{error}</p>
            <button
                onClick={loadMembers}
                className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
            >
                Reintentar
            </button>
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard members={members} birthdayMessageTemplate={birthdayMessageTemplate} />;
      case 'members':
        return <MemberManagement members={members} onDataLoaded={handleDataLoaded} />;
      case 'communications':
        return <Communications members={members} birthdayMessageTemplate={birthdayMessageTemplate} />;
      case 'settings':
        return <Settings template={birthdayMessageTemplate} onTemplateChange={setBirthdayMessageTemplate} />;
      default:
        return <Dashboard members={members} birthdayMessageTemplate={birthdayMessageTemplate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-gray-200 font-sans">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 relative">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
