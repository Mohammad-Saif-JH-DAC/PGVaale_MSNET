using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;

namespace PGVaaleDotNetBackend.Services
{
    public class UserMaidService
    {
        private readonly IUserMaidRepository _userMaidRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMaidRepository _maidRepository;

        public UserMaidService(IUserMaidRepository userMaidRepository, IUserRepository userRepository, IMaidRepository maidRepository)
        {
            _userMaidRepository = userMaidRepository;
            _userRepository = userRepository;
            _maidRepository = maidRepository;
        }

        // Create a new maid hiring request
        public async Task<UserMaid> CreateHiringRequestAsync(long userId, long maidId, string userAddress, 
                                                           DateTime? startDate, DateTime? endDate, string timeSlot)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            var maid = await _maidRepository.GetMaidByIdAsync(maidId);
            if (maid == null)
            {
                throw new InvalidOperationException("Maid not found");
            }

            // Check if user has any active request (only 1 maid can be hired at a time)
            if (await _userMaidRepository.ExistsActiveRequestByUserIdAsync(userId))
            {
                throw new InvalidOperationException("You can only hire one maid at a time. Please cancel your existing request first.");
            }

            var userMaid = new UserMaid
            {
                UserId = userId,
                MaidId = maidId,
                Status = UserMaid.RequestStatus.PENDING,
                AssignedDateTime = DateTime.Now,
                UserAddress = userAddress,
                StartDate = startDate,
                EndDate = endDate,
                TimeSlot = timeSlot
            };

            return await _userMaidRepository.SaveAsync(userMaid);
        }

        // Get all requests for a specific maid
        public async Task<List<UserMaid>> GetRequestsByMaidIdAsync(long maidId)
        {
            return await _userMaidRepository.GetActiveRequestsByMaidIdAsync(maidId);
        }

        // Get all requests for a specific user
        public async Task<List<UserMaid>> GetRequestsByUserIdAsync(long userId)
        {
            return await _userMaidRepository.GetActiveRequestsByUserIdAsync(userId);
        }

        // Update request status
        public async Task<UserMaid> UpdateRequestStatusAsync(long requestId, UserMaid.RequestStatus status)
        {
            var request = await _userMaidRepository.GetByIdAsync(requestId);
            if (request == null)
            {
                throw new InvalidOperationException("Request not found");
            }

            request.Status = status;

            if (status == UserMaid.RequestStatus.CANCELLED)
            {
                request.DeletionDateTime = DateTime.Now;
            }

            return await _userMaidRepository.SaveAsync(request);
        }

        // Get request by ID
        public async Task<UserMaid?> GetRequestByIdAsync(long requestId)
        {
            return await _userMaidRepository.GetByIdAsync(requestId);
        }

        // Cancel a request
        public async Task<UserMaid> CancelRequestAsync(long requestId)
        {
            return await UpdateRequestStatusAsync(requestId, UserMaid.RequestStatus.CANCELLED);
        }

        // Accept a request
        public async Task<UserMaid> AcceptRequestAsync(long requestId)
        {
            var request = await _userMaidRepository.GetByIdAsync(requestId);
            if (request == null)
            {
                throw new InvalidOperationException("Request not found");
            }

            request.Status = UserMaid.RequestStatus.ACCEPTED;
            request.AcceptedDateTime = DateTime.Now;

            return await _userMaidRepository.SaveAsync(request);
        }

        // Reject a request
        public async Task<UserMaid> RejectRequestAsync(long requestId)
        {
            return await UpdateRequestStatusAsync(requestId, UserMaid.RequestStatus.REJECTED);
        }

        // Get pending requests for a maid
        public async Task<List<UserMaid>> GetPendingRequestsByMaidIdAsync(long maidId)
        {
            return await _userMaidRepository.GetByMaidIdAndStatusAsync(maidId, UserMaid.RequestStatus.PENDING);
        }

        // Get accepted requests for a user
        public async Task<List<UserMaid>> GetAcceptedRequestsByUserIdAsync(long userId)
        {
            return await _userMaidRepository.GetAcceptedRequestsByUserIdAsync(userId);
        }

        // Count pending requests for a maid
        public async Task<long> CountPendingRequestsByMaidIdAsync(long maidId)
        {
            return await _userMaidRepository.CountByMaidIdAndStatusAsync(maidId, UserMaid.RequestStatus.PENDING);
        }

        // Check if user has active request with maid
        public async Task<bool> HasActiveRequestAsync(long userId, long maidId)
        {
            return await _userMaidRepository.ExistsActiveRequestByUserIdAndMaidIdAsync(userId, maidId);
        }
    }
}
