import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.page').then( m => m.NotFoundPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'add-pet',
    loadComponent: () => import('./pages/add-pet/add-pet.page').then( m => m.AddPetPage)
  },
  {
    path: 'pet-detail/:id',
    loadComponent: () => import('./pages/pet-detail/pet-detail.page').then( m => m.PetDetailPage)
  },
  {
    path: 'edit-pet',
    loadComponent: () => import('./pages/edit-pet/edit-pet.page').then( m => m.EditPetPage)
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
  
];