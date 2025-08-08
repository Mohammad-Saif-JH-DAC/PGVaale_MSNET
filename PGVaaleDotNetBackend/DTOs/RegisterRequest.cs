using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.DTOs
{
    public class RegisterRequest
    {
        [Required]
        public required string Username { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        [StringLength(12, MinimumLength = 12)]
        public required string Aadhaar { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 10)]
        public required string MobileNumber { get; set; }

        public int? Age { get; set; }

        [Required]
        public required string Gender { get; set; }
    }
}
