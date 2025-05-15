import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.page.html',
  styleUrls: ['./add-pet.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class AddPetPage {
  nombre = '';
  fichaNumero = '';
  edad: number | null = null;
  sexo = '';
  peso: number | null = null;

  constructor(
    private petService: PetService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onAddPet() {
    try {
      await this.petService.addPet({
        nombre: this.nombre,
        fichaNumero: this.fichaNumero,
        edad: this.edad ?? 0,
        sexo: this.sexo,
        peso: this.peso ?? 0
      });
      this.showToast('Mascota guardada');
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.showToast(error.message || 'Error al guardar mascota');
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