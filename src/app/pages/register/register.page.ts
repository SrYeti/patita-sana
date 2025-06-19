import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegisterPage {
  // Propiedades del formulario
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private supabaseAuth: SupabaseAuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  // Registra un nuevo usuario
  async onRegister() {
    if (!this.nombre) {
      this.showToast('El nombre es obligatorio');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showToast('Las contraseñas no coinciden');
      return;
    }
    try {
      await this.supabaseAuth.signUp(this.email, this.password, this.nombre);
      this.showToast('Registro exitoso. Revisa tu correo para confirmar.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.showToast(error.message || 'Error al registrar');
    }
  }

  // Muestra un mensaje toast
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}