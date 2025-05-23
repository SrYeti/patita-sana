export interface Pet {
  id: string;
  nombre: string;
  fechaNacimiento: string; // Nueva propiedad (ISO string)
  sexo: string;
  peso?: number;
  fotoUrl?: string;
  fichaNumero?: string;
  fichaArchivoUrl?: string;
}