namespace HospitalBookingSystem.DTOs.Patient;

public class PatientProfileDto
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Gender { get; set; }
    public DateOnly? DOB { get; set; }
    public string? BloodGroup { get; set; }
    public string? Address { get; set; }
    public string? EmergencyContact { get; set; }
}
