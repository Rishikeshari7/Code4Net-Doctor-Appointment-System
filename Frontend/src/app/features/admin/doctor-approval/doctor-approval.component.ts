import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { DoctorResponse } from '../../../core/models/models';

@Component({
  selector: 'app-doctor-approval',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Pending Doctor Approvals</h1>

      @if (doctors.length === 0) {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          No pending approvals
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (doc of doctors; track doc.id) {
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {{ doc.name.charAt(0) }}
              </div>
              <div>
                <p class="font-semibold text-gray-800">{{ doc.name }}</p>
                <p class="text-sm text-gray-500">{{ doc.speciality }}</p>
              </div>
            </div>
            <div class="space-y-1 text-sm text-gray-600 mb-4">
              <p><span class="font-medium">Email:</span> {{ doc.email }}</p>
              <p><span class="font-medium">Degree:</span> {{ doc.degree || 'N/A' }}</p>
              <p><span class="font-medium">Experience:</span> {{ doc.experience || 'N/A' }}</p>
              <p><span class="font-medium">Fees:</span> {{ doc.fees | currency:'INR' }}</p>
            </div>
            <button (click)="approve(doc.id)" [disabled]="approving === doc.id"
              class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium text-sm disabled:opacity-50">
              {{ approving === doc.id ? 'Approving...' : 'Approve Doctor' }}
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class DoctorApprovalComponent implements OnInit {
  doctors: DoctorResponse[] = [];
  approving: number | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.adminService.getPendingDoctors().subscribe(d => this.doctors = d);
  }

  approve(id: number) {
    this.approving = id;
    this.adminService.approveDoctor(id).subscribe({
      next: () => {
        this.approving = null;
        this.doctors = this.doctors.filter(d => d.id !== id);
      },
      error: () => this.approving = null
    });
  }
}
