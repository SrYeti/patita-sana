import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NotFoundPage {
  constructor(
    private router: Router,
    private supabaseAuth: SupabaseAuthService
  ) {}

  goHome() {
    this.router.navigate(['/home']);
  }

  async logout() {
    await this.supabaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}