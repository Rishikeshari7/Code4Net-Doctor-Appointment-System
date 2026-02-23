import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorResponse, DoctorProfile } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  constructor(private http: HttpClient) {}

  getAll(specialityId?: number): Observable<DoctorResponse[]> {
    const url = specialityId ? `/api/doctors?specialityId=${specialityId}` : '/api/doctors';
    return this.http.get<DoctorResponse[]>(url);
  }

  getById(id: number): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>(`/api/doctors/${id}`);
  }

  getMyProfile(): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>('/api/doctors/me');
  }

  updateProfile(data: DoctorProfile): Observable<any> {
    return this.http.put('/api/doctors/profile', data);
  }

  updateAvailability(isAvailable: boolean): Observable<any> {
    return this.http.put('/api/doctors/availability', { isAvailable });
  }

  getMyAppointments(): Observable<any[]> {
    return this.http.get<any[]>('/api/doctors/appointments');
  }

  getAvailableSlots(doctorId: number, date: string): Observable<{ bookedSlots: string[] }> {
    return this.http.get<{ bookedSlots: string[] }>(`/api/doctors/${doctorId}/available-slots?date=${date}`);
  }
}
