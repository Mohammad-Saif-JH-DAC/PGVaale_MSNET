using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.DTOs
{
    public class MaidRegisterRequest
    {
        [Required]
        public required string Username { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(6)]
        public required string Password { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Phone number must be exactly 10 characters")]
        public required string PhoneNumber { get; set; }

        [Required]
        [StringLength(12, MinimumLength = 12, ErrorMessage = "Aadhaar must be exactly 12 characters")]
        public required string Aadhaar { get; set; }

        public string? Services { get; set; }

        public double MonthlySalary { get; set; }

        public string? Gender { get; set; }

        public string? Timing { get; set; }

        public string? Region { get; set; }
    }
}
