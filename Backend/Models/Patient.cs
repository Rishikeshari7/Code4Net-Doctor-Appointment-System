using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalBookingSystem.Models;

public class Patient
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [MaxLength(10)]
    public string? Gender { get; set; }

    public DateOnly? DOB { get; set; }

    [MaxLength(10)]
    public string? BloodGroup { get; set; }

    [MaxLength(300)]
    public string? Address { get; set; }

    [MaxLength(20)]
    public string? EmergencyContact { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
