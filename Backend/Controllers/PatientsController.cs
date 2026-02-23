using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HospitalBookingSystem.DTOs.Patient;
using HospitalBookingSystem.Services;

namespace HospitalBookingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "PATIENT")]
public class PatientsController : ControllerBase
{
    private readonly PatientService _patientService;
    private readonly AppointmentService _appointmentService;

    public PatientsController(PatientService patientService, AppointmentService appointmentService)
    {
        _patientService = patientService;
        _appointmentService = appointmentService;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var result = await _patientService.GetProfileAsync(userId);
        if (result == null) return NotFound(new { message = "Patient not found" });
        return Ok(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] PatientProfileDto dto)
    {
        var userId = GetUserId();
        var success = await _patientService.UpdateProfileAsync(userId, dto);
        if (!success) return NotFound(new { message = "Patient not found" });
        return Ok(new { message = "Profile updated successfully" });
    }

    [HttpGet("appointments")]
    public async Task<IActionResult> GetMyAppointments()
    {
        var userId = GetUserId();
        var result = await _appointmentService.GetByPatientUserIdAsync(userId);
        return Ok(result);
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}