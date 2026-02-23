using Microsoft.EntityFrameworkCore;
using HospitalBookingSystem.Data;
using HospitalBookingSystem.Models;
using HospitalBookingSystem.Repositories.Interfaces;

namespace HospitalBookingSystem.Repositories.Implementations;

public class SpecialityRepository : ISpecialityRepository
{
    private readonly AppDbContext _context;

    public SpecialityRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Speciality>> GetAllAsync()
    {
        return await _context.Specialities.ToListAsync();
    }

    public async Task<Speciality?> GetByIdAsync(int id)
    {
        return await _context.Specialities.FindAsync(id);
    }
}
