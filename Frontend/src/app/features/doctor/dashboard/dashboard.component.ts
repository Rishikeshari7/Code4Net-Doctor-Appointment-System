import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { DoctorResponse } from '../../../core/models/models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CurrencyPipe, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      @if (doctor && !doctor.isVerified) {
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <p class="text-amber-700 text-lg font-semibold mb-2">Waiting for Admin Approval</p>
          <p class="text-amber-600 text-sm">Your account is under review. You will be able to access the dashboard once approved.</p>
        </div>
      }

      @if (doctor && doctor.isVerified) {
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">Availability:</span>
            <button (click)="toggleAvailability()"
              [class]="doctor.isAvailable
                ? 'bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-200'
                : 'bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-200'">
              {{ doctor.isAvailable ? 'Available' : 'Unavailable' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p class="text-sm text-gray-500 mb-1">Speciality</p>
            <p class="text-lg font-semibold text-gray-800">{{ doctor.speciality }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p class="text-sm text-gray-500 mb-1">Consultation Fee</p>
            <p class="text-lg font-semibold text-gray-800">{{ doctor.fees | currency:'INR' }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p class="text-sm text-gray-500 mb-1">Location</p>
            <p class="text-lg font-semibold text-gray-800">{{ doctor.location || 'Not set' }}</p>
          </div>
        </div>

        <div class="flex gap-4">
          <a routerLink="/doctor/appointments" class="bg-blue-50 text-blue-600 px-5 py-3 rounded-lg hover:bg-blue-100 font-medium text-sm">View Appointments</a>
          <a routerLink="/doctor/profile" class="bg-gray-50 text-gray-600 px-5 py-3 rounded-lg hover:bg-gray-100 font-medium text-sm">Edit Profile</a>
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
