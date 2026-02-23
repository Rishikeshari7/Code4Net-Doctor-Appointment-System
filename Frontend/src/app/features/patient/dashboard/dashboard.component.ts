import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DoctorService } from '../../../core/services/doctor.service';
import { SpecialityService } from '../../../core/services/speciality.service';
import { DoctorResponse, Speciality } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CurrencyPipe, RouterModule, FormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, MatChipsModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Find a Doctor</h1>

      <div class="mb-6">
        <mat-form-field appearance="outline" class="w-64!">
          <mat-label>Filter by Speciality</mat-label>
          <mat-icon matPrefix>filter_list</mat-icon>
          <mat-select [(ngModel)]="selectedSpeciality" (selectionChange)="onFilter()" name="speciality">
            <mat-option [value]="null">All Specialities</mat-option>
            @for (s of specialities; track s.id) {
              <mat-option [value]="s.id">{{ s.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      @if (doctors.length === 0) {
        <mat-card>
          <mat-card-content class="text-center! py-8!">
            <mat-icon class="text-5xl! text-gray-400! mb-2!">search_off</mat-icon>
            <p class="text-gray-500">No doctors available</p>
          </mat-card-content>
        </mat-card>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (doc of doctors; track doc.id) {
          <mat-card class="overflow-hidden">
            <mat-card-header>
              <div mat-card-avatar class="bg-blue-100! rounded-full! flex! items-center! justify-center! text-blue-600 font-bold text-xl">
                {{ doc.name.charAt(0) }}
              </div>
              <mat-card-title>{{ doc.name }}</mat-card-title>
              <mat-card-subtitle>{{ doc.speciality }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="space-y-1 text-sm text-gray-600 mb-3">
                <p>{{ doc.degree || 'N/A' }} &middot; {{ doc.experience || 'N/A' }}</p>
                <p><mat-icon class="text-sm! align-middle!">location_on</mat-icon> {{ doc.location || 'Location not set' }}</p>
                <p class="font-semibold text-gray-800">{{ doc.fees | currency:'INR' }}</p>
              </div>
              @if (doc.isAvailable) {
                <mat-chip class="bg-green-100! text-green-700!">Available</mat-chip>
              } @else {
                <mat-chip class="bg-red-100! text-red-700!">Unavailable</mat-chip>
              }
            </mat-card-content>
            <mat-card-actions>
              @if (doc.isAvailable) {
                <a mat-flat-button color="primary" [routerLink]="['/patient/book', doc.id]">
                  <mat-icon>event_available</mat-icon> Book Appointment
                </a>
              } @else {
                <button mat-flat-button disabled>Unavailable</button>
              }
            </mat-card-actions>
          </mat-card>
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
