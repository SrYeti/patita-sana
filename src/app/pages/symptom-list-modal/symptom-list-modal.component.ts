import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PetSymptom } from '../../models/pet-symptom.model';

@Component({
  selector: 'app-symptom-list-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Síntomas</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">X</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button expand="block" (click)="nuevoSintoma()">
        Nuevo síntoma
      </ion-button>
      <ion-list>
        <ion-item *ngFor="let sintoma of sintomas">
          <ion-label>
            <strong>{{ sintoma.fecha_creacion | date: 'short' }}</strong><br />
            {{ sintoma.descripcion }}
            <div *ngIf="sintoma.notas">
              <small>Notas: {{ sintoma.notas }}</small>
            </div>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-text *ngIf="sintomas.length === 0">
        <p>No hay síntomas registrados.</p>
      </ion-text>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SymptomListModalComponent {
  @Input() sintomas: PetSymptom[] = [];
  @Input() mascotaId: string = '';

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  nuevoSintoma() {
    this.modalCtrl.dismiss('nuevo');
  }
}