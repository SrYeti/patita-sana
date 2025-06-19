import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

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
          <ion-label>
            <strong>{{ doc.nombre }}</strong><br />
            <small>{{ doc.fecha_subida | date: 'short' }}</small>
          </ion-label>
          <ion-button fill="clear" (click)="verPDF(doc.url)">
            Ver PDF
          </ion-button>
        </ion-item>
      </ion-list>
      <ion-text *ngIf="documentos.length === 0">
        <p>No hay documentos médicos registrados.</p>
      </ion-text>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MedicalFilesModalComponent {
  @Input() documentos: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  subirDocumento() {
    this.modalCtrl.dismiss('subir');
  }

  verPDF(url: string) {
    window.open(url, '_blank');
  }
}