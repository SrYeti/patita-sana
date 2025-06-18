import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SymptomService } from '../../services/symptom.service'; // Ajusta el path si es necesario
import { SupabaseAuthService } from '../../services/supabase-auth.service'; // Ajusta el path si es necesario
import { PetSymptom } from '../../models/pet-symptom.model';

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
    IonIcon,
    IonDatetime,
  ],
})
export class SymptomFormPage implements OnInit {
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

  async ngOnInit() {
    // Obtener el id de la mascota desde la URL
    this.currentPetId = this.route.snapshot.paramMap.get('id') ?? '';

    // Obtener el id del usuario autenticado
    const { data } = await this.authService.getCurrentUser();
    this.currentUserId = data?.user?.id ?? '';
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
      const symptomData: PetSymptom = {
        id: '', // Supabase lo genera
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
      } catch (error) {
        await this.presentToast('Error al guardar');
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
}