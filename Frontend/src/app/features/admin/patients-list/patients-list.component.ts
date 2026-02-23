import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { PatientResponse } from '../../../core/models/models';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">All Patients</h1>

      @if (patients.length === 0) {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No patients found</div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600">
              <tr>
                <th class="text-left px-6 py-3 font-medium">Name</th>
                <th class="text-left px-6 py-3 font-medium">Email</th>
                <th class="text-left px-6 py-3 font-medium">Phone</th>
                <th class="text-left px-6 py-3 font-medium">Gender</th>
                <th class="text-left px-6 py-3 font-medium">Blood Group</th>
              </tr>
            </thead>
            <tbody>
              @for (p of patients; track p.id) {
                <tr class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-gray-800">{{ p.name }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ p.email }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ p.phone || '-' }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ p.gender || '-' }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ p.bloodGroup || '-' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class PatientsListComponent implements OnInit {
  patients: PatientResponse[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAllPatients().subscribe(p => {
      console.log('Patients loaded:', p);
      this.patients = p;
    });
  }
}
