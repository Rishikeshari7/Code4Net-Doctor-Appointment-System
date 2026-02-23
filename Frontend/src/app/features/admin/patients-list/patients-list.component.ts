import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../core/services/admin.service';
import { PatientResponse } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">All Patients</h1>

      @if (loading) {
        <div class="flex justify-center p-12">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else if (patients.length === 0) {
        <mat-card>
          <mat-card-content class="text-center! py-8!">
            <mat-icon class="text-5xl! text-gray-400! mb-2!">search_off</mat-icon>
            <p class="text-gray-500">No patients found</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card>
          <table mat-table [dataSource]="patients" class="w-full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let p" class="font-medium">{{ p.name }}</td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let p">{{ p.email }}</td>
            </ng-container>
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let p">{{ p.phone || '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="gender">
              <th mat-header-cell *matHeaderCellDef>Gender</th>
              <td mat-cell *matCellDef="let p">{{ p.gender || '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="bloodGroup">
              <th mat-header-cell *matHeaderCellDef>Blood Group</th>
              <td mat-cell *matCellDef="let p">{{ p.bloodGroup || '-' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>
          </table>
        </mat-card>
      }
    </div>
  `
})
export class PatientsListComponent implements OnInit {
  patients: PatientResponse[] = [];
  loading = true;
  displayedColumns = ['name', 'email', 'phone', 'gender', 'bloodGroup'];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAllPatients().subscribe(p => {
      this.patients = p;
      this.loading = false;
    });
  }
}
