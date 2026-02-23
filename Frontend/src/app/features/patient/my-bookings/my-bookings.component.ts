import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { PatientService } from '../../../core/services/patient.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppointmentResponse } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CurrencyPipe, MatCardModule, MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>

      <mat-button-toggle-group [(value)]="filter" class="mb-6">
        <mat-button-toggle value="all">All</mat-button-toggle>
        <mat-button-toggle value="upcoming">Upcoming</mat-button-toggle>
        <mat-button-toggle value="past">Past</mat-button-toggle>
      </mat-button-toggle-group>

      @if (filtered.length === 0) {
        <mat-card>
          <mat-card-content class="text-center! py-8!">
            <mat-icon class="text-5xl! text-gray-400! mb-2!">event_busy</mat-icon>
            <p class="text-gray-500">No bookings found</p>
          </mat-card-content>
        </mat-card>
      }

      <div class="space-y-4">
        @for (apt of filtered; track apt.id) {
          <mat-card>
            <mat-card-content>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-800">Dr. {{ apt.doctorName }}</p>
                  <p class="text-sm text-blue-600">{{ apt.speciality }}</p>
                  <p class="text-sm text-gray-500 mt-1">{{ apt.slotDate }} at {{ apt.slotTime }} - {{ apt.slotType }}</p>
                  <p class="text-sm text-gray-500">Fee: {{ apt.amount | currency:'INR' }}</p>
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
export class MyBookingsComponent implements OnInit {
  appointments: AppointmentResponse[] = [];
  filter: 'all' | 'upcoming' | 'past' = 'all';

  constructor(private patientService: PatientService, private appointmentService: AppointmentService, private notify: NotificationService) {}

  ngOnInit() {
    this.patientService.getMyAppointments().subscribe(a => this.appointments = a);
  }

  get filtered(): AppointmentResponse[] {
    const today = new Date().toISOString().split('T')[0];
    if (this.filter === 'upcoming') return this.appointments.filter(a => a.slotDate >= today && a.status === 'BOOKED');
    if (this.filter === 'past') return this.appointments.filter(a => a.slotDate < today || a.status !== 'BOOKED');
    return this.appointments;
  }

  cancel(apt: AppointmentResponse) {
    this.appointmentService.cancel(apt.id).subscribe(() => {
      apt.status = 'CANCELLED';
      this.notify.success('Booking cancelled');
    });
  }
}
