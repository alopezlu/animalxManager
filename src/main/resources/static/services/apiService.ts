
import { GymMember } from '../types';

const API_BASE_URL = '/api/v1'; // Path relativo, ya que se sirve desde el mismo host

// La función de envío de correo electrónico se mantiene como una simulación,
// ya que el backend no implementa esta funcionalidad.
export const sendEmail = async (payload: {to: string; subject: string; body: string}) => {
    console.log("Simulación de envío de correo a:", payload.to);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
};

export interface SyncResult {
    success: boolean;
    error?: string;
}

// Llama al endpoint de sincronización del backend
export const syncMembersWithBackend = async (members: Omit<GymMember, 'Id'>[]): Promise<SyncResult> => {
    try {
        const response = await fetch(`${API_BASE_URL}/members/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(members),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la respuesta del servidor');
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error al sincronizar miembros:', error);
        return { success: false, error: error.message };
    }
};

// Llama al endpoint para obtener todos los miembros
export const fetchMembers = async (): Promise<GymMember[]> => {
    const response = await fetch(`${API_BASE_URL}/members`);
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error('No se pudo obtener la lista de miembros del servidor.');
    }
    const data = await response.json();
    // El backend devuelve un DTO con 'id', pero el tipo del frontend espera 'Id'.
    // Mapeamos aquí para asegurar la compatibilidad.
    return data.map((member: any) => ({ ...member, Id: member.id }));
};
