import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DoctorService } from '../../../core/services/doctor.service';
import { DoctorResponse } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatSlideToggleModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-7xl mx-auto p-6">
      @if (!doctor) {
        <div class="flex justify-center p-12">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      }

      @if (doctor && !doctor.isVerified) {
        <mat-card class="bg-amber-50! border-amber-200!">
          <mat-card-content class="text-center! py-6!">
            <mat-icon class="text-5xl! text-amber-500! mb-2!">hourglass_empty</mat-icon>
            <p class="text-amber-700 text-lg font-semibold mb-2">Waiting for Admin Approval</p>
            <p class="text-amber-600 text-sm">Your account is under review. You will be able to access the dashboard once approved.</p>
          </mat-card-content>
        </mat-card>
      }

      @if (doctor && doctor.isVerified) {
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
          <div class="flex items-center gap-3">
            <mat-slide-toggle [checked]="doctor.isAvailable" (change)="toggleAvailability()" color="primary">
              {{ doctor.isAvailable ? 'Available' : 'Unavailable' }}
            </mat-slide-toggle>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <mat-card>
            <mat-card-content class="py-4!">
              <div class="flex items-center gap-3">
                <mat-icon class="text-blue-600!">medical_services</mat-icon>
                <div>
                  <p class="text-sm text-gray-500">Speciality</p>
                  <p class="text-lg font-semibold text-gray-800">{{ doctor.speciality }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-content class="py-4!">
              <div class="flex items-center gap-3">
                <mat-icon class="text-green-600!">payments</mat-icon>
                <div>
                  <p class="text-sm text-gray-500">Consultation Fee</p>
                  <p class="text-lg font-semibold text-gray-800">{{ doctor.fees | currency:'INR' }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-content class="py-4!">
              <div class="flex items-center gap-3">
                <mat-icon class="text-purple-600!">location_on</mat-icon>
                <div>
                  <p class="text-sm text-gray-500">Location</p>
                  <p class="text-lg font-semibold text-gray-800">{{ doctor.location || 'Not set' }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="flex gap-4">
          <a mat-flat-button color="primary" routerLink="/doctor/appointments">
            <mat-icon>event</mat-icon> View Appointments
          </a>
          <a mat-stroked-button routerLink="/doctor/profile">
            <mat-icon>edit</mat-icon> Edit Profile
          </a>
        </div>
      }
    </div>
  `
})
export class DoctorDashboardComponent implements OnInit {
  doctor: DoctorResponse | null = null;

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.doctorService.getMyProfile().subscribe(d => this.doctor = d);
  }

  toggleAvailability() {
    if (!this.doctor) return;
    const newVal = !this.doctor.isAvailable;
    this.doctorService.updateAvailability(newVal).subscribe(() => {
      this.doctor!.isAvailable = newVal;
    });
  }
}
