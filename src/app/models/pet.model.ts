export interface Pet {
  id: string;
  nombre: string;
  sexo: string;
  peso: number;
  fichaNumero: string;
  user_id: string; // <-- agrega esta línea
  fotoUrl?: string;
  fechaNacimiento: string;
}