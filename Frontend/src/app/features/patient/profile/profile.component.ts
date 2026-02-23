import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { PatientResponse } from '../../../core/models/models';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      @if (success) {
        <div class="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">Profile updated successfully!</div>
      }

      @if (patient) {
        <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" [(ngModel)]="patient.name" name="name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" [(ngModel)]="patient.phone" name="phone"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select [(ngModel)]="patient.gender" name="gender"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select [(ngModel)]="patient.bloodGroup" name="bloodGroup"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select</option>
                @for (bg of bloodGroups; track bg) {
                  <option [value]="bg">{{ bg }}</option>
                }
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" [(ngModel)]="patient.dob" name="dob"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea [(ngModel)]="patient.address" name="address" rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
            <input type="text" [(ngModel)]="patient.emergencyContact" name="emergencyContact"
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
export class PatientProfileComponent implements OnInit {
  patient: PatientResponse | null = null;
  loading = false;
  success = false;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.patientService.getProfile().subscribe(p => this.patient = p);
  }

  onSubmit() {
    if (!this.patient) return;
    this.loading = true;
    this.success = false;
    this.patientService.updateProfile({
      name: this.patient.name,
      phone: this.patient.phone,
      gender: this.patient.gender,
      dob: this.patient.dob,
      bloodGroup: this.patient.bloodGroup,
      address: this.patient.address,
      emergencyContact: this.patient.emergencyContact
    }).subscribe({
      next: () => { this.loading = false; this.success = true; },
      error: () => this.loading = false
    });
  }
}
