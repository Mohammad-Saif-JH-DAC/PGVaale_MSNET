using System.ComponentModel.DataAnnotations;
namespace PGVaaleDotNetBackend.Entities
{
    public abstract class BaseEntity
    {
        public long Id { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        // Removed UniqueId as it doesn't exist in the database schema
        // Removed CreatedAt and UpdatedAt as they don't exist in the database schema
    }
}