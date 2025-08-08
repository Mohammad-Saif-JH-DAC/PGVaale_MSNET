using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Tiffin : BaseEntity
    {
        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(12, MinimumLength = 12)]
        public string Aadhaar { get; set; } = string.Empty;

        [Required]
        public double Price { get; set; }

        [Required]
        public string FoodCategory { get; set; } = string.Empty; // "Veg" or "Non-Veg"

        [Required]
        public string Region { get; set; } = string.Empty;

        [Required]
        public string MaidAddress { get; set; } = string.Empty;

        public bool Approved { get; set; } = false; // Admin approval status
    }
}