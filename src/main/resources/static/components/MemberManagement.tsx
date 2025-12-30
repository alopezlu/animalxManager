
import React, { useState, ChangeEvent, useMemo } from 'react';
import { GymMember, PaymentStatus } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';
import { syncMembersWithBackend } from '../services/apiService';

declare global {
  interface Window {
    XLSX: any;
  }
}

interface MemberManagementProps {
  members: GymMember[];
  onDataLoaded: () => Promise<void>;
}

const FileUpload: React.FC<{ onDataLoaded: () => Promise<void> }> = ({ onDataLoaded }) => {
    const [status, setStatus] = useState<{msg: string, progress: number, error?: string} | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setStatus({ msg: "Leyendo archivo Excel...", progress: 10 });

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = window.XLSX.read(data, { type: 'array', cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = window.XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                
                if (!json || json.length === 0) {
                    setStatus({ msg: "Error", progress: 0, error: "El archivo Excel parece estar vacío o no tiene el formato correcto." });
                    return;
                }

                setStatus({ msg: "Validando datos...", progress: 30 });

                const formattedMembers: Omit<GymMember, 'Id'>[] = json.map((row: any) => {
                    const getVal = (keys: string[]) => {
                        const foundKey = Object.keys(row).find(k => keys.includes(k.toLowerCase().trim()));
                        return foundKey ? row[foundKey] : null;
                    };

                    return {
                        Nombre: String(getVal(['nombre', 'nombres', 'cliente', 'usuario']) || 'Sin Nombre'),
                        Correo: String(getVal(['correo', 'email', 'e-mail']) || ''),
                        DNI: String(getVal(['dni', 'cedula', 'documento']) || ''),
                        'Fecha de nacimiento': String(getVal(['fecha de nacimiento', 'nacimiento', 'cumpleaños']) || ''),
                        Cuota: String(getVal(['cuota', 'plan', 'membresia']) || 'Plan Base'),
                        'Estado de cuota': (getVal(['estado de cuota', 'estado', 'pago']) || PaymentStatus.Pending) as any,
                        'Dia a pagar la cuota': parseInt(getVal(['dia a pagar la cuota', 'dia pago', 'dia']) || '1'),
                        Teléfono: String(getVal(['teléfono', 'telefono', 'celular', 'whatsapp', 'telefono']) || ''),
                        Género: String(getVal(['género', 'genero', 'sexo']) || 'No especificado'),
                        Edad: parseInt(getVal(['edad']) || 0),
                        'Tipo de pago': String(getVal(['tipo de pago', 'metodo']) || 'Efectivo')
                    };
                });

                setStatus({ msg: "Sincronizando con el servidor...", progress: 60 });
                const result = await syncMembersWithBackend(formattedMembers);
                
                if (!result.success) {
                    setStatus({ 
                        msg: "Error al sincronizar", 
                        progress: 60, 
                        error: result.error || "Ocurrió un error desconocido en el servidor."
                    });
                    return;
                }
                
                setStatus({ msg: "Actualizando lista de miembros...", progress: 90 });
                await onDataLoaded();
                setStatus({ msg: "¡Sincronización completa!", progress: 100 });
                setTimeout(() => setStatus(null), 3000);

            } catch (error: any) {
                console.error("Error al procesar Excel:", error);
                const errorMessage = error.response?.data?.message || error.message || "Error de red o de formato de archivo.";
                setStatus({ msg: "Error de procesamiento", progress: 0, error: errorMessage });
            } finally {
                event.target.value = '';
            }
        };

        reader.onerror = () => {
            setStatus({ msg: "Error", progress: 0, error: "No se pudo leer el archivo físico." });
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="bg-gray-900 p-6 rounded-xl mb-6 border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                Carga Masiva - AnimalX Marinilla
                {status && !status.error && <SpinnerIcon className="ml-3 w-5 h-5 text-red-500 animate-spin" />}
            </h3>
            
            {status ? (
                <div className="mt-4">
                    <div className="flex justify-between mb-1">
                        <span className={`text-sm font-medium ${status.error ? 'text-red-500' : 'text-gray-400'}`}>
                            {status.msg}
                        </span>
                        {!status.error && <span className="text-sm font-medium text-red-500">{status.progress}%</span>}
                    </div>
                    
                    {!status.error ? (
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div className="bg-red-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${status.progress}%` }}></div>
                        </div>
                    ) : (
                        <div className="mt-2 p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
                            <p className="text-red-500 text-sm font-bold flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                ERROR DETECTADO:
                            </p>
                            <p className="text-red-400 text-xs mt-1 font-mono">{status.error}</p>
                            <button 
                                onClick={() => setStatus(null)}
                                className="mt-3 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors font-bold uppercase tracking-wider"
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <p className="text-gray-400 mb-6 text-sm">Los datos se guardarán permanentemente en la base de datos. Si un miembro ya existe (por DNI), será actualizado.</p>
                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800 hover:border-red-500 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className="mb-2 text-sm text-gray-400 font-semibold text-center px-4">Haz clic para seleccionar el archivo Excel (.xlsx)</p>
                        </div>
                        <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
                    </label>
                </>
            )}
        </div>
    );
};

const MemberTable: React.FC<{ members: GymMember[] }> = ({ members }) => {
    const [filter, setFilter] = useState('');
    const filtered = useMemo(() => 
        members.filter(m => 
            (m.Nombre && m.Nombre.toLowerCase().includes(filter.toLowerCase())) || 
            (m.DNI && String(m.DNI).includes(filter))
        ),
        [members, filter]
    );

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
            <div className="p-4 bg-gray-800/50 border-b border-gray-800 flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o DNI..." 
                        className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="ml-4 text-xs font-mono text-gray-500 hidden sm:block">
                    Total Registros: {members.length}
                </div>
            </div>
            <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-black text-gray-400 uppercase text-xs sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">DNI</th>
                            <th className="px-6 py-3">Teléfono</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filtered.length > 0 ? filtered.map(m => (
                            <tr key={m.Id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{m.Nombre}</td>
                                <td className="px-6 py-4 text-gray-400">{m.DNI}</td>
                                <td className="px-6 py-4 text-gray-300">{m.Teléfono}</td>
                                <td className="px-6 py-4 text-gray-400">{m.Cuota}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        m['Estado de cuota'] === PaymentStatus.Paid ? 'bg-green-500/10 text-green-500' :
                                        m['Estado de cuota'] === PaymentStatus.Overdue ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                        {m['Estado de cuota']}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">No se encontraron miembros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MemberManagement: React.FC<MemberManagementProps> = ({ members, onDataLoaded }) => {
    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-white tracking-tight">Gestión AnimalX</h2>
                <p className="text-gray-500">Administra la base de datos de Marinilla cargando archivos de Excel.</p>
            </header>
            <FileUpload onDataLoaded={onDataLoaded} />
            <MemberTable members={members} />
        </div>
    );
};

export default MemberManagement;
