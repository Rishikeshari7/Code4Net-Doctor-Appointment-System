using HospitalBookingSystem.Models;

namespace HospitalBookingSystem.Repositories.Interfaces;

public interface IAppointmentRepository
{
    Task<Appointment?> GetByIdAsync(int id);
    Task<Appointment> CreateAsync(Appointment appointment);
    Task<bool> IsSlotBookedAsync(int doctorId, DateOnly slotDate, string slotTime);
    Task<List<Appointment>> GetByDoctorIdAsync(int doctorId);
    Task<List<Appointment>> GetByPatientIdAsync(int patientId);
    Task<List<string>> GetBookedSlotsAsync(int doctorId, DateOnly date);
    Task<int> GetCountAsync();
    Task UpdateAsync(Appointment appointment);
}
