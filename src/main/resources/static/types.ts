
export interface GymMember {
  Id?: number | string; // El ID es opcional porque los nuevos miembros no lo tienen.
  Nombre: string;
  Correo: string;
  Teléfono: string;
  Género: string;
  Edad: number;
  'Fecha de nacimiento': string;
  DNI: string;
  'Estado de cuota': 'Al día' | 'Vencido' | 'Pendiente';
  'Dia a pagar la cuota': number;
  'Tipo de pago': string;
  Cuota: string; // Plan name
}

export enum PaymentStatus {
    Paid = 'Al día',
    Overdue = 'Vencido',
    Pending = 'Pendiente'
}
