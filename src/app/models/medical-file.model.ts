export interface MedicalFile {
  id: string;
  mascota_id: string;
  user_id: string;
  nombre: string;
  url: string;
  fecha_subida: string; // o Date, pero string es más seguro para datos crudos de Supabase
}