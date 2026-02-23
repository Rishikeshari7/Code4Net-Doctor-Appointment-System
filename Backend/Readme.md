# 🏥 Hospital Booking System — Complete Project Specification

## 🎯 Project Goal

Build a **Hospital Booking System** where:

* Users can register as **Patient** or **Doctor**
* Admin approves doctors
* Patients book appointments
* Doctors manage availability & appointments
* Role-based dashboards
* Slot validation system
* Angular frontend + .NET backend + SQL Server

---

# 🏗️ System Architecture

```
Angular Frontend
      ↓
.NET Web API Backend
      ↓
SQL Server Database
```

### Roles

* ADMIN
* DOCTOR
* PATIENT

---

# 🗄️ Database Schema (DBML)

```
Table Users {
  Id int [pk, increment]
  Name varchar
  Email varchar [unique, not null]
  PasswordHash varchar
  Role varchar // ADMIN, PATIENT, DOCTOR
  Phone varchar
  CreatedAt datetime
}

Table Patients {
  Id int [pk, increment]
  UserId int [unique, not null]

  Gender varchar
  DOB date
  BloodGroup varchar
  Address varchar
  EmergencyContact varchar

  CreatedAt datetime
}

Table Specialities {
  Id int [pk, increment]
  Name varchar [unique, not null]
  Description text
  CreatedAt datetime
}

Table Doctors {
  Id int [pk, increment]
  UserId int [unique, not null]
  SpecialityId int [not null]

  Image varchar
  Degree varchar
  Experience varchar
  About text
  Fees decimal
  Location varchar
  IsAvailable boolean
  IsVerified boolean
  CreatedAt datetime
}

Table Appointments {
  Id int [pk, increment]
  PatientId int [not null]
  DoctorId int [not null]

  SlotDate date
  SlotTime varchar
  SlotType varchar // ONLINE or OFFLINE

  Status varchar // BOOKED, COMPLETED, CANCELLED
  Amount decimal
  PaymentStatus boolean
  CreatedAt datetime

  Indexes {
    (DoctorId, SlotDate, SlotTime) [unique]
  }
}

Table DailySummary {
  Id int [pk, increment]
  DoctorId int [not null]
  SummaryDate date

  TotalAppointments int
  CompletedAppointments int
  TotalRevenue decimal
  CreatedAt datetime
}

Ref: Patients.UserId > Users.Id
Ref: Doctors.UserId > Users.Id
Ref: Doctors.SpecialityId > Specialities.Id
Ref: Appointments.PatientId > Patients.Id
Ref: Appointments.DoctorId > Doctors.Id
Ref: DailySummary.DoctorId > Doctors.Id
```

---

# 🔐 Authentication System

## Register

* User selects role: PATIENT or DOCTOR
* Create entry in Users
* If PATIENT → create Patients record
* If DOCTOR → create Doctors record with `IsVerified = false`

## Login

* Validate credentials
* Generate JWT token
* Return role + token

## Role Based Routing

* ADMIN → admin dashboard
* DOCTOR → doctor dashboard
* PATIENT → patient dashboard

---

# 👨‍💼 Admin Features

## Doctor Approval

* View unverified doctors
* Approve doctor (`IsVerified = true`)

## Dashboard

* Total patients
* Total doctors
* Total appointments

## View Data

* All doctors
* All patients

---

# 🩺 Doctor Features

## Login Behavior

* If not verified → show "Waiting for approval"
* If verified → show dashboard

## Doctor Dashboard

* View past appointments
* View current appointments
* Toggle availability (available / unavailable)
* Update profile

## Profile Fields

* Image
* Degree
* Experience
* About
* Fees
* Location

---

# 🧑‍⚕️ Patient Features

## Dashboard

* View all doctors
* Filter doctors by speciality
* Book appointment
* View bookings
* Manage profile

## Booking

* Select doctor
* Select date
* Select time slot
* Select slot type (online/offline)

No payment integration required.

---

# ⏰ Appointment Rules (Important)

## Slot Validation

* One doctor → one booking per slot
* Prevent duplicate booking
* Prevent booking past time
* Only verified doctor can be booked
* Only available doctor can be booked

## UI Behavior

* Show booked slots disabled
* Show past slots disabled

---

# 🔌 API Design

## Auth

```
POST /api/auth/register
POST /api/auth/login
```

## Admin

```
GET /api/admin/dashboard
GET /api/admin/doctors/pending
PUT /api/admin/doctors/{id}/approve
GET /api/admin/patients
GET /api/admin/doctors
```

## Doctors

```
GET /api/doctors
GET /api/doctors?specialityId=1
GET /api/doctors/{id}
PUT /api/doctors/profile
PUT /api/doctors/availability
GET /api/doctors/{id}/appointments
```

## Patients

```
GET /api/patients/profile
PUT /api/patients/profile
GET /api/patients/appointments
```

## Specialities

```
GET /api/specialities
```

## Appointments

```
POST /api/appointments
GET /api/appointments/{id}
```

---

# 🧠 Backend Architecture (.NET)

## Folder Structure

```
backend/
├── Controllers/
├── Models/
├── DTOs/
├── Services/
├── Repositories/
├── Data/
├── Middleware/
├── Helpers/
├── Migrations/
├── Program.cs
└── appsettings.json
```

## Controllers

* AuthController
* AdminController
* DoctorsController
* PatientsController
* AppointmentsController
* SpecialitiesController

## Services

* Authentication
* Appointment validation
* Doctor approval
* Slot validation

---

# 🎨 Frontend Architecture (Angular)

## Folder Structure

```
frontend/
├── core/
│   ├── services/
│   ├── guards/
│   └── interceptors/
│
├── shared/
│   └── components/
│
├── features/
│   ├── auth/
│   ├── admin/
│   ├── doctor/
│   └── patient/
```

---

## Angular Routes

```
/login
/register

/admin/dashboard
/admin/doctors
/admin/patients

/doctor/dashboard
/doctor/appointments
/doctor/profile

/patient/dashboard
/patient/doctors
/patient/book
/patient/my-bookings
```

---

# 🔒 Security Requirements

* JWT authentication
* Role-based authorization
* Password hashing
* API route protection

---

# 🚀 Development Order

## Phase 1 — Backend

* Authentication
* Doctor approval
* Specialities API
* Appointment system

## Phase 2 — Frontend

* Auth UI
* Role routing
* Dashboards
* Booking UI

---

# ⭐ Future Improvements (Optional)

* Payment integration
* Email notifications
* Doctor schedule table
* Appointment reschedule
* Reviews & ratings
* Notifications
* Availability time slots

---

# ✅ Expected Outcome

A complete hospital booking system with:

* Role-based login
* Doctor approval workflow
* Appointment booking system
* Slot validation
* Admin dashboard
* Angular + .NET architecture

```
```
