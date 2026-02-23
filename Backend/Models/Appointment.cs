using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalBookingSystem.Models;

public class Appointment
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int PatientId { get; set; }

    [Required]
    public int DoctorId { get; set; }

    [Required]
    public DateOnly SlotDate { get; set; }

    [Required, MaxLength(10)]
    public string SlotTime { get; set; } = string.Empty; // e.g. "10:00"

    [Required, MaxLength(10)]
    public string SlotType { get; set; } = string.Empty; // ONLINE or OFFLINE

    [Required, MaxLength(20)]
    public string Status { get; set; } = "BOOKED"; // BOOKED, COMPLETED, CANCELLED

    [Column(TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }

    public bool PaymentStatus { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(PatientId))]
    public Patient Patient { get; set; } = null!;

    [ForeignKey(nameof(DoctorId))]
    public Doctor Doctor { get; set; } = null!;
}
