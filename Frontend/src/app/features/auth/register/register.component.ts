import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { SpecialityService } from '../../../core/services/speciality.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Speciality } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="min-h-[80vh] flex items-center justify-center py-8">
      <mat-card class="w-full max-w-lg">
        <mat-card-header class="justify-center! mb-4!">
          <mat-card-title class="text-2xl!">
            <mat-icon class="text-blue-600! align-middle! mr-2">person_add</mat-icon>Register
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="space-y-3">
            <mat-form-field appearance="outline">
              <mat-label>Full Name</mat-label>
              <mat-icon matPrefix>person</mat-icon>
              <input matInput type="text" [(ngModel)]="form.name" name="name" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" [(ngModel)]="form.email" name="email" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput type="password" [(ngModel)]="form.password" name="password" required minlength="6" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <mat-icon matPrefix>phone</mat-icon>
              <input matInput type="text" [(ngModel)]="form.phone" name="phone" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Register as</mat-label>
              <mat-select [(ngModel)]="form.role" name="role" required>
                <mat-option value="PATIENT">Patient</mat-option>
                <mat-option value="DOCTOR">Doctor</mat-option>
              </mat-select>
            </mat-form-field>

            @if (form.role === 'DOCTOR') {
              <mat-form-field appearance="outline">
                <mat-label>Speciality</mat-label>
                <mat-select [(ngModel)]="form.specialityId" name="specialityId" required>
                  @for (s of specialities; track s.id) {
                    <mat-option [value]="s.id">{{ s.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Degree</mat-label>
                <mat-icon matPrefix>school</mat-icon>
                <input matInput type="text" [(ngModel)]="form.degree" name="degree" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Experience</mat-label>
                <mat-icon matPrefix>work</mat-icon>
                <input matInput type="text" [(ngModel)]="form.experience" name="experience" placeholder="e.g. 5 years" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Consultation Fee</mat-label>
                <mat-icon matPrefix>payments</mat-icon>
                <input matInput type="number" [(ngModel)]="form.fees" name="fees" />
              </mat-form-field>
            }

            <button mat-flat-button color="primary" type="submit" [disabled]="loading" class="w-full! py-2.5!">
              @if (loading) {
                <mat-spinner diameter="20" class="inline-block! mr-2"></mat-spinner>
              }
              {{ loading ? 'Registering...' : 'Register' }}
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions class="justify-center! pb-4!">
          <p class="text-sm text-gray-500">
            Already have an account? <a routerLink="/login" class="text-blue-600 hover:underline font-medium">Login</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  form: any = { name: '', email: '', password: '', phone: '', role: 'PATIENT', specialityId: null, degree: '', experience: '', fees: null };
  specialities: Speciality[] = [];
  loading = false;

  constructor(private auth: AuthService, private specialityService: SpecialityService, private router: Router, private notify: NotificationService) {}

  ngOnInit() {
    this.specialityService.getAll().subscribe(s => this.specialities = s);
  }

  onSubmit() {
    this.loading = true;
    this.auth.register(this.form).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
        else if (res.role === 'DOCTOR') this.router.navigate(['/doctor/dashboard']);
        else this.router.navigate(['/patient/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.notify.error(err.error?.message || 'Registration failed');
      }
    });
  }
}
