import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Admin
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard('ADMIN')]
  },
  {
    path: 'admin/doctor-approval',
    loadComponent: () => import('./features/admin/doctor-approval/doctor-approval.component').then(m => m.DoctorApprovalComponent),
    canActivate: [authGuard, roleGuard('ADMIN')]
  },
  {
    path: 'admin/doctors',
    loadComponent: () => import('./features/admin/doctors-list/doctors-list.component').then(m => m.DoctorsListComponent),
    canActivate: [authGuard, roleGuard('ADMIN')]
  },
  {
    path: 'admin/patients',
    loadComponent: () => import('./features/admin/patients-list/patients-list.component').then(m => m.PatientsListComponent),
    canActivate: [authGuard, roleGuard('ADMIN')]
  },

  // Doctor
  {
    path: 'doctor/dashboard',
    loadComponent: () => import('./features/doctor/dashboard/dashboard.component').then(m => m.DoctorDashboardComponent),
    canActivate: [authGuard, roleGuard('DOCTOR')]
  },
  {
    path: 'doctor/appointments',
    loadComponent: () => import('./features/doctor/appointments/appointments.component').then(m => m.DoctorAppointmentsComponent),
    canActivate: [authGuard, roleGuard('DOCTOR')]
  },
  {
    path: 'doctor/profile',
    loadComponent: () => import('./features/doctor/profile/profile.component').then(m => m.DoctorProfileComponent),
    canActivate: [authGuard, roleGuard('DOCTOR')]
  },

  // Patient
  {
    path: 'patient/dashboard',
    loadComponent: () => import('./features/patient/dashboard/dashboard.component').then(m => m.PatientDashboardComponent),
    canActivate: [authGuard, roleGuard('PATIENT')]
  },
  {
    path: 'patient/book/:id',
    loadComponent: () => import('./features/patient/book-appointment/book-appointment.component').then(m => m.BookAppointmentComponent),
    canActivate: [authGuard, roleGuard('PATIENT')]
  },
  {
    path: 'patient/my-bookings',
    loadComponent: () => import('./features/patient/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
    canActivate: [authGuard, roleGuard('PATIENT')]
  },
  {
    path: 'patient/profile',
    loadComponent: () => import('./features/patient/profile/profile.component').then(m => m.PatientProfileComponent),
    canActivate: [authGuard, roleGuard('PATIENT')]
  },

  // Wildcard
  { path: '**', redirectTo: '/login' }
];
