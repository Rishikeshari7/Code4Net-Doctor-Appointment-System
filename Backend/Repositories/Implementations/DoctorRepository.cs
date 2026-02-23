using Microsoft.EntityFrameworkCore;
using HospitalBookingSystem.Data;
using HospitalBookingSystem.Models;
using HospitalBookingSystem.Repositories.Interfaces;

namespace HospitalBookingSystem.Repositories.Implementations;

public class DoctorRepository : IDoctorRepository
{
    private readonly AppDbContext _context;

    public DoctorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Doctor?> GetByIdAsync(int id)
    {
        return await _context.Doctors
            .Include(d => d.User)
            .Include(d => d.Speciality)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Doctor?> GetByUserIdAsync(int userId)
    {
        return await _context.Doctors
            .Include(d => d.User)
            .Include(d => d.Speciality)
            .FirstOrDefaultAsync(d => d.UserId == userId);
    }

    public async Task<Doctor> CreateAsync(Doctor doctor)
    {
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();
        return doctor;
    }

    public async Task UpdateAsync(Doctor doctor)
    {
        _context.Doctors.Update(doctor);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Doctor>> GetAllAsync()
    {
        return await _context.Doctors
            .Include(d => d.User)
            .Include(d => d.Speciality)
            .ToListAsync();
    }

    public async Task<List<Doctor>> GetBySpecialityIdAsync(int specialityId)
    {
        return await _context.Doctors
            .Include(d => d.User)
            .Include(d => d.Speciality)
            .Where(d => d.SpecialityId == specialityId && d.IsVerified)
            .ToListAsync();
    }

    public async Task<List<Doctor>> GetPendingAsync()
    {
        return await _context.Doctors
            .Include(d => d.User)
            .Include(d => d.Speciality)
            .Where(d => !d.IsVerified)
            .ToListAsync();
    }

    public async Task<int> GetCountAsync()
    {
        return await _context.Doctors.CountAsync();
    }
}
