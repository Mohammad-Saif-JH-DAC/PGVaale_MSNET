using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Feedback_Tiffin
    {
        public long Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public long TiffinId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string Feedback { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User User { get; set; } = null!;
        public Tiffin Tiffin { get; set; } = null!;
    }
}
