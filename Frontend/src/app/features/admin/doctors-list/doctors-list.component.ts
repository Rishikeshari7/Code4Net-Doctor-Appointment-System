import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../core/services/admin.service';
import { DoctorResponse } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CurrencyPipe, MatTableModule, MatCardModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">All Doctors</h1>

      @if (loading) {
        <div class="flex justify-center p-12">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else if (doctors.length === 0) {
        <mat-card>
          <mat-card-content class="text-center! py-8!">
            <mat-icon class="text-5xl! text-gray-400! mb-2!">search_off</mat-icon>
            <p class="text-gray-500">No doctors found</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card>
          <table mat-table [dataSource]="doctors" class="w-full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let doc" class="font-medium">{{ doc.name }}</td>
            </ng-container>
            <ng-container matColumnDef="speciality">
              <th mat-header-cell *matHeaderCellDef>Speciality</th>
              <td mat-cell *matCellDef="let doc">{{ doc.speciality }}</td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let doc">{{ doc.email }}</td>
            </ng-container>
            <ng-container matColumnDef="fees">
              <th mat-header-cell *matHeaderCellDef>Fees</th>
              <td mat-cell *matCellDef="let doc">{{ doc.fees | currency:'INR' }}</td>
            </ng-container>
            <ng-container matColumnDef="available">
              <th mat-header-cell *matHeaderCellDef>Available</th>
              <td mat-cell *matCellDef="let doc">
                <mat-chip [class]="doc.isAvailable ? 'bg-green-100! text-green-700!' : 'bg-red-100! text-red-700!'">
                  {{ doc.isAvailable ? 'Yes' : 'No' }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let doc">
                <mat-chip [class]="doc.isVerified ? 'bg-green-100! text-green-700!' : 'bg-amber-100! text-amber-700!'">
                  {{ doc.isVerified ? 'Verified' : 'Pending' }}
                </mat-chip>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>
          </table>
        </mat-card>
      }
    </div>
  `
})
export class DoctorsListComponent implements OnInit {
  doctors: DoctorResponse[] = [];
  loading = true;
  displayedColumns = ['name', 'speciality', 'email', 'fees', 'available', 'status'];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAllDoctors().subscribe(d => {
      this.doctors = d;
      this.loading = false;
    });
  }
}
