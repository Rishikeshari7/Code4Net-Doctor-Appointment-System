using Microsoft.EntityFrameworkCore;
using HospitalBookingSystem.Models;

namespace HospitalBookingSystem.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Speciality> Specialities => Set<Speciality>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<DailySummary> DailySummaries => Set<DailySummary>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
        });

        // Patient - one-to-one with User
        modelBuilder.Entity<Patient>(e =>
        {
            e.HasIndex(p => p.UserId).IsUnique();
            e.HasOne(p => p.User)
             .WithOne(u => u.Patient)
             .HasForeignKey<Patient>(p => p.UserId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Speciality
        modelBuilder.Entity<Speciality>(e =>
        {
            e.HasIndex(s => s.Name).IsUnique();
        });

        // Doctor - one-to-one with User, many-to-one with Speciality
        modelBuilder.Entity<Doctor>(e =>
        {
            e.HasIndex(d => d.UserId).IsUnique();
            e.HasOne(d => d.User)
             .WithOne(u => u.Doctor)
             .HasForeignKey<Doctor>(d => d.UserId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(d => d.Speciality)
             .WithMany(s => s.Doctors)
             .HasForeignKey(d => d.SpecialityId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Appointment - unique constraint on (DoctorId, SlotDate, SlotTime)
        modelBuilder.Entity<Appointment>(e =>
        {
            e.HasIndex(a => new { a.DoctorId, a.SlotDate, a.SlotTime }).IsUnique();

            e.HasOne(a => a.Patient)
             .WithMany(p => p.Appointments)
             .HasForeignKey(a => a.PatientId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(a => a.Doctor)
             .WithMany(d => d.Appointments)
             .HasForeignKey(a => a.DoctorId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // DailySummary - unique constraint on (DoctorId, SummaryDate)
        modelBuilder.Entity<DailySummary>(e =>
        {
            e.HasIndex(ds => new { ds.DoctorId, ds.SummaryDate }).IsUnique();

            e.HasOne(ds => ds.Doctor)
             .WithMany(d => d.DailySummaries)
             .HasForeignKey(ds => ds.DoctorId)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
