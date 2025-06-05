import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { supabase } from '../../../environments/supabase-client';

// --- Función para limpiar el nombre del archivo ---
function limpiarNombre(nombre: string): string {
  return nombre
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-zA-Z0-9_-]/g, '_'); // solo letras, números, guion y guion bajo
}

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.page.html',
  styleUrls: ['./pet-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class PetDetailPage implements OnInit {
  mascota: Pet | null = null;
  documentos: any[] = [];

  seleccionando = false;
  seleccionados = new Set<string>();

  @ViewChild('pdfInput', { static: false }) pdfInput!: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.cargarMascota();
    await this.cargarDocumentos();
  }

  async ionViewWillEnter() {
    await this.cargarMascota();
    await this.cargarDocumentos();
  }

  private async cargarMascota() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mascota = await this.petService.getMascotaById(id);
    }
  }

  private async cargarDocumentos() {
    if (!this.mascota) return;
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('mascota_id', this.mascota.id)
      .order('fecha_subida', { ascending: false });
    if (!error && data) {
      this.documentos = data;
    }
  }

  abrirSelectorPDF() {
    this.pdfInput.nativeElement.value = '';
    this.pdfInput.nativeElement.click();
  }

  async onPDFSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file || !this.mascota) return;

    // 1. Pedir nombre al usuario
    let nombreUsuario = prompt('Escribe un nombre para el archivo (sin tildes ni espacios):', file.name.replace('.pdf', ''));
    if (!nombreUsuario) return;
    nombreUsuario = limpiarNombre(nombreUsuario);

    const userId = this.mascota.user_id;
    const mascotaId = this.mascota.id;
    const filePath = `mascota_${mascotaId}/${Date.now()}_${nombreUsuario}.pdf`;

    // 2. Subir el PDF a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documentos-mascotas')
      .upload(filePath, file);

    if (uploadError) {
      this.showToast('Error al subir el PDF');
      return;
    }

    // 3. Obtener la signed URL (válida por 1 hora)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('documentos-mascotas')
      .createSignedUrl(filePath, 60 * 60);

    if (signedUrlError || !signedUrlData) {
      this.showToast('Error al obtener la URL del PDF');
      return;
    }

    const url = signedUrlData.signedUrl;

    // 4. Guardar el registro en la tabla documentos
    const { error: insertError } = await supabase
      .from('documentos')
      .insert([{
        mascota_id: mascotaId,
        user_id: userId,
        nombre: nombreUsuario + '.pdf',
        url: url
      }]);

    if (insertError) {
      this.showToast('Error al guardar el documento');
      return;
    }

    this.showToast('Documento subido correctamente');
    await this.cargarDocumentos();
  }

  abrirPDF(url: string) {
    window.open(url, '_blank');
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
      // Extrae el path del archivo desde la URL firmada (signed URL)
      const url = new URL(doc.url);
      const match = url.pathname.match(/\/object\/sign\/documentos-mascotas\/(.+)$/);
      const path = match ? decodeURIComponent(match[1]) : '';
      if (path) {
        await supabase.storage.from('documentos-mascotas').remove([path]);
      }
      await supabase.from('documentos').delete().eq('id', doc.id);
    }
    this.showToast('Archivos eliminados');
    this.cancelarSeleccion();
    await this.cargarDocumentos();
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
      // Suma los días del mes anterior
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
    }, 500); // 500 ms para long press
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

    // 1. Elimina todos los documentos de la mascota (de Storage y tabla)
    const { data: docs } = await supabase
      .from('documentos')
      .select('*')
      .eq('mascota_id', this.mascota.id);

    if (docs && docs.length > 0) {
      for (const doc of docs) {
        // Extrae el path del archivo desde la URL firmada
        const url = new URL(doc.url);
        const match = url.pathname.match(/\/object\/sign\/documentos-mascotas\/(.+)$/);
        const path = match ? decodeURIComponent(match[1]) : '';
        if (path) {
          await supabase.storage.from('documentos-mascotas').remove([path]);
        }
        await supabase.from('documentos').delete().eq('id', doc.id);
      }
    }

    // 2. Elimina la foto de la mascota si existe
    if (this.mascota.fotoUrl) {
      try {
        const fotoUrl = new URL(this.mascota.fotoUrl);
        // Regex mejorado para buckets públicos y privados
        const match = fotoUrl.pathname.match(/\/object\/(?:sign\/|public\/)?([a-zA-Z0-9-_]+)\/(.+)$/);
        if (match) {
          const bucket = match[1];
          const path = decodeURIComponent(match[2]);
          await supabase.storage.from(bucket).remove([path]);
        }
      } catch (e) {
        // Si la foto no es de Supabase Storage, ignora
      }
    }

    // 3. Elimina la mascota de la tabla mascotas
    await supabase.from('mascotas').delete().eq('id', this.mascota.id);

    this.showToast('Mascota eliminada');
    this.router.navigate(['/home']);
  }
}