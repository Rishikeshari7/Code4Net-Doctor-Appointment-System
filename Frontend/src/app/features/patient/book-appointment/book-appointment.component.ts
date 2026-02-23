import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DoctorResponse } from '../../../core/models/models';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h1>

      @if (error) {
        <div class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{{ error }}</div>
      }
      @if (successMsg) {
        <div class="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{{ successMsg }}</div>
      }

      @if (doctor) {
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
              {{ doctor.name.charAt(0) }}
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-800">{{ doctor.name }}</p>
              <p class="text-sm text-blue-600">{{ doctor.speciality }}</p>
              <p class="text-sm text-gray-500">{{ doctor.degree }} &middot; {{ doctor.experience }}</p>
              <p class="text-sm font-semibold text-gray-700 mt-1">{{ doctor.fees | currency:'INR' }}</p>
            </div>
          </div>
        </div>
      }

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input type="date" [(ngModel)]="selectedDate" (ngModelChange)="onDateChange()" [min]="minDate" name="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        @if (selectedDate) {
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
            <div class="grid grid-cols-4 gap-2">
              @for (slot of allSlots; track slot) {
                <button (click)="selectSlot(slot)"
                  [disabled]="isSlotDisabled(slot)"
                  [class]="getSlotClass(slot)"
                  class="py-2 rounded-lg text-sm font-medium transition-colors">
                  {{ slot }}
                </button>
              }
            </div>
          </div>
        }

        @if (selectedTime) {
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
            <select [(ngModel)]="slotType" name="slotType"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>

          <button (click)="book()" [disabled]="loading"
            class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
            {{ loading ? 'Booking...' : 'Confirm Booking' }}
          </button>
        }
      </div>
    </div>
  `
})
export class BookAppointmentComponent implements OnInit {
  doctor: DoctorResponse | null = null;
  doctorId = 0;
  selectedDate = '';
  selectedTime = '';
  slotType = 'OFFLINE';
  bookedSlots: string[] = [];
  loading = false;
  error = '';
  successMsg = '';
  minDate = '';

  allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.doctorId = +this.route.snapshot.paramMap.get('id')!;
    this.minDate = new Date().toISOString().split('T')[0];
    this.doctorService.getById(this.doctorId).subscribe(d => this.doctor = d);
  }

  onDateChange() {
    this.selectedTime = '';
    this.bookedSlots = [];
    if (this.selectedDate) {
      this.doctorService.getAvailableSlots(this.doctorId, this.selectedDate)
        .subscribe(res => this.bookedSlots = res.bookedSlots);
    }
  }

  isSlotDisabled(slot: string): boolean {
    if (this.bookedSlots.includes(slot)) return true;
    if (this.selectedDate === this.minDate) {
      const now = new Date();
      const [h, m] = slot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(h, m, 0, 0);
      if (slotTime <= now) return true;
    }
    return false;
  }

  getSlotClass(slot: string): string {
    if (this.isSlotDisabled(slot)) return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    if (this.selectedTime === slot) return 'bg-blue-600 text-white';
    return 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400';
  }

  selectSlot(slot: string) {
    if (!this.isSlotDisabled(slot)) this.selectedTime = slot;
  }

  book() {
    this.loading = true;
    this.error = '';
    this.successMsg = '';
    this.appointmentService.create({
      doctorId: this.doctorId,
      slotDate: this.selectedDate,
      slotTime: this.selectedTime,
      slotType: this.slotType
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Appointment booked successfully!';
        setTimeout(() => this.router.navigate(['/patient/my-bookings']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Booking failed';
      }
    });
  }
}
