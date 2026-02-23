using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalBookingSystem.Models;

public class DailySummary
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int DoctorId { get; set; }

    [Required]
    public DateOnly SummaryDate { get; set; }

    public int TotalAppointments { get; set; }
    public int CompletedAppointments { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalRevenue { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(DoctorId))]
    public Doctor Doctor { get; set; } = null!;
}
