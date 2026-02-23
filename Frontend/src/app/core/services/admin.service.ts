import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData, DoctorResponse, PatientResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>('/api/admin/dashboard');
  }

  getPendingDoctors(): Observable<DoctorResponse[]> {
    return this.http.get<DoctorResponse[]>('/api/admin/doctors/pending');
  }

  approveDoctor(id: number): Observable<any> {
    return this.http.put(`/api/admin/doctors/${id}/approve`, {});
  }

  getAllDoctors(): Observable<DoctorResponse[]> {
    return this.http.get<DoctorResponse[]>('/api/admin/doctors');
  }

  getAllPatients(): Observable<PatientResponse[]> {
    return this.http.get<PatientResponse[]>('/api/admin/patients');
  }
}
