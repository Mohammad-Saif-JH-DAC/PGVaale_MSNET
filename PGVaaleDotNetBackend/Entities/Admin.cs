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
        public new long Id { get; set; }
        
        // All other properties (Username, Password, Email, Name, UniqueId) are inherited from BaseEntity
    }
}
