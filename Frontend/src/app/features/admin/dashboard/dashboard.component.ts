import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardData } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      @if (!data) {
        <div class="flex justify-center p-12">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <mat-card>
            <mat-card-content class="text-center! py-6!">
              <mat-icon class="text-4xl! text-blue-600! mb-2!">medical_services</mat-icon>
              <p class="text-sm text-gray-500 mb-1">Total Doctors</p>
              <p class="text-3xl font-bold text-blue-600">{{ data.totalDoctors }}</p>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-content class="text-center! py-6!">
              <mat-icon class="text-4xl! text-green-600! mb-2!">people</mat-icon>
              <p class="text-sm text-gray-500 mb-1">Total Patients</p>
              <p class="text-3xl font-bold text-green-600">{{ data.totalPatients }}</p>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-content class="text-center! py-6!">
              <mat-icon class="text-4xl! text-purple-600! mb-2!">calendar_month</mat-icon>
              <p class="text-sm text-gray-500 mb-1">Total Appointments</p>
              <p class="text-3xl font-bold text-purple-600">{{ data.totalAppointments }}</p>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="flex gap-4">
          <a mat-flat-button color="primary" routerLink="/admin/doctors">
            <mat-icon>medical_services</mat-icon> View All Doctors
          </a>
          <a mat-flat-button color="accent" routerLink="/admin/patients">
            <mat-icon>people</mat-icon> View All Patients
          </a>
          <a mat-stroked-button routerLink="/admin/doctor-approval">
            <mat-icon>verified</mat-icon> Pending Approvals
          </a>
        </div>
      }
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  data: DashboardData | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getDashboard().subscribe(d => this.data = d);
  }
}
