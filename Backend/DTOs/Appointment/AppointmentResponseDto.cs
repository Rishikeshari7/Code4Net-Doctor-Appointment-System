namespace HospitalBookingSystem.DTOs.Appointment;

public class AppointmentResponseDto
{
    public int Id { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string Speciality { get; set; } = string.Empty;
    public DateOnly SlotDate { get; set; }
    public string SlotTime { get; set; } = string.Empty;
    public string SlotType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public bool PaymentStatus { get; set; }
    public DateTime CreatedAt { get; set; }
}
