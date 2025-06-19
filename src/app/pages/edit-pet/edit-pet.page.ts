import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';
import { supabase } from '../../../environments/supabase-client';

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
  fechaNacimiento: string = '';
  sexo = '';
  peso: number | null = null;
  nuevaFotoUrl: string | null = null; // Para guardar la nueva foto si se sube

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
        this.fechaNacimiento = this.mascota.fechaNacimiento ?? '';
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
        fechaNacimiento: this.fechaNacimiento,
        sexo: this.sexo,
        peso: this.peso ?? 0,
        // Si se subió una nueva foto, actualiza el campo fotoUrl
        ...(this.nuevaFotoUrl ? { fotoUrl: this.nuevaFotoUrl } : {})
      });
      this.showToast('Datos actualizados');
      this.router.navigate(['/pet-detail', this.mascota.id]);
    } catch (error: any) {
      this.showToast(error.message || 'Error al actualizar');
    }
  }

  async onFotoSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file || !this.mascota) return;

    const filePath = `mascota_${this.mascota.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('fotos-mascotas')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      this.showToast('Error al subir la foto');
      return;
    }

    // Obtén la URL pública de la foto
    const { data } = supabase.storage
      .from('fotos-mascotas')
      .getPublicUrl(filePath);

    if (data && data.publicUrl) {
      this.nuevaFotoUrl = data.publicUrl;
      this.showToast('Foto subida correctamente');
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