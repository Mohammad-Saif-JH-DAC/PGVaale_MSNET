using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class PG
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long OwnerId { get; set; }

        [Required]
        public long UserId { get; set; }

        // List of image paths (max 5 should be handled via validation in controller or frontend)
        public string ImagePaths { get; set; } = string.Empty; // Comma-separated list

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Amenities { get; set; } = string.Empty; // e.g., "AC,Gas,Fridge"

        public string NearbyResources { get; set; } = string.Empty; // e.g., "Hospital,Gym,Garden"

        public double Rent { get; set; }

        public string GeneralPreference { get; set; } = string.Empty;

        public string Region { get; set; } = string.Empty; // Added region field

        public string Availability { get; set; } = string.Empty;

        // Navigation properties
        public Owner Owner { get; set; } = null!;
        public User RegisteredUser { get; set; } = null!;
    }
}
