using Microsoft.AspNetCore.Mvc;
using HospitalBookingSystem.Repositories.Interfaces;

namespace HospitalBookingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpecialitiesController : ControllerBase
{
    private readonly ISpecialityRepository _specialityRepo;

    public SpecialitiesController(ISpecialityRepository specialityRepo)
    {
        _specialityRepo = specialityRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _specialityRepo.GetAllAsync();
        return Ok(result);
    }
}