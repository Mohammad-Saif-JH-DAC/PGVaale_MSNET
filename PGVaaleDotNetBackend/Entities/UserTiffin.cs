using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class UserTiffin : BaseEntity
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public long TiffinId { get; set; }

        [Required]
        public DateTime AssignedDateTime { get; set; } // When request was made

        public DateTime? DeletionDateTime { get; set; } // When service ends

        [Required]
        public RequestStatus Status { get; set; } = RequestStatus.PENDING; // PENDING, ACCEPTED, REJECTED

        // Navigation properties
        public User User { get; set; } = null!;
        public Tiffin Tiffin { get; set; } = null!;

        public enum RequestStatus
        {
            PENDING,
            ACCEPTED,
            REJECTED
        }
    }
}