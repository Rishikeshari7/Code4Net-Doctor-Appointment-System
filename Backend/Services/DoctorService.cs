using HospitalBookingSystem.DTOs.Doctor;
using HospitalBookingSystem.Repositories.Interfaces;

namespace HospitalBookingSystem.Services;

public class DoctorService
{
    private readonly IDoctorRepository _doctorRepo;
    private readonly IAppointmentRepository _appointmentRepo;

    public DoctorService(IDoctorRepository doctorRepo, IAppointmentRepository appointmentRepo)
    {
        _doctorRepo = doctorRepo;
        _appointmentRepo = appointmentRepo;
    }

    public async Task<List<DoctorResponseDto>> GetAllDoctorsAsync(int? specialityId)
    {
        var doctors = specialityId.HasValue
            ? await _doctorRepo.GetBySpecialityIdAsync(specialityId.Value)
            : await _doctorRepo.GetAllAsync();

        return doctors
            .Where(d => d.IsVerified)
            .Select(MapToDto)
            .ToList();
    }

    public async Task<DoctorResponseDto?> GetDoctorByIdAsync(int id)
    {
        var doctor = await _doctorRepo.GetByIdAsync(id);
        return doctor == null ? null : MapToDto(doctor);
    }

    public async Task<DoctorResponseDto?> GetDoctorByUserIdAsync(int userId)
    {
        var doctor = await _doctorRepo.GetByUserIdAsync(userId);
        return doctor == null ? null : MapToDto(doctor);
    }

    public async Task<bool> UpdateProfileAsync(int userId, DoctorProfileDto dto)
    {
        var doctor = await _doctorRepo.GetByUserIdAsync(userId);
        if (doctor == null) return false;

        if (dto.Image != null) doctor.Image = dto.Image;
        if (dto.Degree != null) doctor.Degree = dto.Degree;
        if (dto.Experience != null) doctor.Experience = dto.Experience;
        if (dto.About != null) doctor.About = dto.About;
        if (dto.Fees.HasValue) doctor.Fees = dto.Fees.Value;
        if (dto.Location != null) doctor.Location = dto.Location;

        await _doctorRepo.UpdateAsync(doctor);
        return true;
    }

    public async Task<bool> UpdateAvailabilityAsync(int userId, bool isAvailable)
    {
        var doctor = await _doctorRepo.GetByUserIdAsync(userId);
        if (doctor == null) return false;

        doctor.IsAvailable = isAvailable;
        await _doctorRepo.UpdateAsync(doctor);
        return true;
    }

    public async Task<List<string>> GetBookedSlotsAsync(int doctorId, DateOnly date)
    {
        return await _appointmentRepo.GetBookedSlotsAsync(doctorId, date);
    }

    private static DoctorResponseDto MapToDto(Models.Doctor doctor)
    {
        return new DoctorResponseDto
        {
            Id = doctor.Id,
            Name = doctor.User.Name,
            Email = doctor.User.Email,
            Phone = doctor.User.Phone,
            Image = doctor.Image,
            Degree = doctor.Degree,
            Experience = doctor.Experience,
            About = doctor.About,
            Fees = doctor.Fees,
            Location = doctor.Location,
            IsAvailable = doctor.IsAvailable,
            IsVerified = doctor.IsVerified,
            Speciality = doctor.Speciality.Name,
            SpecialityId = doctor.SpecialityId
        };
    }
}
