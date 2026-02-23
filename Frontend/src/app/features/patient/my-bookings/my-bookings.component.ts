import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PatientService } from '../../../core/services/patient.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AppointmentResponse } from '../../../core/models/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>

      <div class="flex gap-3 mb-6">
        <button (click)="filter = 'all'" [class]="filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'" class="px-4 py-2 rounded-lg text-sm font-medium">All</button>
        <button (click)="filter = 'upcoming'" [class]="filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'" class="px-4 py-2 rounded-lg text-sm font-medium">Upcoming</button>
        <button (click)="filter = 'past'" [class]="filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'" class="px-4 py-2 rounded-lg text-sm font-medium">Past</button>
      </div>

      @if (filtered.length === 0) {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          No bookings found
        </div>
      }

      <div class="space-y-4">
        @for (apt of filtered; track apt.id) {
          <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-800">Dr. {{ apt.doctorName }}</p>
                <p class="text-sm text-blue-600">{{ apt.speciality }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ apt.slotDate }} at {{ apt.slotTime }} - {{ apt.slotType }}</p>
                <p class="text-sm text-gray-500">Fee: {{ apt.amount | currency:'INR' }}</p>
              </div>
              <div class="flex items-center gap-3">
                @if (apt.status === 'BOOKED') {
                  <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{{ apt.status }}</span>
                } @else if (apt.status === 'COMPLETED') {
                  <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">{{ apt.status }}</span>
                } @else if (apt.status === 'CANCELLED') {
                  <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">{{ apt.status }}</span>
                }
                @if (apt.status === 'BOOKED') {
                  <button (click)="cancel(apt)" class="text-sm text-red-500 hover:text-red-700 font-medium">Cancel</button>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MyBookingsComponent implements OnInit {
  appointments: AppointmentResponse[] = [];
  filter: 'all' | 'upcoming' | 'past' = 'all';

  constructor(private patientService: PatientService, private appointmentService: AppointmentService) {}

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
    this.appointmentService.cancel(apt.id).subscribe(() => apt.status = 'CANCELLED');
  }
}
