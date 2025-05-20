import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-edit-pet',
  templateUrl: './edit-pet.page.html',
  styleUrls: ['./edit-pet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditPetPage implements OnInit {
  mascota: Pet | null = null;
  nombre = '';
  fichaNumero = '';
  edad: number | null = null;
  sexo = '';
  peso: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mascota = await this.petService.getMascotaById(id);
      if (this.mascota) {
        this.nombre = this.mascota.nombre;
        this.fichaNumero = this.mascota.fichaNumero ?? '';
        this.edad = this.mascota.edad;
        this.sexo = this.mascota.sexo;
        this.peso = this.mascota.peso ?? null;
      }
    }
  }

  async guardarCambios() {
    if (!this.mascota) return;
    try {
      await this.petService.updatePet(this.mascota.id, {
        nombre: this.nombre,
        fichaNumero: this.fichaNumero,
        edad: this.edad ?? 0,
        sexo: this.sexo,
        peso: this.peso ?? 0
      });
      this.showToast('Datos actualizados');
      this.router.navigate(['/pet-detail', this.mascota.id]);
    } catch (error: any) {
      this.showToast(error.message || 'Error al actualizar');
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

  cancelar() {
    if (this.mascota) {
      this.router.navigate(['/pet-detail', this.mascota.id]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}