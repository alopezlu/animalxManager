
import React, { useMemo, useState } from 'react';
import { GymMember, PaymentStatus } from '../types';
import UsersIcon from './icons/UsersIcon';
import WarningIcon from './icons/WarningIcon';
import BirthdayIcon from './icons/BirthdayIcon';
import { sendEmail } from '../services/apiService';
import SpinnerIcon from './icons/SpinnerIcon';

interface DashboardProps {
  members: GymMember[];
  birthdayMessageTemplate: string;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
  <div className="bg-gray-900 rounded-xl p-6 flex items-center shadow-lg hover:shadow-2xl transition-shadow duration-300 border-l-4" style={{borderColor: color}}>
    <div className="p-3 rounded-full mr-4" style={{backgroundColor: `${color}20`, color: color}}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const PreviewModal: React.FC<{ isOpen: boolean; onClose: () => void; message: string; memberName: string }> = ({ isOpen, onClose, message, memberName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h4 className="text-lg font-bold text-white mb-4">Mensaje para {memberName}</h4>
                <div className="bg-gray-900 p-4 rounded-md text-gray-300 mb-6">
                    <p>{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

const BirthdayMemberCard: React.FC<{ member: GymMember; template: string }> = ({ member, template }) => {
    const [isPreviewOpen, setPreviewOpen] = useState(false);
    const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const birthdayMessage = template
        .replace(/{nombre}/g, member.Nombre)
        .replace(/{plan}/g, member.Cuota);

    const handleSend = async () => {
        setSendingStatus('sending');
        const result = await sendEmail({
            to: member.Correo,
            subject: `¡Feliz Cumpleaños, ${member.Nombre}!`,
            body: birthdayMessage,
        });

        if (result.success) {
            setSendingStatus('sent');
        } else {
            alert('Error al enviar el correo. Inténtalo de nuevo.');
            setSendingStatus('idle');
        }
    };

    const renderButtonContent = () => {
        switch (sendingStatus) {
            case 'sending':
                return <><SpinnerIcon /> Enviando...</>;
            case 'sent':
                return 'Enviado';
            default:
                return 'Enviar';
        }
    };

    return (
        <>
            <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-white text-sm">{member.Nombre}</p>
                        <p className="text-xs text-gray-400">{member.Correo}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPreviewOpen(true)}
                            className="text-xs bg-gray-600 hover:bg-gray-700 text-white font-semibold py-1 px-2 rounded-md transition-colors"
                        >
                            Vista Previa
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={sendingStatus !== 'idle'}
                            className={`text-xs text-white font-semibold py-1 px-2 rounded-md transition-colors w-24 flex justify-center items-center ${
                                sendingStatus === 'sent' 
                                ? 'bg-green-700 cursor-not-allowed' 
                                : sendingStatus === 'sending'
                                ? 'bg-blue-700 cursor-wait'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                           {renderButtonContent()}
                        </button>
                    </div>
                </div>
            </div>
            <PreviewModal 
                isOpen={isPreviewOpen} 
                onClose={() => setPreviewOpen(false)} 
                message={birthdayMessage}
                memberName={member.Nombre}
            />
        </>
    );
};

const BirthdayList: React.FC<{ title: string; members: GymMember[]; template: string; }> = ({ title, members, template }) => (
    <div>
        <h4 className="font-bold text-lg text-white mb-2">{title}</h4>
        {members.length > 0 ? (
            <ul className="space-y-2">
                {members.map(member => (
                    <li key={member.Id}>
                        <BirthdayMemberCard member={member} template={template} />
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-sm">Nadie cumple años.</p>
        )}
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ members, birthdayMessageTemplate }) => {
  const { totalMembers, overduePayments, upcomingBirthdaysCount, birthdaysToday, birthdaysTomorrow } = useMemo(() => {
    const totalMembers = members.length;
    const overduePayments = members.filter(m => m['Estado de cuota'] === PaymentStatus.Overdue).length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();
    const tomorrowMonth = tomorrow.getMonth() + 1;
    const tomorrowDate = tomorrow.getDate();

    const birthdaysToday: GymMember[] = [];
    const birthdaysTomorrow: GymMember[] = [];

    const next7DaysLimit = new Date();
    next7DaysLimit.setDate(today.getDate() + 7);
    
    const upcomingBirthdaysCount = members.filter(m => {
        if (!m['Fecha de nacimiento']) return false;
        const parts = m['Fecha de nacimiento'].split('/');
        if (parts.length !== 3) return false;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        
        if (isNaN(day) || isNaN(month)) return false;

        if (month === todayMonth && day === todayDate) birthdaysToday.push(m);
        if (month === tomorrowMonth && day === tomorrowDate) birthdaysTomorrow.push(m);

        const birthDateThisYear = new Date(today.getFullYear(), month - 1, day);
        return birthDateThisYear >= today && birthDateThisYear <= next7DaysLimit;
    }).length;
    
    return { totalMembers, overduePayments, upcomingBirthdaysCount, birthdaysToday, birthdaysTomorrow };
  }, [members]);

  if (members.length === 0) {
      return (
          <div className="pt-16 lg:pt-0 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Bienvenido a AnimalX Gym Manager</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                  Aún no hay datos de miembros. Por favor, ve a la sección de 'Gestionar Miembros' para cargar un archivo Excel y comenzar.
              </p>
          </div>
      )
  }

  return (
    <div className="pt-16 lg:pt-0">
      <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<UsersIcon />} 
          title="Total de Miembros" 
          value={totalMembers} 
          color="#ff0000" // AnimalX red
        />
        <StatCard 
          icon={<WarningIcon />} 
          title="Pagos Vencidos" 
          value={overduePayments} 
          color="#f87171" // red-400
        />
        <StatCard 
          icon={<BirthdayIcon />} 
          title="Próximos Cumpleaños (7 días)" 
          value={upcomingBirthdaysCount} 
          color="#60a5fa" // blue-400
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Miembros Recientes</h3>
            {members.length > 0 ? (
              <ul className="space-y-3">
                {members.slice(-5).reverse().map(member => (
                  <li key={member.Id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{member.Nombre}</p>
                      <p className="text-sm text-gray-400">{member.Correo}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      member['Estado de cuota'] === PaymentStatus.Paid ? 'bg-green-500/20 text-green-400' : 
                      member['Estado de cuota'] === PaymentStatus.Overdue ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {member['Estado de cuota']}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No hay miembros para mostrar.</p>
            )}
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Cumpleaños</h3>
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                <BirthdayList title="Hoy" members={birthdaysToday} template={birthdayMessageTemplate} />
                <BirthdayList title="Mañana" members={birthdaysTomorrow} template={birthdayMessageTemplate} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
