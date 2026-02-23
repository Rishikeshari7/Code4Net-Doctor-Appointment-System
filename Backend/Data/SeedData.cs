using HospitalBookingSystem.Helpers;
using HospitalBookingSystem.Models;

namespace HospitalBookingSystem.Data;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        // Seed Admin user
        if (!context.Users.Any(u => u.Role == "ADMIN"))
        {
            context.Users.Add(new User
            {
                Name = "Admin",
                Email = "admin@hospital.com",
                PasswordHash = PasswordHasher.Hash("Admin@123"),
                Role = "ADMIN",
                Phone = "0000000000"
            });
            await context.SaveChangesAsync();
        }

        // Seed Specialities
        if (!context.Specialities.Any())
        {
            var specialities = new List<Speciality>
            {
                new() { Name = "General Physician", Description = "Primary care and general medicine" },
                new() { Name = "Dermatologist", Description = "Skin, hair and nail specialist" },
                new() { Name = "Pediatrician", Description = "Child and adolescent health" },
                new() { Name = "Gynecologist", Description = "Women's reproductive health" },
                new() { Name = "Neurologist", Description = "Brain and nervous system specialist" },
                new() { Name = "Gastroenterologist", Description = "Digestive system specialist" },
                new() { Name = "Cardiologist", Description = "Heart and cardiovascular specialist" },
                new() { Name = "Orthopedist", Description = "Bone and joint specialist" },
                new() { Name = "ENT Specialist", Description = "Ear, nose and throat specialist" },
                new() { Name = "Ophthalmologist", Description = "Eye care specialist" },
                new() { Name = "Dentist", Description = "Dental and oral health" },
                new() { Name = "Psychiatrist", Description = "Mental health specialist" }
            };

            context.Specialities.AddRange(specialities);
            await context.SaveChangesAsync();
        }
    }
}
