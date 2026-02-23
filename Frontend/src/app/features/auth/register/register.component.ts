import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SpecialityService } from '../../../core/services/speciality.service';
import { Speciality } from '../../../core/models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center py-8">
      <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>

        @if (error) {
          <div class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{{ error }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" [(ngModel)]="form.name" name="name" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" [(ngModel)]="form.email" name="email" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" [(ngModel)]="form.password" name="password" required minlength="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" [(ngModel)]="form.phone" name="phone"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Register as</label>
            <select [(ngModel)]="form.role" name="role" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>

          @if (form.role === 'DOCTOR') {
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
              <select [(ngModel)]="form.specialityId" name="specialityId" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option [ngValue]="null" disabled>Select speciality</option>
                @for (s of specialities; track s.id) {
                  <option [ngValue]="s.id">{{ s.name }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input type="text" [(ngModel)]="form.degree" name="degree"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <input type="text" [(ngModel)]="form.experience" name="experience" placeholder="e.g. 5 years"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
              <input type="number" [(ngModel)]="form.fees" name="fees"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
          }

          <button type="submit" [disabled]="loading"
            class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a routerLink="/login" class="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  form: any = { name: '', email: '', password: '', phone: '', role: 'PATIENT', specialityId: null, degree: '', experience: '', fees: null };
  specialities: Speciality[] = [];
  error = '';
  loading = false;

  constructor(private auth: AuthService, private specialityService: SpecialityService, private router: Router) {}

  ngOnInit() {
    this.specialityService.getAll().subscribe(s => this.specialities = s);
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.auth.register(this.form).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
        else if (res.role === 'DOCTOR') this.router.navigate(['/doctor/dashboard']);
        else this.router.navigate(['/patient/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
