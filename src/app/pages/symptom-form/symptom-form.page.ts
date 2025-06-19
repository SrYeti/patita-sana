import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SymptomService } from '../../services/symptom.service';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

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
  IonTextarea,
  IonToggle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-symptom-form',
  templateUrl: './symptom-form.page.html',
  styleUrls: ['./symptom-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    IonDatetime,
    IonTextarea,
    IonToggle,
  ],
})
export class SymptomFormPage implements OnInit {
  // Propiedades del formulario
  symptomForm: FormGroup = this.fb.group({});
  currentDateTime = new Date().toISOString();
  currentPetId: string = '';
  currentUserId: string = '';

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private symptomService: SymptomService,
    private authService: SupabaseAuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  // Inicializa el formulario y obtiene los IDs necesarios
  async ngOnInit() {
    this.currentPetId = this.route.snapshot.paramMap.get('id') ?? '';
    const { data } = await this.authService.getCurrentUser();
    this.currentUserId = data?.user?.id ?? '';
  }

  // Inicializa los controles del formulario
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

  // Envía el formulario para guardar el síntoma
  async onSubmit() {
    if (this.symptomForm.valid) {
      // NO enviar el campo id
      const symptomData = {
        mascota_id: this.currentPetId,
        user_id: this.currentUserId,
        fecha_creacion: this.symptomForm.value.dateTime,
        descripcion: this.symptomForm.value.description,
        vomitos: this.symptomForm.value.hasVomited,
        ha_comido: this.symptomForm.value.hasEaten,
        ha_bebido: this.symptomForm.value.hasDrunkWater,
        notas: this.symptomForm.value.notes,
      };

      try {
        await this.symptomService.addSymptom(symptomData);
        await this.presentToast('Registro guardado exitosamente');
        this.router.navigate(['/pet-detail', this.currentPetId]);
      } catch (error: any) {
        console.error('Error al guardar síntoma:', error);
        await this.presentToast('Error al guardar: ' + (error?.message || ''));
      }
    }
  }

  // Muestra un mensaje toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  // Vuelve al detalle de la mascota
  volverAPetDetail() {
    this.router.navigate(['/pet-detail', this.currentPetId]);
  }
}