// src/app/models/pet-symptom.model.ts
export interface PetSymptom {
  id: string;
  mascota_id: string;
  user_id: string;
  fecha_creacion: string;
  descripcion: string;
  vomitos: boolean;
  ha_comido: boolean;
  ha_bebido: boolean;
  notas?: string | null;
  creado_en?: string;
}
