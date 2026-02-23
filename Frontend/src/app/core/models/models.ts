export interface AuthResponse {
  token: string;
  role: string;
  userId: number;
  name: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  specialityId?: number;
  degree?: string;
  experience?: string;
  fees?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface DoctorResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  degree?: string;
  experience?: string;
  about?: string;
  fees: number;
  location?: string;
  isAvailable: boolean;
  isVerified: boolean;
  speciality: string;
  specialityId: number;
}

export interface DoctorProfile {
  image?: string;
  degree?: string;
  experience?: string;
  about?: string;
  fees?: number;
  location?: string;
}

export interface PatientResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
}

export interface PatientProfile {
  name?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
}

export interface AppointmentResponse {
  id: number;
  patientName: string;
  doctorName: string;
  speciality: string;
  slotDate: string;
  slotTime: string;
  slotType: string;
  status: string;
  amount: number;
  paymentStatus: boolean;
  createdAt: string;
}

export interface CreateAppointment {
  doctorId: number;
  slotDate: string;
  slotTime: string;
  slotType: string;
}

export interface Speciality {
  id: number;
  name: string;
  description?: string;
}

export interface DashboardData {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
}
