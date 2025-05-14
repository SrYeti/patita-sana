import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

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
  fotoFile: File | null = null;
  fichaFile: File | null = null;

  onFotoSelected(event: any) {
    this.fotoFile = event.target.files[0];
  }

  onFichaSelected(event: any) {
    this.fichaFile = event.target.files[0];
  }

  onAddPet() {
    // Aquí luego pondremos la lógica para guardar la mascota y subir archivos
    console.log('Mascota:', {
      nombre: this.nombre,
      fichaNumero: this.fichaNumero,
      edad: this.edad,
      sexo: this.sexo,
      peso: this.peso,
      fotoFile: this.fotoFile,
      fichaFile: this.fichaFile
    });
  }
}