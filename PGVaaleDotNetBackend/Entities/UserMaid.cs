using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class UserMaid
    {
        [Key]
        public long Id { get; set; }
        
        public long UserId { get; set; }
        public long MaidId { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.PENDING;
        public DateTime? AssignedDateTime { get; set; }
        public DateTime? AcceptedDateTime { get; set; }
        public DateTime? DeletionDateTime { get; set; }
        public string UserAddress { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;

        // Navigation properties
        public User User { get; set; } = null!;
        public Maid Maid { get; set; } = null!;

        public enum RequestStatus
        {
            PENDING,
            ACCEPTED,
            REJECTED,
            CANCELLED
        }
    }
}