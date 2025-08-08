using System.ComponentModel.DataAnnotations;

namespace PGVaaleDotNetBackend.Entities
{
    public class UserMaid
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long MaidId { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.PENDING;
        public DateTime? AssignedDateTime { get; set; }
        public DateTime? AcceptedDateTime { get; set; }
        public DateTime? DeletionDateTime { get; set; }
        public string? UserAddress { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? TimeSlot { get; set; }

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual Maid? Maid { get; set; }

        public enum RequestStatus
        {
            PENDING,
            ACCEPTED,
            REJECTED,
            CANCELLED
        }
    }
}