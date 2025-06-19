import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PetSymptom } from 'src/app/models/pet-symptom.model';

@Injectable({
  providedIn: 'root',
})
export class SymptomService {
  // Nombre de la tabla
  private tableName = 'sintomas';

  constructor(private supabase: SupabaseService) {}

  // Agrega un síntoma
  async addSymptom(symptom: Omit<PetSymptom, 'id' | 'creado_en'>) {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert([symptom]) // <-- CORREGIDO: enviar como array
      .select();

    if (error) throw new Error(`Error Supabase: ${error.message}`);
    return data?.[0] as PetSymptom;
  }

  // Obtiene los síntomas de una mascota
  async getSymptomsByPet(mascotaId: string) {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('mascota_id', mascotaId)
      .order('fecha_creacion', { ascending: false });

    if (error) throw new Error(`Error al cargar síntomas: ${error.message}`);
    return data as PetSymptom[];
  }

  // Elimina un síntoma por id
  async deleteSymptom(id: string) {
    const { error } = await this.supabase.client
      .from(this.tableName)
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
}