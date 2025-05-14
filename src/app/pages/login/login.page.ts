import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

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

  onLogin() {
    // Aquí irá la lógica de autenticación
    console.log('Login:', this.email, this.password);
  }

  onLoginWithGoogle() {
    // Aquí irá la lógica para login con Google
    console.log('Login con Google');
  }
}
