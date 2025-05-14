import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class RegisterPage {
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';

  onRegister() {
    // Aquí luego pondremos la lógica de Firebase
    console.log('Registro:', this.nombre, this.email, this.password, this.confirmPassword);
  }
}
