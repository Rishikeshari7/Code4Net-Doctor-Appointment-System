using System.ComponentModel.DataAnnotations;

namespace HospitalBookingSystem.DTOs.Auth;

public class RegisterDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty; // PATIENT or DOCTOR

    [MaxLength(20)]
    public string? Phone { get; set; }

    // Doctor-specific fields (optional, only when Role = DOCTOR)
    public int? SpecialityId { get; set; }
    public string? Degree { get; set; }
    public string? Experience { get; set; }
    public decimal? Fees { get; set; }
}
