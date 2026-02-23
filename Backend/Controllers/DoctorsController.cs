using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HospitalBookingSystem.DTOs.Doctor;
using HospitalBookingSystem.Services;

namespace HospitalBookingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly DoctorService _doctorService;
    private readonly AppointmentService _appointmentService;

    public DoctorsController(DoctorService doctorService, AppointmentService appointmentService)
    {
        _doctorService = doctorService;
        _appointmentService = appointmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? specialityId)
    {
        var result = await _doctorService.GetAllDoctorsAsync(specialityId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _doctorService.GetDoctorByIdAsync(id);
        if (result == null) return NotFound(new { message = "Doctor not found" });
        return Ok(result);
    }

    [HttpGet("{id}/available-slots")]
    public async Task<IActionResult> GetAvailableSlots(int id, [FromQuery] DateOnly date)
    {
        var bookedSlots = await _doctorService.GetBookedSlotsAsync(id, date);
        return Ok(new { bookedSlots });
    }

    [Authorize(Roles = "DOCTOR")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetUserId();
        var result = await _doctorService.GetDoctorByUserIdAsync(userId);
        if (result == null) return NotFound(new { message = "Doctor profile not found" });
        return Ok(result);
    }

    [Authorize(Roles = "DOCTOR")]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] DoctorProfileDto dto)
    {
        var userId = GetUserId();
        var success = await _doctorService.UpdateProfileAsync(userId, dto);
        if (!success) return NotFound(new { message = "Doctor not found" });
        return Ok(new { message = "Profile updated successfully" });
    }

    [Authorize(Roles = "DOCTOR")]
    [HttpPut("availability")]
    public async Task<IActionResult> UpdateAvailability([FromBody] DoctorAvailabilityDto dto)
    {
        var userId = GetUserId();
        var success = await _doctorService.UpdateAvailabilityAsync(userId, dto.IsAvailable);
        if (!success) return NotFound(new { message = "Doctor not found" });
        return Ok(new { message = "Availability updated successfully" });
    }

    [Authorize(Roles = "DOCTOR")]
    [HttpGet("appointments")]
    public async Task<IActionResult> GetMyAppointments()
    {
        var userId = GetUserId();
        var result = await _appointmentService.GetByDoctorUserIdAsync(userId);
        return Ok(result);
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}