import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

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
    private auth: Auth,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onLogin() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.showToast(error.message || 'Error al iniciar sesión');
    }
  }

  async onLoginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.showToast(error.message || 'Error con Google');
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
}