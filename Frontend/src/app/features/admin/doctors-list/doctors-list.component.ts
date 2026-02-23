import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { DoctorResponse } from '../../../core/models/models';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">All Doctors</h1>

      @if (doctors.length === 0) {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No doctors found</div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600">
              <tr>
                <th class="text-left px-6 py-3 font-medium">Name</th>
                <th class="text-left px-6 py-3 font-medium">Speciality</th>
                <th class="text-left px-6 py-3 font-medium">Email</th>
                <th class="text-left px-6 py-3 font-medium">Fees</th>
                <th class="text-left px-6 py-3 font-medium">Available</th>
                <th class="text-left px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of doctors; track doc.id) {
                <tr class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-gray-800">{{ doc.name }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ doc.speciality }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ doc.email }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ doc.fees | currency:'INR' }}</td>
                  <td class="px-6 py-4">
                    @if (doc.isAvailable) {
                      <span class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Yes</span>
                    } @else {
                      <span class="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">No</span>
                    }
                  </td>
                  <td class="px-6 py-4">
                    @if (doc.isVerified) {
                      <span class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Verified</span>
                    } @else {
                      <span class="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">Pending</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class DoctorsListComponent implements OnInit {
  doctors: DoctorResponse[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAllDoctors().subscribe(d => {
      console.log('Doctors loaded:', d);
      this.doctors = d;
    });
  }
}
