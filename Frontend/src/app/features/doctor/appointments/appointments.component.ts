import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppointmentResponse } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>

      <mat-button-toggle-group [(value)]="filter" class="mb-6">
        <mat-button-toggle value="all">All</mat-button-toggle>
        <mat-button-toggle value="current">Upcoming</mat-button-toggle>
        <mat-button-toggle value="past">Past</mat-button-toggle>
      </mat-button-toggle-group>

      @if (filtered.length === 0) {
        <mat-card>
          <mat-card-content class="text-center! py-8!">
            <mat-icon class="text-5xl! text-gray-400! mb-2!">event_busy</mat-icon>
            <p class="text-gray-500">No appointments found</p>
          </mat-card-content>
        </mat-card>
      }

      <div class="space-y-4">
        @for (apt of filtered; track apt.id) {
          <mat-card>
            <mat-card-content>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-800">{{ apt.patientName }}</p>
                  <p class="text-sm text-gray-500">{{ apt.slotDate }} at {{ apt.slotTime }} - {{ apt.slotType }}</p>
                </div>
                <div class="flex items-center gap-3">
                  @if (apt.status === 'BOOKED') {
                    <mat-chip class="bg-blue-100! text-blue-700!">BOOKED</mat-chip>
                  } @else if (apt.status === 'COMPLETED') {
                    <mat-chip class="bg-green-100! text-green-700!">COMPLETED</mat-chip>
                  } @else if (apt.status === 'CANCELLED') {
                    <mat-chip class="bg-red-100! text-red-700!">CANCELLED</mat-chip>
                  }
                  @if (apt.status === 'BOOKED') {
                    <button mat-button color="primary" (click)="complete(apt)">
                      <mat-icon>check_circle</mat-icon> Complete
                    </button>
                    <button mat-button color="warn" (click)="cancel(apt)">
                      <mat-icon>cancel</mat-icon> Cancel
                    </button>
                  }
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: AppointmentResponse[] = [];
  filter: 'all' | 'current' | 'past' = 'all';

  constructor(private doctorService: DoctorService, private appointmentService: AppointmentService, private notify: NotificationService) {}

  ngOnInit() {
    this.doctorService.getMyAppointments().subscribe(a => this.appointments = a);
  }

  get filtered(): AppointmentResponse[] {
    const today = new Date().toISOString().split('T')[0];
    if (this.filter === 'current') return this.appointments.filter(a => a.slotDate >= today && a.status === 'BOOKED');
    if (this.filter === 'past') return this.appointments.filter(a => a.slotDate < today || a.status !== 'BOOKED');
    return this.appointments;
  }

  complete(apt: AppointmentResponse) {
    this.appointmentService.complete(apt.id).subscribe(() => {
      apt.status = 'COMPLETED';
      this.notify.success('Appointment marked as completed');
    });
  }

  cancel(apt: AppointmentResponse) {
    this.appointmentService.cancel(apt.id).subscribe(() => {
      apt.status = 'CANCELLED';
      this.notify.success('Appointment cancelled');
    });
  }
}
