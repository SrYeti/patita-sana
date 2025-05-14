import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-pet',
  templateUrl: './edit-pet.page.html',
  styleUrls: ['./edit-pet.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EditPetPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
