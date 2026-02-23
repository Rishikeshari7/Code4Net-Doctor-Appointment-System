using Microsoft.EntityFrameworkCore;
using HospitalBookingSystem.Data;
using HospitalBookingSystem.Models;
using HospitalBookingSystem.Repositories.Interfaces;

namespace HospitalBookingSystem.Repositories.Implementations;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _context;

    public AppointmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Appointment?> GetByIdAsync(int id)
    {
        return await _context.Appointments
            .Include(a => a.Patient).ThenInclude(p => p.User)
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .Include(a => a.Doctor).ThenInclude(d => d.Speciality)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Appointment> CreateAsync(Appointment appointment)
    {
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
        return appointment;
    }

    public async Task<bool> IsSlotBookedAsync(int doctorId, DateOnly slotDate, string slotTime)
    {
        return await _context.Appointments
            .AnyAsync(a => a.DoctorId == doctorId
                       && a.SlotDate == slotDate
                       && a.SlotTime == slotTime
                       && a.Status != "CANCELLED");
    }

    public async Task<List<Appointment>> GetByDoctorIdAsync(int doctorId)
    {
        return await _context.Appointments
            .Include(a => a.Patient).ThenInclude(p => p.User)
            .Include(a => a.Doctor).ThenInclude(d => d.Speciality)
            .Where(a => a.DoctorId == doctorId)
            .OrderByDescending(a => a.SlotDate)
            .ThenByDescending(a => a.SlotTime)
            .ToListAsync();
    }

    public async Task<List<Appointment>> GetByPatientIdAsync(int patientId)
    {
        return await _context.Appointments
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .Include(a => a.Doctor).ThenInclude(d => d.Speciality)
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.SlotDate)
            .ThenByDescending(a => a.SlotTime)
            .ToListAsync();
    }

    public async Task<List<string>> GetBookedSlotsAsync(int doctorId, DateOnly date)
    {
        return await _context.Appointments
            .Where(a => a.DoctorId == doctorId
                     && a.SlotDate == date
                     && a.Status != "CANCELLED")
            .Select(a => a.SlotTime)
            .ToListAsync();
    }

    public async Task<int> GetCountAsync()
    {
        return await _context.Appointments.CountAsync();
    }

    public async Task UpdateAsync(Appointment appointment)
    {
        _context.Appointments.Update(appointment);
        await _context.SaveChangesAsync();
    }
}
