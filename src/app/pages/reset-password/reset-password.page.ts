import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../../../environments/supabase-client';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class ResetPasswordPage {
  newPassword = '';

  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onResetPassword() {
    try {
      const { error } = await supabase.auth.updateUser({ password: this.newPassword });
      if (error) throw error;
      this.showToast('Contraseña actualizada. Ahora puedes iniciar sesión.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.showToast(error.message || 'Error al actualizar la contraseña');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }
}