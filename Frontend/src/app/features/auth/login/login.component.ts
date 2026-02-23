import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="min-h-[80vh] flex items-center justify-center">
      <mat-card class="w-full max-w-md">
        <mat-card-header class="justify-center! mb-4!">
          <mat-card-title class="text-2xl!">
            <mat-icon class="text-blue-600! align-middle! mr-2">login</mat-icon>Login
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" [(ngModel)]="email" name="email" required placeholder="you@example.com" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput [type]="hidePassword ? 'password' : 'text'" [(ngModel)]="password" name="password" required placeholder="••••••" />
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="loading" class="w-full! py-2.5!">
              @if (loading) {
                <mat-spinner diameter="20" class="inline-block! mr-2"></mat-spinner>
              }
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions class="justify-center! pb-4!">
          <p class="text-sm text-gray-500">
            Don't have an account? <a routerLink="/register" class="text-blue-600 hover:underline font-medium">Register</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  hidePassword = true;

  constructor(private auth: AuthService, private router: Router, private notify: NotificationService) {}

  onSubmit() {
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
        else if (res.role === 'DOCTOR') this.router.navigate(['/doctor/dashboard']);
        else this.router.navigate(['/patient/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.notify.error(err.error?.message || 'Login failed');
      }
    });
  }
}
