import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <a routerLink="/" class="text-xl font-bold text-blue-600">HospitalBook</a>

          @if (auth.isLoggedIn()) {
            <div class="flex items-center gap-4">
              @if (auth.getRole() === 'ADMIN') {
                <a routerLink="/admin/dashboard" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">Dashboard</a>
                <a routerLink="/admin/doctors" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">Doctors</a>
                <a routerLink="/admin/patients" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">Patients</a>
                <a routerLink="/admin/doctor-approval" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">Approvals</a>
              }
              @if (auth.getRole() === 'DOCTOR') {
                <a routerLink="/doctor/dashboard" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">Dashboard</a>
                <a routerLink="/doctor/appointments" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">Appointments</a>
                <a routerLink="/doctor/profile" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">Profile</a>
              }
              @if (auth.getRole() === 'PATIENT') {
                <a routerLink="/patient/dashboard" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">Doctors</a>
                <a routerLink="/patient/my-bookings" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">My Bookings</a>
                <a routerLink="/patient/profile" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600 text-sm font-medium">Profile</a>
              }
              <span class="text-sm text-gray-500 ml-2">{{ auth.getUser()?.name }}</span>
              <button (click)="auth.logout()" class="text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer">Logout</button>
            </div>
          } @else {
            <div class="flex items-center gap-3">
              <a routerLink="/login" class="text-sm text-gray-600 hover:text-blue-600 font-medium">Login</a>
              <a routerLink="/register" class="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">Register</a>
            </div>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
