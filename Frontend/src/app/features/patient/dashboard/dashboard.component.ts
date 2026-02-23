import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { SpecialityService } from '../../../core/services/speciality.service';
import { DoctorResponse, Speciality } from '../../../core/models/models';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Find a Doctor</h1>

      <div class="mb-6">
        <select [(ngModel)]="selectedSpeciality" (ngModelChange)="onFilter()" name="speciality"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
          <option [ngValue]="null">All Specialities</option>
          @for (s of specialities; track s.id) {
            <option [ngValue]="s.id">{{ s.name }}</option>
          }
        </select>
      </div>

      @if (doctors.length === 0) {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          No doctors available
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (doc of doctors; track doc.id) {
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {{ doc.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800">{{ doc.name }}</p>
                  <p class="text-sm text-blue-600">{{ doc.speciality }}</p>
                </div>
              </div>
              <div class="space-y-1 text-sm text-gray-600 mb-4">
                <p>{{ doc.degree || 'N/A' }} &middot; {{ doc.experience || 'N/A' }}</p>
                <p>{{ doc.location || 'Location not set' }}</p>
                <p class="font-semibold text-gray-800">{{ doc.fees | currency:'INR' }}</p>
              </div>
              <div class="flex items-center gap-2">
                @if (doc.isAvailable) {
                  <span class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Available</span>
                } @else {
                  <span class="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Unavailable</span>
                }
              </div>
            </div>
            <div class="border-t border-gray-100 p-4">
              @if (doc.isAvailable) {
                <a [routerLink]="['/patient/book', doc.id]"
                  class="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Book Appointment
                </a>
              } @else {
                <span class="block text-center bg-gray-200 text-gray-400 py-2 rounded-lg cursor-not-allowed font-medium text-sm">
                  Unavailable
                </span>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class PatientDashboardComponent implements OnInit {
  doctors: DoctorResponse[] = [];
  specialities: Speciality[] = [];
  selectedSpeciality: number | null = null;

  constructor(private doctorService: DoctorService, private specialityService: SpecialityService) {}

  ngOnInit() {
    this.specialityService.getAll().subscribe(s => this.specialities = s);
    this.onFilter();
  }

  onFilter() {
    this.doctorService.getAll(this.selectedSpeciality ?? undefined).subscribe(d => this.doctors = d);
  }
}
