import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
          <ion-checkbox
            slot="start"
            [(ngModel)]="seleccionados[sintoma.id]"
            (ionChange)="onSeleccionChange()"
          ></ion-checkbox>
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
    <ion-footer *ngIf="idsSeleccionados.length > 0">
      <ion-toolbar>
        <ion-button expand="block" color="danger" (click)="eliminarSeleccionados()">
          Eliminar ({{ idsSeleccionados.length }})
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SymptomListModalComponent {
  // Entradas y salidas del componente
  @Input() sintomas: PetSymptom[] = [];
  @Input() mascotaId: string = '';
  @Output() eliminar = new EventEmitter<string[]>();

  // Estado de selección de síntomas
  seleccionados: { [id: string]: boolean } = {};

  // Devuelve los IDs seleccionados
  get idsSeleccionados(): string[] {
    return Object.keys(this.seleccionados).filter(id => this.seleccionados[id]);
  }

  constructor(private modalCtrl: ModalController) {}

  // Cierra el modal
  cerrar() {
    this.modalCtrl.dismiss();
  }

  // Solicita agregar un nuevo síntoma
  nuevoSintoma() {
    this.modalCtrl.dismiss('nuevo');
  }

  // Refresca la vista al cambiar la selección
  onSeleccionChange() {
    // Solo refresca la vista
  }

  // Elimina los síntomas seleccionados
  eliminarSeleccionados() {
    this.modalCtrl.dismiss({ eliminar: this.idsSeleccionados });
  }
}