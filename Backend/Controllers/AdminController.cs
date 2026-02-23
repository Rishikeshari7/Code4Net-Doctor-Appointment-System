using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HospitalBookingSystem.Services;

namespace HospitalBookingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;

    public AdminController(AdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var result = await _adminService.GetDashboardAsync();
        return Ok(result);
    }

    [HttpGet("doctors/pending")]
    public async Task<IActionResult> GetPendingDoctors()
    {
        var result = await _adminService.GetPendingDoctorsAsync();
        return Ok(result);
    }

    [HttpPut("doctors/{id}/approve")]
    public async Task<IActionResult> ApproveDoctor(int id)
    {
        var success = await _adminService.ApproveDoctorAsync(id);
        if (!success) return NotFound(new { message = "Doctor not found" });
        return Ok(new { message = "Doctor approved successfully" });
    }

    [HttpGet("doctors")]
    public async Task<IActionResult> GetAllDoctors()
    {
        var result = await _adminService.GetAllDoctorsAsync();
        return Ok(result);
    }

    [HttpGet("patients")]
    public async Task<IActionResult> GetAllPatients()
    {
        var result = await _adminService.GetAllPatientsAsync();
        return Ok(result);
    }
}