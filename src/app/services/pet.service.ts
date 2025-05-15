import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Pet } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async addPet(pet: Omit<Pet, 'id'>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const mascotasRef = collection(this.firestore, 'mascotas');
    await addDoc(mascotasRef, {
      ...pet,
      uid: user.uid
    });
  }
}