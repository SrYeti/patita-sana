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
          <ion-button (click)="cerrar()" fill="clear" class="cerrar-svg-btn">
            <svg
              class="icon-cerrar"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                opacity="0.5"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-button expand="block" (click)="nuevoSintoma()">
        Nuevo síntoma
      </ion-button>
      <ion-list class="sintomas-lista-modal">
        <ion-item *ngFor="let sintoma of sintomas" class="sintoma-item-modal">
          <ion-checkbox
            slot="start"
            [(ngModel)]="seleccionados[sintoma.id]"
            (ionChange)="onSeleccionChange()"
          ></ion-checkbox>
          <ion-label class="sintoma-label-modal">
            <strong>{{ sintoma.fecha_creacion | date : 'short' }}</strong
            ><br />
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
        <ion-button
          expand="block"
          color="danger"
          (click)="eliminarSeleccionados()"
        >
          Eliminar ({{ idsSeleccionados.length }})
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styleUrls: ['./symptom-list-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
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
    return Object.keys(this.seleccionados).filter(
      (id) => this.seleccionados[id]
    );
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
