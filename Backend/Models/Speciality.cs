using System.ComponentModel.DataAnnotations;

namespace HospitalBookingSystem.Models;

public class Speciality
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}
