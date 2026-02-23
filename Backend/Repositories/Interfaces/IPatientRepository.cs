using HospitalBookingSystem.Models;

namespace HospitalBookingSystem.Repositories.Interfaces;

public interface IPatientRepository
{
    Task<Patient?> GetByUserIdAsync(int userId);
    Task<Patient?> GetByIdAsync(int id);
    Task<Patient> CreateAsync(Patient patient);
    Task UpdateAsync(Patient patient);
    Task<List<Patient>> GetAllAsync();
    Task<int> GetCountAsync();
}
