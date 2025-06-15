import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-symptom-form',
  templateUrl: './symptom-form.page.html',
  styleUrls: ['./symptom-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SymptomFormPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
