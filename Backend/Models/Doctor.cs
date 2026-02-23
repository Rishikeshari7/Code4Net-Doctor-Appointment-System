using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalBookingSystem.Models;

public class Doctor
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int SpecialityId { get; set; }

    [MaxLength(500)]
    public string? Image { get; set; }

    [MaxLength(100)]
    public string? Degree { get; set; }

    [MaxLength(50)]
    public string? Experience { get; set; }

    [MaxLength(1000)]
    public string? About { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Fees { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    public bool IsAvailable { get; set; } = true;

    public bool IsVerified { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [ForeignKey(nameof(SpecialityId))]
    public Speciality Speciality { get; set; } = null!;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<DailySummary> DailySummaries { get; set; } = new List<DailySummary>();
}
