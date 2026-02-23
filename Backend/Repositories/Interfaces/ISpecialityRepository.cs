using HospitalBookingSystem.Models;

namespace HospitalBookingSystem.Repositories.Interfaces;

public interface ISpecialityRepository
{
    Task<List<Speciality>> GetAllAsync();
    Task<Speciality?> GetByIdAsync(int id);
}
