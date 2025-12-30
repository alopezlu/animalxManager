
import React, { useMemo, useState } from 'react';
import { GymMember, PaymentStatus } from '../types';
import BirthdayIcon from './icons/BirthdayIcon';
import WarningIcon from './icons/WarningIcon';
import { sendEmail } from '../services/apiService';
import SpinnerIcon from './icons/SpinnerIcon';

interface CommunicationsProps {
  members: GymMember[];
  birthdayMessageTemplate: string;
}

const MemberCard: React.FC<{ member: GymMember; type: 'birthday' | 'payment', template?: string }> = ({ member, type, template }) => {
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSend = async () => {
    setSendingStatus('sending');
    
    let subject = '';
    let body = '';

    if (type === 'birthday' && template) {
        subject = `¡Feliz Cumpleaños, ${member.Nombre}!`;
        body = template
            .replace(/{nombre}/g, member.Nombre)
            .replace(/{plan}/g, member.Cuota);
    } else if (type === 'payment') {
        subject = 'Recordatorio de Pago - AnimalX Gym';
        body = `¡Hola ${member.Nombre}!\n\nTe recordamos que tu cuota del plan "${member.Cuota}" está vencida. Por favor, acércate a recepción para regularizar tu situación y seguir entrenando al máximo.\n\n¡Te esperamos!\nEl equipo de AnimalX Gym`;
    }

    const result = await sendEmail({ to: member.Correo, subject, body });

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
    <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between">
      <div>
        <p className="font-semibold text-white">{member.Nombre}</p>
        <p className="text-sm text-gray-400">{member.Correo}</p>
        {type === 'birthday' && <p className="text-xs text-blue-400">Cumpleaños: {member['Fecha de nacimiento']}</p>}
        {type === 'payment' && <p className="text-xs text-red-400">Vencimiento: Día {member['Dia a pagar la cuota']}</p>}
      </div>
      <button
        onClick={handleSend}
        disabled={sendingStatus !== 'idle'}
        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors duration-200 w-32 flex justify-center items-center ${
          sendingStatus === 'sent'
            ? 'bg-green-700 text-white cursor-not-allowed'
            : sendingStatus === 'sending'
            ? 'bg-gray-600 text-gray-400 cursor-wait'
            : type === 'birthday'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        {renderButtonContent()}
      </button>
    </div>
  );
};


const Communications: React.FC<CommunicationsProps> = ({ members, birthdayMessageTemplate }) => {
  const { overdueMembers, birthdayMembers } = useMemo(() => {
    const overdue = members.filter(m => m['Estado de cuota'] === PaymentStatus.Overdue);

    const today = new Date();
    today.setHours(0,0,0,0);

    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const birthday = members.filter(m => {
        if (!m['Fecha de nacimiento']) return false;
        
        const parts = m['Fecha de nacimiento'].split('/');
        if (parts.length !== 3) return false;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);

        if (isNaN(day) || isNaN(month)) return false;

        const birthDateThisYear = new Date(today.getFullYear(), month - 1, day);
        return birthDateThisYear >= today && birthDateThisYear <= nextMonth;
    }).sort((a,b) => {
        const [dayA, monthA] = a['Fecha de nacimiento'].split('/').map(Number);
        const dateA = new Date(today.getFullYear(), monthA - 1, dayA);
        const [dayB, monthB] = b['Fecha de nacimiento'].split('/').map(Number);
        const dateB = new Date(today.getFullYear(), monthB - 1, dayB);
        return dateA.getTime() - dateB.getTime();
    });

    return { overdueMembers: overdue, birthdayMembers: birthday };
  }, [members]);

  return (
    <div className="pt-16 lg:pt-0">
      <h2 className="text-3xl font-bold text-white mb-6">Comunicaciones</h2>
      
      {members.length === 0 && (
          <div className="text-center">
              <p className="text-gray-400 max-w-2xl mx-auto">
                  Carga un archivo en 'Gestionar Miembros' para ver las comunicaciones pendientes.
              </p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Reminders */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h3 className="flex items-center text-xl font-bold text-white mb-4">
            <WarningIcon className="text-red-400 mr-2" />
            Recordatorios de Pago ({overdueMembers.length})
          </h3>
          {overdueMembers.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {overdueMembers.map(member => (
                <MemberCard key={member.Id} member={member} type="payment" />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No hay miembros con pagos vencidos.</p>
          )}
        </div>

        {/* Birthday Greetings */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h3 className="flex items-center text-xl font-bold text-white mb-4">
            <BirthdayIcon className="text-blue-400 mr-2" />
            Saludos de Cumpleaños ({birthdayMembers.length})
          </h3>
           {birthdayMembers.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {birthdayMembers.map(member => (
                <MemberCard key={member.Id} member={member} type="birthday" template={birthdayMessageTemplate} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No hay cumpleaños próximos en el siguiente mes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communications;
