using PGVaaleDotNetBackend.Entities;

namespace PGVaaleDotNetBackend.DTOs
{
    // Java: @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public class UserTiffinDTO
    {
        // Java: private Long id;
        public long Id { get; set; }
        
        // Java: private Long userId;
        public long UserId { get; set; }
        
        // Java: private Long tiffinId;
        public long TiffinId { get; set; }
        
        // Java: private String userName;
        public string UserName { get; set; } = string.Empty;
        
        // Java: private String tiffinName;
        public string TiffinName { get; set; } = string.Empty;
        
        // Java: private String status;
        public string Status { get; set; } = string.Empty;
        
        // Java: private LocalDateTime assignedDateTime;
        public DateTime AssignedDateTime { get; set; }
        
        // Java: private LocalDateTime deletionDateTime;
        public DateTime? DeletionDateTime { get; set; }

        // Default constructor (equivalent to @NoArgsConstructor)
        public UserTiffinDTO()
        {
        }

        // Constructor with all parameters (equivalent to @AllArgsConstructor)
        public UserTiffinDTO(
            long id,
            long userId,
            long tiffinId,
            string userName,
            string tiffinName,
            string status,
            DateTime assignedDateTime,
            DateTime? deletionDateTime)
        {
            Id = id;
            UserId = userId;
            TiffinId = tiffinId;
            UserName = userName;
            TiffinName = tiffinName;
            Status = status;
            AssignedDateTime = assignedDateTime;
            DeletionDateTime = deletionDateTime;
        }

        // Builder pattern (equivalent to @Builder)
        public class UserTiffinDTOBuilder
        {
            private long _id;
            private long _userId;
            private long _tiffinId;
            private string _userName = string.Empty;
            private string _tiffinName = string.Empty;
            private string _status = string.Empty;
            private DateTime _assignedDateTime;
            private DateTime? _deletionDateTime;

            public UserTiffinDTOBuilder Id(long id)
            {
                _id = id;
                return this;
            }

            public UserTiffinDTOBuilder UserId(long userId)
            {
                _userId = userId;
                return this;
            }

            public UserTiffinDTOBuilder TiffinId(long tiffinId)
            {
                _tiffinId = tiffinId;
                return this;
            }

            public UserTiffinDTOBuilder UserName(string userName)
            {
                _userName = userName;
                return this;
            }

            public UserTiffinDTOBuilder TiffinName(string tiffinName)
            {
                _tiffinName = tiffinName;
                return this;
            }

            public UserTiffinDTOBuilder Status(string status)
            {
                _status = status;
                return this;
            }

            public UserTiffinDTOBuilder AssignedDateTime(DateTime assignedDateTime)
            {
                _assignedDateTime = assignedDateTime;
                return this;
            }

            public UserTiffinDTOBuilder DeletionDateTime(DateTime? deletionDateTime)
            {
                _deletionDateTime = deletionDateTime;
                return this;
            }

            public UserTiffinDTO Build()
            {
                return new UserTiffinDTO(
                    _id,
                    _userId,
                    _tiffinId,
                    _userName,
                    _tiffinName,
                    _status,
                    _assignedDateTime,
                    _deletionDateTime);
            }
        }

        // Static method to create builder (equivalent to Lombok @Builder)
        public static UserTiffinDTOBuilder Builder()
        {
            return new UserTiffinDTOBuilder();
        }

        // Java: public static UserTiffinDTO fromEntity(UserTiffin userTiffin)
        public static UserTiffinDTO FromEntity(UserTiffin userTiffin)
        {
            return UserTiffinDTO.Builder()
                .Id(userTiffin.Id)
                .UserId(userTiffin.User?.Id ?? 0)
                .TiffinId(userTiffin.Tiffin?.Id ?? 0)
                .UserName(userTiffin.User?.Name ?? string.Empty)
                .TiffinName(userTiffin.Tiffin?.Name ?? string.Empty)
                .Status(userTiffin.Status.ToString())
                .AssignedDateTime(userTiffin.AssignedDateTime)
                .DeletionDateTime(userTiffin.DeletionDateTime)
                .Build();
        }
    }
}