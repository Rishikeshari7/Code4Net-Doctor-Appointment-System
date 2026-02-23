using System.ComponentModel.DataAnnotations;

namespace HospitalBookingSystem.DTOs.Appointment;

public class CreateAppointmentDto
{
    [Required]
    public int DoctorId { get; set; }

    [Required]
    public DateOnly SlotDate { get; set; }

    [Required]
    public string SlotTime { get; set; } = string.Empty; // e.g. "10:00"

    [Required]
    public string SlotType { get; set; } = string.Empty; // ONLINE or OFFLINE
}
