import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DoctorResponse } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-doctor-approval',
  standalone: true,
  imports: [CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Pending Doctor Approvals</h1>

      @if (doctors.length === 0) {
        <mat-card>
          <mat-card-content class="text-center! py-8!">
            <mat-icon class="text-5xl! text-green-500! mb-2!">check_circle</mat-icon>
            <p class="text-gray-500">No pending approvals</p>
          </mat-card-content>
        </mat-card>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (doc of doctors; track doc.id) {
          <mat-card>
            <mat-card-content>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                  {{ doc.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800">{{ doc.name }}</p>
                  <mat-chip class="bg-blue-50! text-blue-600! text-xs!">{{ doc.speciality }}</mat-chip>
                </div>
              </div>
              <div class="space-y-1 text-sm text-gray-600 mb-4">
                <p><span class="font-medium">Email:</span> {{ doc.email }}</p>
                <p><span class="font-medium">Degree:</span> {{ doc.degree || 'N/A' }}</p>
                <p><span class="font-medium">Experience:</span> {{ doc.experience || 'N/A' }}</p>
                <p><span class="font-medium">Fees:</span> {{ doc.fees | currency:'INR' }}</p>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-flat-button color="accent" (click)="approve(doc.id)" [disabled]="approving === doc.id" class="w-full!">
                @if (approving === doc.id) {
                  <mat-spinner diameter="18" class="inline-block! mr-2"></mat-spinner>
                } @else {
                  <mat-icon>verified</mat-icon>
                }
                {{ approving === doc.id ? 'Approving...' : 'Approve Doctor' }}
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `
})
export class DoctorApprovalComponent implements OnInit {
  doctors: DoctorResponse[] = [];
  approving: number | null = null;

  constructor(private adminService: AdminService, private notify: NotificationService) {}

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
        this.notify.success('Doctor approved successfully');
      },
      error: () => {
        this.approving = null;
        this.notify.error('Failed to approve doctor');
      }
    });
  }
}
