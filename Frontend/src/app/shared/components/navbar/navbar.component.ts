import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="bg-white! shadow-sm! border-b border-gray-200 h-16!">
      <div class="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
        <a routerLink="/" class="flex items-center gap-2 no-underline">
          <mat-icon class="text-blue-600!">local_hospital</mat-icon>
          <span class="text-xl font-bold text-blue-600">HospitalBook</span>
        </a>

        @if (auth.isLoggedIn()) {
          <div class="flex items-center gap-1">
            @if (auth.getRole() === 'ADMIN') {
              <a mat-button routerLink="/admin/dashboard" routerLinkActive="text-blue-600!">Dashboard</a>
              <a mat-button routerLink="/admin/doctors" routerLinkActive="text-blue-600!">Doctors</a>
              <a mat-button routerLink="/admin/patients" routerLinkActive="text-blue-600!">Patients</a>
              <a mat-button routerLink="/admin/doctor-approval" routerLinkActive="text-blue-600!">Approvals</a>
            }
            @if (auth.getRole() === 'DOCTOR') {
              <a mat-button routerLink="/doctor/dashboard" routerLinkActive="text-blue-600!">Dashboard</a>
              <a mat-button routerLink="/doctor/appointments" routerLinkActive="text-blue-600!">Appointments</a>
              <a mat-button routerLink="/doctor/profile" routerLinkActive="text-blue-600!">Profile</a>
            }
            @if (auth.getRole() === 'PATIENT') {
              <a mat-button routerLink="/patient/dashboard" routerLinkActive="text-blue-600!">Doctors</a>
              <a mat-button routerLink="/patient/my-bookings" routerLinkActive="text-blue-600!">My Bookings</a>
              <a mat-button routerLink="/patient/profile" routerLinkActive="text-blue-600!">Profile</a>
            }
            <span class="text-sm text-gray-500 ml-3">{{ auth.getUser()?.name }}</span>
            <button mat-button color="warn" (click)="auth.logout()">
              <mat-icon>logout</mat-icon> Logout
            </button>
          </div>
        } @else {
          <div class="flex items-center gap-2">
            <a mat-button routerLink="/login">Login</a>
            <a mat-flat-button color="primary" routerLink="/register">Register</a>
          </div>
        }
      </div>
    </mat-toolbar>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
