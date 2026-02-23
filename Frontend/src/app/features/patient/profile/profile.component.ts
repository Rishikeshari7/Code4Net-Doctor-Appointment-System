import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientService } from '../../../core/services/patient.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PatientResponse } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      @if (patient) {
        <mat-card>
          <mat-card-content>
            <form (ngSubmit)="onSubmit()" class="space-y-3">
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <mat-icon matPrefix>person</mat-icon>
                <input matInput type="text" [(ngModel)]="patient.name" name="name" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <mat-icon matPrefix>phone</mat-icon>
                <input matInput type="text" [(ngModel)]="patient.phone" name="phone" />
              </mat-form-field>
              <div class="grid grid-cols-2 gap-4">
                <mat-form-field appearance="outline">
                  <mat-label>Gender</mat-label>
                  <mat-select [(ngModel)]="patient.gender" name="gender">
                    <mat-option value="">Select</mat-option>
                    <mat-option value="Male">Male</mat-option>
                    <mat-option value="Female">Female</mat-option>
                    <mat-option value="Other">Other</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Blood Group</mat-label>
                  <mat-select [(ngModel)]="patient.bloodGroup" name="bloodGroup">
                    <mat-option value="">Select</mat-option>
                    @for (bg of bloodGroups; track bg) {
                      <mat-option [value]="bg">{{ bg }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              </div>
              <mat-form-field appearance="outline">
                <mat-label>Date of Birth</mat-label>
                <mat-icon matPrefix>cake</mat-icon>
                <input matInput type="date" [(ngModel)]="patient.dob" name="dob" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Address</mat-label>
                <mat-icon matPrefix>home</mat-icon>
                <textarea matInput [(ngModel)]="patient.address" name="address" rows="2"></textarea>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Emergency Contact</mat-label>
                <mat-icon matPrefix>emergency</mat-icon>
                <input matInput type="text" [(ngModel)]="patient.emergencyContact" name="emergencyContact" />
              </mat-form-field>
              <button mat-flat-button color="primary" type="submit" [disabled]="loading" class="w-full! py-2.5!">
                @if (loading) {
                  <mat-spinner diameter="20" class="inline-block! mr-2"></mat-spinner>
                }
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="flex justify-center p-12">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      }
    </div>
  `
})
export class PatientProfileComponent implements OnInit {
  patient: PatientResponse | null = null;
  loading = false;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(private patientService: PatientService, private notify: NotificationService) {}

  ngOnInit() {
    this.patientService.getProfile().subscribe(p => this.patient = p);
  }

  onSubmit() {
    if (!this.patient) return;
    this.loading = true;
    this.patientService.updateProfile({
      name: this.patient.name,
      phone: this.patient.phone,
      gender: this.patient.gender,
      dob: this.patient.dob,
      bloodGroup: this.patient.bloodGroup,
      address: this.patient.address,
      emergencyContact: this.patient.emergencyContact
    }).subscribe({
      next: () => {
        this.loading = false;
        this.notify.success('Profile updated successfully!');
      },
      error: () => {
        this.loading = false;
        this.notify.error('Failed to update profile');
      }
    });
  }
}
