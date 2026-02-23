using HospitalBookingSystem.DTOs.Auth;
using HospitalBookingSystem.Helpers;
using HospitalBookingSystem.Models;
using HospitalBookingSystem.Repositories.Interfaces;

namespace HospitalBookingSystem.Services;

public class AuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IPatientRepository _patientRepo;
    private readonly IDoctorRepository _doctorRepo;
    private readonly JwtHelper _jwtHelper;

    public AuthService(
        IUserRepository userRepo,
        IPatientRepository patientRepo,
        IDoctorRepository doctorRepo,
        JwtHelper jwtHelper)
    {
        _userRepo = userRepo;
        _patientRepo = patientRepo;
        _doctorRepo = doctorRepo;
        _jwtHelper = jwtHelper;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var role = dto.Role.ToUpper();
        if (role != "PATIENT" && role != "DOCTOR")
            throw new Exception("Role must be PATIENT or DOCTOR");

        var existing = await _userRepo.GetByEmailAsync(dto.Email);
        if (existing != null)
            throw new Exception("Email already registered");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = PasswordHasher.Hash(dto.Password),
            Role = role,
            Phone = dto.Phone
        };

        await _userRepo.CreateAsync(user);

        if (role == "PATIENT")
        {
            await _patientRepo.CreateAsync(new Patient { UserId = user.Id });
        }
        else if (role == "DOCTOR")
        {
            if (dto.SpecialityId == null)
                throw new Exception("SpecialityId is required for doctors");

            await _doctorRepo.CreateAsync(new Doctor
            {
                UserId = user.Id,
                SpecialityId = dto.SpecialityId.Value,
                Degree = dto.Degree,
                Experience = dto.Experience,
                Fees = dto.Fees ?? 0,
                IsVerified = false,
                IsAvailable = true
            });
        }

        var token = _jwtHelper.GenerateToken(user.Id, user.Email, user.Role);

        return new AuthResponseDto
        {
            Token = token,
            Role = user.Role,
            UserId = user.Id,
            Name = user.Name
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null)
            throw new Exception("Invalid email or password");

        if (!PasswordHasher.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Invalid email or password");

        var token = _jwtHelper.GenerateToken(user.Id, user.Email, user.Role);

        return new AuthResponseDto
        {
            Token = token,
            Role = user.Role,
            UserId = user.Id,
            Name = user.Name
        };
    }
}
