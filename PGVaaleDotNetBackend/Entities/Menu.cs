using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Menu
    {
        public long Id { get; set; }

        [Required]
        public long TiffinId { get; set; }

        [Required]
        public string DayOfWeek { get; set; } = string.Empty;

        [Required]
        public string Breakfast { get; set; } = string.Empty;

        [Required]
        public string Lunch { get; set; } = string.Empty;

        [Required]
        public string Dinner { get; set; } = string.Empty;

        [Required]
        public DateTime MenuDate { get; set; }

        [Required]
        public string FoodCategory { get; set; } = string.Empty;

        [Required]
        public double Price { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation property
        public Tiffin Tiffin { get; set; } = null!;
    }
}
