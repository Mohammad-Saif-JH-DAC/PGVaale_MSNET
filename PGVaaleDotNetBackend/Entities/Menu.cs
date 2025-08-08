using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class Menu : BaseEntity
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long TiffinId { get; set; }

        [Required]
        public string DayOfWeek { get; set; } = string.Empty; // Monday, Tuesday, etc.

        [Required]
        public string Breakfast { get; set; } = string.Empty;

        [Required]
        public string Lunch { get; set; } = string.Empty;

        [Required]
        public string Dinner { get; set; } = string.Empty;

        public DateTime MenuDate { get; set; } // Specific date for this menu

        public string FoodCategory { get; set; } = string.Empty; // Veg, Non-Veg, Both

        public double Price { get; set; } // Price per meal

        public bool IsActive { get; set; } = true;

        // Navigation property
        public Tiffin Tiffin { get; set; } = null!;
    }
}
