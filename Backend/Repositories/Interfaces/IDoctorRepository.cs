using HospitalBookingSystem.Models;

namespace HospitalBookingSystem.Repositories.Interfaces;

public interface IDoctorRepository
{
    Task<Doctor?> GetByIdAsync(int id);
    Task<Doctor?> GetByUserIdAsync(int userId);
    Task<Doctor> CreateAsync(Doctor doctor);
    Task UpdateAsync(Doctor doctor);
    Task<List<Doctor>> GetAllAsync();
    Task<List<Doctor>> GetBySpecialityIdAsync(int specialityId);
    Task<List<Doctor>> GetPendingAsync();
    Task<int> GetCountAsync();
}
