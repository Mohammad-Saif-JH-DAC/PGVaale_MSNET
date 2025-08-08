using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class PgDetails : BaseEntity
    {
        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string State { get; set; } = string.Empty;

        [Required]
        public string Pincode { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public double MonthlyRent { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int TotalRooms { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int AvailableRooms { get; set; }

        [Required]
        public string Amenities { get; set; } = string.Empty; // Comma-separated list

        [Required]
        public string Rules { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
