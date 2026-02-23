import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentResponse, CreateAppointment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  constructor(private http: HttpClient) {}

  create(data: CreateAppointment): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>('/api/appointments', data);
  }

  getById(id: number): Observable<AppointmentResponse> {
    return this.http.get<AppointmentResponse>(`/api/appointments/${id}`);
  }

  cancel(id: number): Observable<any> {
    return this.http.put(`/api/appointments/${id}/cancel`, {});
  }

  complete(id: number): Observable<any> {
    return this.http.put(`/api/appointments/${id}/complete`, {});
  }
}
