import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { SupabaseAuthService } from '../../services/supabase-auth.service';
import { supabase } from '../../../environments/supabase-client';

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
  fechaNacimiento: string = ''; // Cambiado aquí
  sexo = '';
  peso: number | null = null;
  fotoFile: File | null = null;

  constructor(
    private petService: PetService,
    private supabaseAuth: SupabaseAuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  onFotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoFile = file;
    }
  }

  async onAddPet() {
    try {
      // Obtener el usuario actual
      const { data } = await this.supabaseAuth.getCurrentUser();
      const userId = data?.user?.id;
      if (!userId) {
        this.showToast('Usuario no autenticado');
        return;
      }

      let fotoUrl: string | null = null;
      if (this.fotoFile) {
        // Subir la foto a Supabase Storage
        const filePath = `mascotas/${userId}/${Date.now()}_${this.fotoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('fotos-mascotas')
          .upload(filePath, this.fotoFile);
        if (uploadError) throw uploadError;
        // Obtener la URL pública
        const { data: publicUrlData } = supabase.storage
          .from('fotos-mascotas')
          .getPublicUrl(filePath);
        fotoUrl = publicUrlData.publicUrl;
      }

      await this.petService.addPet({
        nombre: this.nombre,
        fichaNumero: this.fichaNumero,
        fechaNacimiento: this.fechaNacimiento, // Cambiado aquí
        sexo: this.sexo,
        peso: this.peso ?? 0,
        fotoUrl: fotoUrl ?? undefined,
        user_id: userId
      }, userId);
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