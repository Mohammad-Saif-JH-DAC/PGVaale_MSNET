using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [StringLength(12, MinimumLength = 12)]
        public string Aadhaar { get; set; } = string.Empty;

        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string MobileNumber { get; set; } = string.Empty;

        [Range(0, int.MaxValue)]
        public int Age { get; set; }

        [Required]
        public string Gender { get; set; } = string.Empty;
    }
}