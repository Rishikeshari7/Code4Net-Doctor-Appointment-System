namespace HospitalBookingSystem.DTOs.Doctor;

public class DoctorResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Image { get; set; }
    public string? Degree { get; set; }
    public string? Experience { get; set; }
    public string? About { get; set; }
    public decimal Fees { get; set; }
    public string? Location { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsVerified { get; set; }
    public string Speciality { get; set; } = string.Empty;
    public int SpecialityId { get; set; }
}
