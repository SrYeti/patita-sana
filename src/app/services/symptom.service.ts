import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PetSymptom } from 'src/app/models/pet-symptom.model';

@Injectable({
  providedIn: 'root',
})
export class SymptomService {
  private tableName = 'sintomas';

  constructor(private supabase: SupabaseService) {}

  async addSymptom(symptom: Omit<PetSymptom, 'id' | 'creado_en'>) {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert([symptom]) // <-- CORREGIDO: enviar como array
      .select();

    if (error) throw new Error(`Error Supabase: ${error.message}`);
    return data?.[0] as PetSymptom;
  }

  async getSymptomsByPet(mascotaId: string) {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('mascota_id', mascotaId)
      .order('fecha_creacion', { ascending: false });

    if (error) throw new Error(`Error al cargar síntomas: ${error.message}`);
    return data as PetSymptom[];
  }
}