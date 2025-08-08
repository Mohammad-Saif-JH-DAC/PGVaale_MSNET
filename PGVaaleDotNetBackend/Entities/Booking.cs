using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Booking
    {
        [Key]
        public long BookingId { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public long PgId { get; set; }

        [Required]
        public string StartDate { get; set; } = string.Empty;

        [Required]
        public string EndDate { get; set; } = string.Empty;

        // Navigation properties
        public User User { get; set; } = null!;
        public PgDetails Pg { get; set; } = null!;
    }
}
