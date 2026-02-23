import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardData } from '../../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Total Doctors</p>
          <p class="text-3xl font-bold text-blue-600">{{ data?.totalDoctors ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Total Patients</p>
          <p class="text-3xl font-bold text-green-600">{{ data?.totalPatients ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Total Appointments</p>
          <p class="text-3xl font-bold text-purple-600">{{ data?.totalAppointments ?? 0 }}</p>
        </div>
      </div>

      <div class="flex gap-4">
        <a routerLink="/admin/doctors" class="bg-blue-50 text-blue-600 px-5 py-3 rounded-lg hover:bg-blue-100 font-medium text-sm">View All Doctors</a>
        <a routerLink="/admin/patients" class="bg-green-50 text-green-600 px-5 py-3 rounded-lg hover:bg-green-100 font-medium text-sm">View All Patients</a>
        <a routerLink="/admin/doctor-approval" class="bg-amber-50 text-amber-600 px-5 py-3 rounded-lg hover:bg-amber-100 font-medium text-sm">Pending Approvals</a>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  data: DashboardData | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getDashboard().subscribe(d => this.data = d);
  }
}
