import React, { useState, useEffect } from 'react';
import ExcelUpload from './components/ExcelUpload';
import MembersTable from './components/MembersTable';
import { fetchMembers } from './services/apiService';
import { Member } from './types';

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const usuarios = await fetchMembers();
        setMembers(usuarios);
      } catch (e) { setMembers([]); }
      setLoading(false);
    })();
  }, []);
  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-3xl mb-8 font-extrabold text-center text-lime-400">AnimalX Gym Manager</h1>
      <ExcelUpload onUpdate={setMembers} />
      {loading ? <p className="text-gray-100 mt-12 text-center">Cargando miembros...</p> :
        <MembersTable members={members} />}
    </div>
  );
};
export default App;
