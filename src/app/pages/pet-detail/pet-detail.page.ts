import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.page.html',
  styleUrls: ['./pet-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PetDetailPage implements OnInit {
  mascota: Pet | null = null;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mascota = await this.petService.getMascotaById(id);
    }
  }

  editarMascota() {
    if (this.mascota) {
      this.router.navigate(['/edit-pet', this.mascota.id]);
    }
  }

  verDocumentos() {
    // Aquí luego puedes navegar a la página de documentos
    // this.router.navigate(['/pet-documents', this.mascota?.id]);
  }

  agregarDocumento() {
    // Aquí luego puedes abrir el flujo para subir documentos
    // this.router.navigate(['/add-document', this.mascota?.id]);
  }
}