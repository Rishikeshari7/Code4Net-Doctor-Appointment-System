import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { DoctorResponse } from '../../../core/models/models';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

      @if (success) {
        <div class="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">Profile updated successfully!</div>
      }

      @if (doctor) {
        <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="text" [(ngModel)]="doctor.image" name="image"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <input type="text" [(ngModel)]="doctor.degree" name="degree"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <input type="text" [(ngModel)]="doctor.experience" name="experience"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">About</label>
            <textarea [(ngModel)]="doctor.about" name="about" rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fees</label>
            <input type="number" [(ngModel)]="doctor.fees" name="fees"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" [(ngModel)]="doctor.location" name="location"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <button type="submit" [disabled]="loading"
            class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      }
    </div>
  `
})
export class DoctorProfileComponent implements OnInit {
  doctor: DoctorResponse | null = null;
  loading = false;
  success = false;

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.doctorService.getMyProfile().subscribe(d => this.doctor = d);
  }

  onSubmit() {
    if (!this.doctor) return;
    this.loading = true;
    this.success = false;
    this.doctorService.updateProfile({
      image: this.doctor.image,
      degree: this.doctor.degree,
      experience: this.doctor.experience,
      about: this.doctor.about,
      fees: this.doctor.fees,
      location: this.doctor.location
    }).subscribe({
      next: () => { this.loading = false; this.success = true; },
      error: () => this.loading = false
    });
  }
}
