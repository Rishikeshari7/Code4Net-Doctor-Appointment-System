import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DoctorService } from '../../../core/services/doctor.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DoctorResponse } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

      @if (doctor) {
        <mat-card>
          <mat-card-content>
            <form (ngSubmit)="onSubmit()" class="space-y-3">
              <mat-form-field appearance="outline">
                <mat-label>Image URL</mat-label>
                <mat-icon matPrefix>image</mat-icon>
                <input matInput type="text" [(ngModel)]="doctor.image" name="image" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Degree</mat-label>
                <mat-icon matPrefix>school</mat-icon>
                <input matInput type="text" [(ngModel)]="doctor.degree" name="degree" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Experience</mat-label>
                <mat-icon matPrefix>work</mat-icon>
                <input matInput type="text" [(ngModel)]="doctor.experience" name="experience" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>About</mat-label>
                <textarea matInput [(ngModel)]="doctor.about" name="about" rows="3"></textarea>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Fees</mat-label>
                <mat-icon matPrefix>payments</mat-icon>
                <input matInput type="number" [(ngModel)]="doctor.fees" name="fees" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Location</mat-label>
                <mat-icon matPrefix>location_on</mat-icon>
                <input matInput type="text" [(ngModel)]="doctor.location" name="location" />
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
export class DoctorProfileComponent implements OnInit {
  doctor: DoctorResponse | null = null;
  loading = false;

  constructor(private doctorService: DoctorService, private notify: NotificationService) {}

  ngOnInit() {
    this.doctorService.getMyProfile().subscribe(d => this.doctor = d);
  }

  onSubmit() {
    if (!this.doctor) return;
    this.loading = true;
    this.doctorService.updateProfile({
      image: this.doctor.image,
      degree: this.doctor.degree,
      experience: this.doctor.experience,
      about: this.doctor.about,
      fees: this.doctor.fees,
      location: this.doctor.location
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
