using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HospitalBookingSystem.DTOs.Appointment;
using HospitalBookingSystem.Services;

namespace HospitalBookingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly AppointmentService _appointmentService;

    public AppointmentsController(AppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpPost]
    [Authorize(Roles = "PATIENT")]
    public async Task<IActionResult> Create([FromBody] CreateAppointmentDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _appointmentService.CreateAsync(userId, dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _appointmentService.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "Appointment not found" });
        return Ok(result);
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = GetUserId();
        var success = await _appointmentService.CancelAsync(id, userId);
        if (!success) return BadRequest(new { message = "Cannot cancel this appointment" });
        return Ok(new { message = "Appointment cancelled successfully" });
    }

    [HttpPut("{id}/complete")]
    [Authorize(Roles = "DOCTOR")]
    public async Task<IActionResult> Complete(int id)
    {
        var userId = GetUserId();
        var success = await _appointmentService.CompleteAsync(id, userId);
        if (!success) return BadRequest(new { message = "Cannot complete this appointment" });
        return Ok(new { message = "Appointment completed successfully" });
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}