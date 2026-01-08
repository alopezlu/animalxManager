import { Member } from '../types';

const API_BASE = "http://localhost:8080"; // Cambia según donde despliegues

export async function uploadExcel(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/members/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export async function fetchMembers(): Promise<Member[]> {
  const res = await fetch(`${API_BASE}/members`);
  if (!res.ok) throw new Error('No se pudo consultar la lista de miembros');
  const data = await res.json();
  return data;
}
