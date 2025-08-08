using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Maid
    {
        public long Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? Aadhaar { get; set; }
        public bool Approved { get; set; }
        public string? Gender { get; set; }
        public double MonthlySalary { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Region { get; set; }
        public string? Services { get; set; }
        public string? Timing { get; set; }
        public bool? Active { get; set; }
    }
}