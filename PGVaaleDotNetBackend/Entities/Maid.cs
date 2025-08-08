using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Maid : BaseEntity
    {
        [Key]
        public long Id { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(12, MinimumLength = 12)]
        public string Aadhaar { get; set; } = string.Empty;

        public string Services { get; set; } = string.Empty; // CSV or JSON ("Mobbing,Cooking")

        public double MonthlySalary { get; set; }

        public string Gender { get; set; } = string.Empty;

        public string Timing { get; set; } = string.Empty;

        public string Region { get; set; } = string.Empty;
        
        public bool Approved { get; set; } = false; // Admin approval status
    }
}