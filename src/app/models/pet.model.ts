export interface Pet {
  id: string;
  nombre: string;
  edad: number;
  sexo: string;
  peso?: number;
  fotoUrl?: string;           // URL de la foto subida
  fichaNumero?: string;
  fichaArchivoUrl?: string;   // URL del PDF de la ficha
}