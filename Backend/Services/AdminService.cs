using HospitalBookingSystem.DTOs.Admin;
using HospitalBookingSystem.DTOs.Doctor;
using HospitalBookingSystem.DTOs.Patient;
using HospitalBookingSystem.Repositories.Interfaces;

namespace HospitalBookingSystem.Services;

public class AdminService
{
    private readonly IDoctorRepository _doctorRepo;
    private readonly IPatientRepository _patientRepo;
    private readonly IAppointmentRepository _appointmentRepo;

    public AdminService(
        IDoctorRepository doctorRepo,
        IPatientRepository patientRepo,
        IAppointmentRepository appointmentRepo)
    {
        _doctorRepo = doctorRepo;
        _patientRepo = patientRepo;
        _appointmentRepo = appointmentRepo;
    }

    public async Task<DashboardDto> GetDashboardAsync()
    {
        return new DashboardDto
        {
            TotalDoctors = await _doctorRepo.GetCountAsync(),
            TotalPatients = await _patientRepo.GetCountAsync(),
            TotalAppointments = await _appointmentRepo.GetCountAsync()
        };
    }

    public async Task<List<DoctorResponseDto>> GetPendingDoctorsAsync()
    {
        var doctors = await _doctorRepo.GetPendingAsync();
        return doctors.Select(d => new DoctorResponseDto
        {
            Id = d.Id,
            Name = d.User.Name,
            Email = d.User.Email,
            Phone = d.User.Phone,
            Image = d.Image,
            Degree = d.Degree,
            Experience = d.Experience,
            About = d.About,
            Fees = d.Fees,
            Location = d.Location,
            IsAvailable = d.IsAvailable,
            IsVerified = d.IsVerified,
            Speciality = d.Speciality.Name,
            SpecialityId = d.SpecialityId
        }).ToList();
    }

    public async Task<bool> ApproveDoctorAsync(int doctorId)
    {
        var doctor = await _doctorRepo.GetByIdAsync(doctorId);
        if (doctor == null) return false;

        doctor.IsVerified = true;
        await _doctorRepo.UpdateAsync(doctor);
        return true;
    }

    public async Task<List<DoctorResponseDto>> GetAllDoctorsAsync()
    {
        var doctors = await _doctorRepo.GetAllAsync();
        return doctors.Select(d => new DoctorResponseDto
        {
            Id = d.Id,
            Name = d.User.Name,
            Email = d.User.Email,
            Phone = d.User.Phone,
            Image = d.Image,
            Degree = d.Degree,
            Experience = d.Experience,
            About = d.About,
            Fees = d.Fees,
            Location = d.Location,
            IsAvailable = d.IsAvailable,
            IsVerified = d.IsVerified,
            Speciality = d.Speciality.Name,
            SpecialityId = d.SpecialityId
        }).ToList();
    }

    public async Task<List<PatientResponseDto>> GetAllPatientsAsync()
    {
        var patients = await _patientRepo.GetAllAsync();
        return patients.Select(p => new PatientResponseDto
        {
            Id = p.Id,
            Name = p.User.Name,
            Email = p.User.Email,
            Phone = p.User.Phone,
            Gender = p.Gender,
            DOB = p.DOB,
            BloodGroup = p.BloodGroup,
            Address = p.Address,
            EmergencyContact = p.EmergencyContact
        }).ToList();
    }
}
