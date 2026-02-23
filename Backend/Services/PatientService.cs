using HospitalBookingSystem.DTOs.Patient;
using HospitalBookingSystem.Repositories.Interfaces;

namespace HospitalBookingSystem.Services;

public class PatientService
{
    private readonly IPatientRepository _patientRepo;
    private readonly IUserRepository _userRepo;

    public PatientService(IPatientRepository patientRepo, IUserRepository userRepo)
    {
        _patientRepo = patientRepo;
        _userRepo = userRepo;
    }

    public async Task<PatientResponseDto?> GetProfileAsync(int userId)
    {
        var patient = await _patientRepo.GetByUserIdAsync(userId);
        return patient == null ? null : MapToDto(patient);
    }

    public async Task<bool> UpdateProfileAsync(int userId, PatientProfileDto dto)
    {
        var patient = await _patientRepo.GetByUserIdAsync(userId);
        if (patient == null) return false;

        if (dto.Name != null) patient.User.Name = dto.Name;
        if (dto.Phone != null) patient.User.Phone = dto.Phone;
        if (dto.Gender != null) patient.Gender = dto.Gender;
        if (dto.DOB.HasValue) patient.DOB = dto.DOB;
        if (dto.BloodGroup != null) patient.BloodGroup = dto.BloodGroup;
        if (dto.Address != null) patient.Address = dto.Address;
        if (dto.EmergencyContact != null) patient.EmergencyContact = dto.EmergencyContact;

        await _patientRepo.UpdateAsync(patient);
        return true;
    }

    private static PatientResponseDto MapToDto(Models.Patient patient)
    {
        return new PatientResponseDto
        {
            Id = patient.Id,
            Name = patient.User.Name,
            Email = patient.User.Email,
            Phone = patient.User.Phone,
            Gender = patient.Gender,
            DOB = patient.DOB,
            BloodGroup = patient.BloodGroup,
            Address = patient.Address,
            EmergencyContact = patient.EmergencyContact
        };
    }
}
