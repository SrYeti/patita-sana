import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  mascotas: Pet[] = [];
  user: User | null = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      this.user = user;
      if (this.user) {
        await this.cargarMascotas();
      } else {
        this.mascotas = [];
      }
    });
  }

  async cargarMascotas() {
    if (!this.user) return;
    const mascotasRef = collection(this.firestore, 'mascotas');
    const q = query(mascotasRef, where('uid', '==', this.user.uid));
    const querySnapshot = await getDocs(q);
    this.mascotas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
  }

  irAAgregarMascota() {
    this.router.navigate(['/add-pet']);
  }

  verDetalleMascota(id: string) {
    this.router.navigate(['/pet-detail', id]);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}