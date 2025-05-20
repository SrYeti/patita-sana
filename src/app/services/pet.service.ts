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
}