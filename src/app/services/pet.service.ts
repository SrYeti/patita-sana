import { Injectable } from '@angular/core';
import { supabase } from '../../environments/supabase-client';
import { Pet } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  // Agregar mascota
  async addPet(pet: Omit<Pet, 'id'>, userId: string): Promise<void> {
    const { error } = await supabase
      .from('mascotas')
      .insert([{ ...pet, user_id: userId }]);
    if (error) throw error;
  }

  // Obtener mascotas del usuario
  async getMascotas(userId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data as Pet[];
  }

  // Obtener una mascota por su id
  async getMascotaById(id: string): Promise<Pet | null> {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener mascota:', error);
      return null;
    }
    return data as Pet;
  }

  // Actualizar mascota
  async updatePet(id: string, pet: Partial<Pet>): Promise<void> {
    const { error } = await supabase
      .from('mascotas')
      .update(pet)
      .eq('id', id);
    if (error) throw error;
  }
}