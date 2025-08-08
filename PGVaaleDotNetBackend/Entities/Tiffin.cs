using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Tiffin : BaseEntity
    {
        [Key]
        public long Id { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(12, MinimumLength = 12)]
        public string Aadhaar { get; set; } = string.Empty;

        public double Price { get; set; }

        public string FoodCategory { get; set; } = string.Empty; // "Veg" or "Non-Veg"

        public string Region { get; set; } = string.Empty;

        public string MaidAddress { get; set; } = string.Empty;
        
        public bool Approved { get; set; } = false; // Admin approval status
    }
}