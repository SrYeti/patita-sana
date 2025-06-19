import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- AGREGA ESTO

@Component({
  selector: 'app-medical-files-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Archivos médicos</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">X</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button expand="block" (click)="subirDocumento()">
        Subir documento PDF
      </ion-button>
      <ion-list>
        <ion-item *ngFor="let doc of documentos">
          <ion-checkbox
            slot="start"
            [(ngModel)]="seleccionados[doc.id]"
            (ionChange)="onSeleccionChange()"
          ></ion-checkbox>
          <ion-label>
            <strong>{{ doc.nombre }}</strong><br />
            <small>{{ doc.fecha_subida | date: 'short' }}</small>
          </ion-label>
          <ion-button fill="clear" (click)="verPDF(doc.file_path)">
            Ver PDF
          </ion-button>
        </ion-item>
      </ion-list>
      <ion-text *ngIf="documentos.length === 0">
        <p>No hay documentos médicos registrados.</p>
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
  imports: [IonicModule, CommonModule, FormsModule] // <-- AGREGA FormsModule AQUÍ
})
export class MedicalFilesModalComponent {
  @Input() documentos: any[] = [];
  @Output() eliminar = new EventEmitter<string[]>();

  seleccionados: { [id: string]: boolean } = {};

  get idsSeleccionados(): string[] {
    return Object.keys(this.seleccionados).filter(id => this.seleccionados[id]);
  }

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  subirDocumento() {
    this.modalCtrl.dismiss('subir');
  }

  verPDF(filePath: string) {
    this.modalCtrl.dismiss({ verPDF: filePath });
  }

  onSeleccionChange() {
    // Solo para refrescar la vista
  }

  eliminarSeleccionados() {
    this.modalCtrl.dismiss({ eliminar: this.idsSeleccionados });
  }
}