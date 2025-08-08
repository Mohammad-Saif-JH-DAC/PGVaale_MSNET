using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Feedback
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long MaidId { get; set; }

        [Required]
        public long UserId { get; set; }

        public string FeedbackText { get; set; } = string.Empty;

        public int Rating { get; set; }

        // Navigation properties
        public Maid Maid { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
