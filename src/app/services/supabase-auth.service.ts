import { Injectable } from '@angular/core';
import { supabase } from '../../environments/supabase-client';

@Injectable({ providedIn: 'root' })
export class SupabaseAuthService {
  // Registro de usuario
  async signUp(email: string, password: string, nombre: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre }
      }
    });
    if (error) throw error;
    return data;
  }

  // Login de usuario
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return supabase.auth.getUser();
  }

  // Envía correo para restablecer contraseña
  async resetPassword(email: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
  }
}