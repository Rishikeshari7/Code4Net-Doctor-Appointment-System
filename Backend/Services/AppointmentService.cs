using HospitalBookingSystem.DTOs.Appointment;
using HospitalBookingSystem.Models;
using HospitalBookingSystem.Repositories.Interfaces;

namespace HospitalBookingSystem.Services;

public class AppointmentService
{
    private readonly IAppointmentRepository _appointmentRepo;
    private readonly IDoctorRepository _doctorRepo;
    private readonly IPatientRepository _patientRepo;

    public AppointmentService(
        IAppointmentRepository appointmentRepo,
        IDoctorRepository doctorRepo,
        IPatientRepository patientRepo)
    {
        _appointmentRepo = appointmentRepo;
        _doctorRepo = doctorRepo;
        _patientRepo = patientRepo;
    }

    public async Task<AppointmentResponseDto> CreateAsync(int userId, CreateAppointmentDto dto)
    {
        // Get patient by userId
        var patient = await _patientRepo.GetByUserIdAsync(userId);
        if (patient == null)
            throw new Exception("Patient not found");

        // Validate doctor
        var doctor = await _doctorRepo.GetByIdAsync(dto.DoctorId);
        if (doctor == null)
            throw new Exception("Doctor not found");

        if (!doctor.IsVerified)
            throw new Exception("Doctor is not verified yet");

        if (!doctor.IsAvailable)
            throw new Exception("Doctor is currently unavailable");

        // Validate slot type
        var slotType = dto.SlotType.ToUpper();
        if (slotType != "ONLINE" && slotType != "OFFLINE")
            throw new Exception("SlotType must be ONLINE or OFFLINE");

        // Prevent past booking
        var slotDateTime = dto.SlotDate.ToDateTime(TimeOnly.Parse(dto.SlotTime));
        if (slotDateTime < DateTime.Now)
            throw new Exception("Cannot book a slot in the past");

        // Check if slot is already booked
        var isBooked = await _appointmentRepo.IsSlotBookedAsync(dto.DoctorId, dto.SlotDate, dto.SlotTime);
        if (isBooked)
            throw new Exception("This slot is already booked");

        var appointment = new Appointment
        {
            PatientId = patient.Id,
            DoctorId = dto.DoctorId,
            SlotDate = dto.SlotDate,
            SlotTime = dto.SlotTime,
            SlotType = slotType,
            Status = "BOOKED",
            Amount = doctor.Fees,
            PaymentStatus = false
        };

        await _appointmentRepo.CreateAsync(appointment);

        // Reload with navigation properties
        var created = await _appointmentRepo.GetByIdAsync(appointment.Id);
        return MapToDto(created!);
    }

    public async Task<AppointmentResponseDto?> GetByIdAsync(int id)
    {
        var appointment = await _appointmentRepo.GetByIdAsync(id);
        return appointment == null ? null : MapToDto(appointment);
    }

    public async Task<List<AppointmentResponseDto>> GetByDoctorUserIdAsync(int userId)
    {
        var doctor = await _doctorRepo.GetByUserIdAsync(userId);
        if (doctor == null) return new List<AppointmentResponseDto>();

        var appointments = await _appointmentRepo.GetByDoctorIdAsync(doctor.Id);
        return appointments.Select(MapToDto).ToList();
    }

    public async Task<List<AppointmentResponseDto>> GetByPatientUserIdAsync(int userId)
    {
        var patient = await _patientRepo.GetByUserIdAsync(userId);
        if (patient == null) return new List<AppointmentResponseDto>();

        var appointments = await _appointmentRepo.GetByPatientIdAsync(patient.Id);
        return appointments.Select(MapToDto).ToList();
    }

    public async Task<bool> CancelAsync(int appointmentId, int userId)
    {
        var appointment = await _appointmentRepo.GetByIdAsync(appointmentId);
        if (appointment == null) return false;

        // Verify the appointment belongs to this user (patient or doctor)
        var patient = await _patientRepo.GetByUserIdAsync(userId);
        var doctor = await _doctorRepo.GetByUserIdAsync(userId);

        bool isOwner = (patient != null && appointment.PatientId == patient.Id)
                    || (doctor != null && appointment.DoctorId == doctor.Id);

        if (!isOwner) return false;

        appointment.Status = "CANCELLED";
        await _appointmentRepo.UpdateAsync(appointment);
        return true;
    }

    public async Task<bool> CompleteAsync(int appointmentId, int userId)
    {
        var appointment = await _appointmentRepo.GetByIdAsync(appointmentId);
        if (appointment == null) return false;

        var doctor = await _doctorRepo.GetByUserIdAsync(userId);
        if (doctor == null || appointment.DoctorId != doctor.Id) return false;

        appointment.Status = "COMPLETED";
        await _appointmentRepo.UpdateAsync(appointment);
        return true;
    }

    private static AppointmentResponseDto MapToDto(Appointment a)
    {
        return new AppointmentResponseDto
        {
            Id = a.Id,
            PatientName = a.Patient.User.Name,
            DoctorName = a.Doctor.User.Name,
            Speciality = a.Doctor.Speciality.Name,
            SlotDate = a.SlotDate,
            SlotTime = a.SlotTime,
            SlotType = a.SlotType,
            Status = a.Status,
            Amount = a.Amount,
            PaymentStatus = a.PaymentStatus,
            CreatedAt = a.CreatedAt
        };
    }
}
