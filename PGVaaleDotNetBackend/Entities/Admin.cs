using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PGVaaleDotNetBackend.Entities
{
    /// <summary>
    /// ADMIN ENTITY
    /// </summary>
    [Table("admins")]
    public class Admin : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override long Id { get; set; }
    }
}
