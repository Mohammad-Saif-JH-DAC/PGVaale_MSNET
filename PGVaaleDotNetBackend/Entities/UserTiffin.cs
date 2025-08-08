using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class UserTiffin
    {
        public long Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public long TiffinId { get; set; }

        [Required]
        public DateTime AssignedDateTime { get; set; }

        public DateTime? DeletionDateTime { get; set; }

        [Required]
        public RequestStatus Status { get; set; } = RequestStatus.PENDING;

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