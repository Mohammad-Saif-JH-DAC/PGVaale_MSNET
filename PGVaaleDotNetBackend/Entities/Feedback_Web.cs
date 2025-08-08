using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Feedback_Web
    {
        [Key]
        public long Id { get; set; }

        public string Feedback { get; set; } = string.Empty;

        public int Rating { get; set; }
    }
}
