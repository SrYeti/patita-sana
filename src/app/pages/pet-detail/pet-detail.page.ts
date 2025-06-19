import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { supabase } from '../../../environments/supabase-client';
import { SymptomService } from '../../services/symptom.service';
import { PetSymptom } from '../../models/pet-symptom.model';
import { SymptomListModalComponent } from '../symptom-list-modal/symptom-list-modal.component';
import { MedicalFilesModalComponent } from '../medical-files-modal/medical-files-modal.component';

function limpiarNombre(nombre: string): string {
  return nombre
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
}

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.page.html',
  styleUrls: ['./pet-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe,]
})
export class PetDetailPage implements OnInit {
  mascota: Pet | null = null;
  documentos: any[] = [];
  sintomas: PetSymptom[] = [];
  recientes: Array<any> = [];

  seleccionando = false;
  seleccionados = new Set<string>();

  @ViewChild('pdfInput', { static: false }) pdfInput!: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private symptomService: SymptomService,
    private router: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    await this.cargarMascota();
    await this.cargarDocumentos();
    await this.cargarSintomas();
    this.cargarRecientes();
  }

  async ionViewWillEnter() {
    await this.cargarMascota();
    await this.cargarDocumentos();
    await this.cargarSintomas();
    this.cargarRecientes();
  }

  private async cargarMascota() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mascota = await this.petService.getMascotaById(id);
    }
  }

  private async cargarDocumentos() {
    this.documentos = [];
    if (!this.mascota) return;
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('mascota_id', this.mascota.id)
      .order('fecha_subida', { ascending: false });
    if (!error && data) {
      this.documentos = (data ?? []).filter(doc => !!doc);
    }
  }

  private async cargarSintomas() {
    this.sintomas = [];
    if (!this.mascota) return;
    const sintomas = await this.symptomService.getSymptomsByPet(this.mascota.id);
    this.sintomas = (sintomas ?? []).filter(s => !!s);
  }

  cargarRecientes() {
    const docs = this.documentos.map(doc => ({
      tipo: 'documento',
      nombre: doc.nombre,
      fecha: new Date(doc.fecha_subida),
      file_path: doc.file_path // Usar file_path
    }));

    const sintomas = this.sintomas.map(sintoma => ({
      tipo: 'sintoma',
      descripcion: sintoma.descripcion,
      fecha: new Date(sintoma.fecha_creacion)
    }));

    this.recientes = [...docs, ...sintomas]
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
      .slice(0, 3);
  }

  // MODAL DE SÍNTOMAS CON MODALCONTROLLER
  async abrirModalSintomas() {
    const modal = await this.modalCtrl.create({
      component: SymptomListModalComponent,
      componentProps: {
        sintomas: this.sintomas,
        mascotaId: this.mascota?.id ?? ''
      }
    });
    modal.onDidDismiss().then(result => {
      if (result.data === 'nuevo' && this.mascota) {
        this.router.navigate(['/symptom-form', this.mascota.id]);
      }
    });
    await modal.present();
  }

  async abrirModalArchivos() {
    const modal = await this.modalCtrl.create({
      component: MedicalFilesModalComponent,
      componentProps: {
        documentos: this.documentos
      }
    });
    modal.onDidDismiss().then(result => {
      if (result.data === 'subir') {
        this.abrirSelectorPDF();
      }
    });
    await modal.present();
  }

  async abrirFormularioSintoma() {
    if (this.mascota) {
      this.router.navigate(['/symptom-form', this.mascota!.id]);
    }
  }

  abrirSelectorPDF() {
    this.pdfInput.nativeElement.value = '';
    this.pdfInput.nativeElement.click();
  }

  async onPDFSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file || !this.mascota) return;

    let nombreUsuario = prompt('Escribe un nombre para el archivo (sin tildes ni espacios):', file.name.replace('.pdf', ''));
    if (!nombreUsuario) return;
    nombreUsuario = limpiarNombre(nombreUsuario);

    const userId = this.mascota.user_id;
    const mascotaId = this.mascota.id;
    const filePath = `mascota_${mascotaId}/${Date.now()}_${nombreUsuario}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('documentos-mascotas')
      .upload(filePath, file);

    if (uploadError) {
      this.showToast('Error al subir el PDF');
      return;
    }

    // NO guardes el signed URL, solo el file_path
    const { error: insertError } = await supabase
      .from('documentos')
      .insert([{
        mascota_id: mascotaId,
        user_id: userId,
        nombre: nombreUsuario + '.pdf',
        file_path: filePath // <-- SOLO esto
      }]);

    if (insertError) {
      this.showToast('Error al guardar el documento');
      return;
    }

    this.showToast('Documento subido correctamente');
    await this.cargarDocumentos();
    this.cargarRecientes();
  }

  // Genera el signed URL al vuelo y abre el PDF
  async abrirPDF(filePath: string) {
    const { data, error } = await supabase
      .storage
      .from('documentos-mascotas')
      .createSignedUrl(filePath, 60 * 60); // 1 hora

    if (error || !data) {
      this.showToast('No se pudo abrir el PDF');
      return;
    }
    window.open(data.signedUrl, '_blank');
  }

  // --- Selección múltiple y eliminación ---
  onLongPress(docId: string) {
    this.seleccionando = true;
    this.toggleSeleccion(docId);
  }

  toggleSeleccion(docId: string) {
    if (this.seleccionados.has(docId)) {
      this.seleccionados.delete(docId);
    } else {
      this.seleccionados.add(docId);
    }
  }

  cancelarSeleccion() {
    this.seleccionando = false;
    this.seleccionados.clear();
  }

  async eliminarSeleccionados() {
    const docsAEliminar = this.documentos.filter(doc => this.seleccionados.has(doc.id));
    for (const doc of docsAEliminar) {
      // Elimina usando el file_path
      const path = doc.file_path;
      if (path) {
        await supabase.storage.from('documentos-mascotas').remove([path]);
      }
      await supabase.from('documentos').delete().eq('id', doc.id);
    }
    this.showToast('Archivos eliminados');
    this.cancelarSeleccion();
    await this.cargarDocumentos();
    this.cargarRecientes();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  editarMascota() {
    if (this.mascota) {
      this.router.navigate(['/edit-pet', this.mascota.id]);
    }
  }

  volverAHome() {
    this.router.navigate(['/home']);
  }

  calcularEdad(fechaNacimiento: string): string {
    if (!fechaNacimiento) return '';
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();

    let años = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();
    let dias = hoy.getDate() - nacimiento.getDate();

    if (dias < 0) {
      meses--;
      const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
      dias += mesAnterior.getDate();
    }
    if (meses < 0) {
      años--;
      meses += 12;
    }

    if (años > 0) {
      return `${años} año${años > 1 ? 's' : ''} ${meses} mes${meses !== 1 ? 'es' : ''}`;
    } else {
      return `${meses} mes${meses !== 1 ? 'es' : ''} ${dias} día${dias !== 1 ? 's' : ''}`;
    }
  }

  longPressTimeout: any = null;

  startLongPress(docId: string, event: Event) {
    this.longPressTimeout = setTimeout(() => {
      this.seleccionando = true;
      this.toggleSeleccion(docId);
    }, 500);
  }

  cancelLongPress() {
    clearTimeout(this.longPressTimeout);
  }

  async confirmarEliminarMascota() {
    const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta mascota? Se eliminarán todos sus archivos médicos.');
    if (confirm) {
      await this.eliminarMascota();
    }
  }

  async eliminarMascota() {
    if (!this.mascota) return;

    const { data: docs } = await supabase
      .from('documentos')
      .select('*')
      .eq('mascota_id', this.mascota.id);

    if (docs && docs.length > 0) {
      for (const doc of docs) {
        const path = doc.file_path;
        if (path) {
          await supabase.storage.from('documentos-mascotas').remove([path]);
        }
        await supabase.from('documentos').delete().eq('id', doc.id);
      }
    }

    if (this.mascota.fotoUrl) {
      try {
        const fotoUrl = new URL(this.mascota.fotoUrl);
        const match = fotoUrl.pathname.match(/\/object\/(?:sign\/|public\/)?([a-zA-Z0-9-_]+)\/(.+)$/);
        if (match) {
          const bucket = match[1];
          const path = decodeURIComponent(match[2]);
          await supabase.storage.from(bucket).remove([path]);
        }
      } catch (e) {}
    }

    await supabase.from('mascotas').delete().eq('id', this.mascota.id);

    this.showToast('Mascota eliminada');
    this.router.navigate(['/home']);
  }
}