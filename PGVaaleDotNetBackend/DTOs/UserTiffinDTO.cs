using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.DTOs
{
    public class UserTiffinDTO
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long TiffinId { get; set; }
        public DateTime AssignedDateTime { get; set; }
        public DateTime? DeletionDateTime { get; set; }
        public UserTiffin.RequestStatus Status { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string TiffinName { get; set; } = string.Empty;

        public static UserTiffinDTO FromEntity(UserTiffin entity)
        {
            return new UserTiffinDTO
            {
                Id = entity.Id,
                UserId = entity.UserId,
                TiffinId = entity.TiffinId,
                AssignedDateTime = entity.AssignedDateTime,
                DeletionDateTime = entity.DeletionDateTime,
                Status = entity.Status,
                UserName = entity.User?.Name ?? string.Empty,
                TiffinName = entity.Tiffin?.Name ?? string.Empty
            };
        }
    }
}