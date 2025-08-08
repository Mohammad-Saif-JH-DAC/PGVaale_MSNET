using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class ServiceProvider
    {
        [Key]
        public long Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty; // TIFFIN or MAID

        public string Region { get; set; } = string.Empty;

        public bool Approved { get; set; } = false;
    }
}
