import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Pet } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  mascotas: Pet[] = [];
  userId: string | null = null;

  constructor(
    private petService: PetService,
    private supabaseAuth: SupabaseAuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const { data } = await this.supabaseAuth.getCurrentUser();
    if (data?.user) {
      this.userId = data.user.id;
      await this.cargarMascotas();
    } else {
      this.mascotas = [];
      this.userId = null;
      this.router.navigate(['/login']);
    }
  }

  async cargarMascotas() {
    if (!this.userId) return;
    this.mascotas = await this.petService.getMascotas(this.userId);
  }

  irAAgregarMascota() {
    this.router.navigate(['/add-pet']);
  }

  verDetalleMascota(id: string) {
    this.router.navigate(['/pet-detail', id]);
  }

  async logout() {
    await this.supabaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}