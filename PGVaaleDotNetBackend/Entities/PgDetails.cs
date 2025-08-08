using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class PgDetails
    {
        [Key]
        public long PgId { get; set; }

        public string PgName { get; set; } = string.Empty;

        public string PgAddress { get; set; } = string.Empty;

        public double PgRent { get; set; }
    }
}
