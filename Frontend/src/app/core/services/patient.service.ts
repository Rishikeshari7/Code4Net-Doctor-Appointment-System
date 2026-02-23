import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientResponse, PatientProfile } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<PatientResponse> {
    return this.http.get<PatientResponse>('/api/patients/profile');
  }

  updateProfile(data: PatientProfile): Observable<any> {
    return this.http.put('/api/patients/profile', data);
  }

  getMyAppointments(): Observable<any[]> {
    return this.http.get<any[]>('/api/patients/appointments');
  }
}
