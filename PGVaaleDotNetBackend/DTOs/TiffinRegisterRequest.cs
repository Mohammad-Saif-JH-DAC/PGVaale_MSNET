using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.DTOs
{
    public class TiffinRegisterRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(12, MinimumLength = 12)]
        public string Aadhaar { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public double Price { get; set; }

        [Required]
        public string FoodCategory { get; set; } = string.Empty; // "Veg" or "Non-Veg"

        [Required]
        public string Region { get; set; } = string.Empty;

        [Required]
        public string MaidAddress { get; set; } = string.Empty;
    }
}
