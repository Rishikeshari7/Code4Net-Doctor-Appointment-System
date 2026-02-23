import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Speciality } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SpecialityService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>('/api/specialities');
  }
}
