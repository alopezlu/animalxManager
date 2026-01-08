import React, { useState } from 'react';
import { uploadExcel, fetchMembers } from '../services/apiService';
import { Member } from '../types';

const ExcelUpload: React.FC<{onUpdate: (members: Member[]) => void}> = ({ onUpdate }) => {
  const [file, setFile] = useState<File|null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setFeedback("");
    try {
      const resp = await uploadExcel(file);
      setFeedback(`Resultado: ${resp}`);
      const users = await fetchMembers();
      onUpdate(users);
    } catch(e: any) {
      setFeedback(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white text-black max-w-lg mx-auto flex flex-col gap-5">
      <h2 className="text-xl font-bold">Cargar usuarios Excel</h2>
      <input type="file" accept='.xls,.xlsx' onChange={handleChange} />
      <button onClick={handleUpload} disabled={!file || loading} className="bg-blue-600 text-white rounded px-6 py-2 font-bold disabled:opacity-50">
        {loading ? 'Cargando...' : 'Cargar Excel'}
      </button>
      {feedback && <div className="text-sm text-green-700 whitespace-pre-line">{feedback}</div>}
    </div>
  );
};
export default ExcelUpload;

