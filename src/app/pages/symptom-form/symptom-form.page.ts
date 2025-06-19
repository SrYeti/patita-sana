import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonLabel,
  IonBackButton,
  IonItem,
  IonList,
  IonButton,
  IonIcon,
  IonListHeader,
  IonDatetime,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-symptom-form',
  templateUrl: './symptom-form.page.html',
  styleUrls: ['./symptom-form.page.scss'],
  standalone: true,
  imports: [
    IonListHeader,
    IonButton,
    IonList,
    IonItem,
    IonBackButton,
    IonLabel,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonButtons,
    IonLabel,
    IonBackButton,
    IonToolbar,
    IonIcon,
    IonListHeader,
    IonDatetime,
  ],
})
export class SymptomFormPage implements OnInit {
  symptomForm: FormGroup = this.fb.group({}); // Inicializado aquí
  currentDateTime = new Date().toISOString();
  constructor(
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    this.initForm();
  }
  initForm() {
    this.symptomForm = this.fb.group({
      dateTime: [this.currentDateTime, Validators.required],
      description: ['', Validators.required],
      hasVomited: [false],
      hasEaten: [false],
      hasDrunkWater: [false],
      notes: [''],
    });
  }

  async onSubmit() {
    if (this.symptomForm.valid) {
      const symptomData = {
        //mascota_id: this.currentPetId, // Debes obtener esto de tu página anterior
        //user_id: this.currentUserId, // Obtenido de tu servicio de autenticación
        fecha_creacion: new Date().toISOString(),
        descripcion: this.symptomForm.value.description,
        vomitos: this.symptomForm.value.hasVomited,
        ha_comido: this.symptomForm.value.hasEaten,
        ha_bebido: this.symptomForm.value.hasDrunkWater,
        notas: this.symptomForm.value.notes,
      };

      try {
        //await this.symptomService.addSymptom(symptomData);
        await this.presentToast('Registro guardado exitosamente');
        //this.router.navigate(['/medical-file', this.currentPetId]);
      } catch (error) {
        //await this.presentToast('Error al guardar', 'danger');
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }
  ngOnInit() {
    // Puedes dejar esto vacío o añadir lógica de inicialización
  }
}
