import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DoctorResponse } from '../../../core/models/models';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDatepickerModule],
  animations: [fadeIn],
  host: { '[@fadeIn]': '' },
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h1>

      @if (doctor) {
        <mat-card class="mb-6">
          <mat-card-content>
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
          </mat-card-content>
        </mat-card>
      }

      <mat-card>
        <mat-card-content class="space-y-4">
          <mat-form-field appearance="outline">
            <mat-label>Select Date</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDateObj" (dateChange)="onPickerDateChange($event)" [min]="minDateObj" name="date" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          @if (selectedDate) {
            <div>
              <p class="text-sm font-medium text-gray-700 mb-2">Select Time Slot</p>
              <div class="grid grid-cols-4 gap-2">
                @for (slot of allSlots; track slot) {
                  <button (click)="selectSlot(slot)"
                    [disabled]="isSlotDisabled(slot)"
                    [class]="getSlotClass(slot)"
                    class="py-2.5 rounded-lg text-sm font-medium transition-colors">
                    {{ slot }}
                  </button>
                }
              </div>
            </div>
          }

          @if (selectedTime) {
            <mat-form-field appearance="outline">
              <mat-label>Appointment Type</mat-label>
              <mat-select [(ngModel)]="slotType" name="slotType">
                <mat-option value="ONLINE">Online</mat-option>
                <mat-option value="OFFLINE">Offline</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-flat-button color="primary" (click)="book()" [disabled]="loading" class="w-full! py-2.5!">
              @if (loading) {
                <mat-spinner diameter="20" class="inline-block! mr-2"></mat-spinner>
              }
              {{ loading ? 'Booking...' : 'Confirm Booking' }}
            </button>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class BookAppointmentComponent implements OnInit {
  doctor: DoctorResponse | null = null;
  doctorId = 0;
  selectedDate = '';
  selectedDateObj: Date | null = null;
  selectedTime = '';
  slotType = 'OFFLINE';
  bookedSlots: string[] = [];
  loading = false;
  minDate = '';
  minDateObj = new Date();

  allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.doctorId = +this.route.snapshot.paramMap.get('id')!;
    this.minDate = new Date().toISOString().split('T')[0];
    this.doctorService.getById(this.doctorId).subscribe(d => this.doctor = d);
  }

  onPickerDateChange(event: any) {
    const d: Date = event.value;
    if (d) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      this.selectedDate = `${yyyy}-${mm}-${dd}`;
    } else {
      this.selectedDate = '';
    }
    this.onDateChange();
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
    if (this.selectedTime === slot) return 'bg-blue-600 text-white shadow-md';
    return 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50';
  }

  selectSlot(slot: string) {
    if (!this.isSlotDisabled(slot)) this.selectedTime = slot;
  }

  book() {
    this.loading = true;
    this.appointmentService.create({
      doctorId: this.doctorId,
      slotDate: this.selectedDate,
      slotTime: this.selectedTime,
      slotType: this.slotType
    }).subscribe({
      next: () => {
        this.loading = false;
        this.notify.success('Appointment booked successfully!');
        setTimeout(() => this.router.navigate(['/patient/my-bookings']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.notify.error(err.error?.message || 'Booking failed');
      }
    });
  }
}
