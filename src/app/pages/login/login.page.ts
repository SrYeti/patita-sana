import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private supabaseAuth: SupabaseAuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onLogin() {
    try {
      await this.supabaseAuth.signIn(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.showToast(error.message || 'Error al iniciar sesión');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  goToRegister() {
  this.router.navigate(['/register']);
  }

  async resetPassword() {
    if (!this.email) {
      this.showToast('Por favor ingresa tu correo para recuperar la contraseña');
      return;
    }
    try {
      const { error } = await this.supabaseAuth.resetPassword(this.email);
      if (error) throw error;
      this.showToast('Se envió un correo para restablecer tu contraseña');
    } catch (error: any) {
      this.showToast(error.message || 'Error al enviar el correo de recuperación');
    }
  }
}