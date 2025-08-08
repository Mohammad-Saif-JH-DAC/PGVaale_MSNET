using PGVaaleDotNetBackend.DTOs;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;

namespace PGVaaleDotNetBackend.Services
{
    public class TiffinService
    {
        private readonly ITiffinRepository _tiffinRepository;
        private readonly IMenuRepository _menuRepository;
        private readonly IUserTiffinRepository _userTiffinRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFeedback_TiffinRepository _feedbackTiffinRepository;

        public TiffinService(
            ITiffinRepository tiffinRepository,
            IMenuRepository menuRepository,
            IUserTiffinRepository userTiffinRepository,
            IUserRepository userRepository,
            IFeedback_TiffinRepository feedbackTiffinRepository)
        {
            _tiffinRepository = tiffinRepository;
            _menuRepository = menuRepository;
            _userTiffinRepository = userTiffinRepository;
            _userRepository = userRepository;
            _feedbackTiffinRepository = feedbackTiffinRepository;
        }

        // CRUD Operations
        public async Task<IEnumerable<Tiffin>> GetAllTiffinsAsync()
        {
            return await _tiffinRepository.GetAllAsync();
        }

        public async Task<Tiffin?> GetTiffinByIdAsync(long id)
        {
            return await _tiffinRepository.GetByIdAsync(id);
        }

        public async Task<Tiffin> SaveTiffinAsync(Tiffin tiffin)
        {
            return await _tiffinRepository.SaveAsync(tiffin);
        }

        public async Task DeleteTiffinAsync(long id)
        {
            await _tiffinRepository.DeleteAsync(id);
        }

        // Menu Management
        public async Task<MenuDTO> CreateMenuAsync(MenuDTO menuDTO)
        {
            var tiffin = await _tiffinRepository.GetByIdAsync(menuDTO.TiffinId);
            if (tiffin == null)
                throw new InvalidOperationException("Tiffin not found");

            var menu = new Menu
            {
                TiffinId = menuDTO.TiffinId,
                DayOfWeek = menuDTO.DayOfWeek,
                Breakfast = menuDTO.Breakfast,
                Lunch = menuDTO.Lunch,
                Dinner = menuDTO.Dinner,
                MenuDate = menuDTO.MenuDate,
                FoodCategory = menuDTO.FoodCategory,
                Price = menuDTO.Price ?? 0.0,
                IsActive = true
            };

            var savedMenu = await _menuRepository.SaveAsync(menu);
            return ConvertToDTO(savedMenu);
        }

        public async Task<MenuDTO> UpdateMenuAsync(long menuId, MenuDTO menuDTO)
        {
            var menu = await _menuRepository.GetByIdAsync(menuId);
            if (menu == null)
                throw new InvalidOperationException("Menu not found");

            menu.Breakfast = menuDTO.Breakfast;
            menu.Lunch = menuDTO.Lunch;
            menu.Dinner = menuDTO.Dinner;
            menu.MenuDate = menuDTO.MenuDate;
            menu.FoodCategory = menuDTO.FoodCategory;
            menu.Price = menuDTO.Price ?? 0.0;

            var updatedMenu = await _menuRepository.SaveAsync(menu);
            return ConvertToDTO(updatedMenu);
        }

        public async Task DeleteMenuAsync(long menuId)
        {
            var menu = await _menuRepository.GetByIdAsync(menuId);
            if (menu == null)
                throw new InvalidOperationException("Menu not found");

            menu.IsActive = false;
            await _menuRepository.SaveAsync(menu);
        }

        public async Task<IEnumerable<MenuDTO>> GetWeeklyMenuAsync(long tiffinId)
        {
            var menus = await _menuRepository.FindByTiffinIdAndIsActiveTrueAsync(tiffinId);
            return menus.Select(ConvertToDTO);
        }

        public async Task<MenuDTO?> GetMenuByDayAsync(long tiffinId, string dayOfWeek)
        {
            var menu = await _menuRepository.FindByTiffinIdAndDayOfWeekAndIsActiveTrueAsync(tiffinId, dayOfWeek);
            return menu != null ? ConvertToDTO(menu) : null;
        }

        // User Request Management
        public async Task<UserTiffinDTO> CreateUserRequestAsync(long userId, long tiffinId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            var tiffin = await _tiffinRepository.GetByIdAsync(tiffinId);
            if (tiffin == null)
                throw new InvalidOperationException("Tiffin not found");

            // Check if request already exists
            var existingRequest = await _userTiffinRepository.FindByUserIdAndTiffinIdAsync(userId, tiffinId);
            if (existingRequest != null)
                throw new InvalidOperationException("Request already exists");

            var userTiffin = new UserTiffin
            {
                UserId = userId,
                TiffinId = tiffinId,
                Status = UserTiffin.RequestStatus.PENDING,
                AssignedDateTime = DateTime.UtcNow
            };

            var savedUserTiffin = await _userTiffinRepository.SaveAsync(userTiffin);
            return UserTiffinDTO.FromEntity(savedUserTiffin);
        }

        public async Task<UserTiffinDTO> UpdateRequestStatusAsync(long requestId, UserTiffin.RequestStatus status)
        {
            var userTiffin = await _userTiffinRepository.GetByIdAsync(requestId);
            if (userTiffin == null)
                throw new InvalidOperationException("Request not found");

            userTiffin.Status = status;
            if (status == UserTiffin.RequestStatus.REJECTED)
            {
                userTiffin.DeletionDateTime = DateTime.UtcNow;
            }

            var updatedUserTiffin = await _userTiffinRepository.SaveAsync(userTiffin);
            return UserTiffinDTO.FromEntity(updatedUserTiffin);
        }

        public async Task<IEnumerable<UserTiffinDTO>> GetTiffinRequestsAsync(long tiffinId, UserTiffin.RequestStatus? status)
        {
            IEnumerable<UserTiffin> userTiffins;
            if (status == null)
            {
                userTiffins = await _userTiffinRepository.FindByTiffinIdAsync(tiffinId);
            }
            else
            {
                userTiffins = await _userTiffinRepository.FindByTiffinIdAndStatusAsync(tiffinId, status.Value);
            }
            return userTiffins.Select(UserTiffinDTO.FromEntity);
        }

        public async Task<IEnumerable<UserTiffinDTO>> GetUserRequestsAsync(long userId, UserTiffin.RequestStatus? status)
        {
            IEnumerable<UserTiffin> userTiffins;
            if (status == null)
            {
                userTiffins = await _userTiffinRepository.FindByUserIdAsync(userId);
            }
            else
            {
                userTiffins = await _userTiffinRepository.FindByUserIdAndStatusAsync(userId, status.Value);
            }
            return userTiffins.Select(UserTiffinDTO.FromEntity);
        }

        public async Task CancelUserRequestAsync(long requestId)
        {
            var userTiffin = await _userTiffinRepository.GetByIdAsync(requestId);
            if (userTiffin == null)
                throw new InvalidOperationException("Request not found");

            userTiffin.Status = UserTiffin.RequestStatus.REJECTED;
            userTiffin.DeletionDateTime = DateTime.UtcNow;
            await _userTiffinRepository.SaveAsync(userTiffin);
        }

        // Dashboard
        public async Task<TiffinDashboardDTO> GetTiffinDashboardAsync(long tiffinId)
        {
            var tiffin = await _tiffinRepository.GetByIdAsync(tiffinId);
            if (tiffin == null)
                throw new InvalidOperationException("Tiffin not found");

            var pendingRequests = await _userTiffinRepository.CountByTiffinIdAndStatusAsync(tiffinId, UserTiffin.RequestStatus.PENDING);
            var acceptedRequests = await _userTiffinRepository.CountByTiffinIdAndStatusAsync(tiffinId, UserTiffin.RequestStatus.ACCEPTED);
            var rejectedRequests = await _userTiffinRepository.CountByTiffinIdAndStatusAsync(tiffinId, UserTiffin.RequestStatus.REJECTED);

            var recentRequests = await _userTiffinRepository.FindByTiffinIdAsync(tiffinId);
            var recentRequestsDTO = recentRequests.Take(5).Select(UserTiffinDTO.FromEntity).ToList();

            // Calculate average rating for this tiffin
            var feedbacks = await _feedbackTiffinRepository.GetByTiffinIdAsync(tiffinId);
            var averageRating = feedbacks.Any() ? feedbacks.Average(f => f.Rating) : 0.0;

            return new TiffinDashboardDTO
            {
                TiffinName = tiffin.Name,
                PendingRequests = pendingRequests,
                AcceptedRequests = acceptedRequests,
                RejectedRequests = rejectedRequests,
                AverageRating = Math.Round(averageRating, 1),
                RecentRequests = recentRequestsDTO
            };
        }

        // Tiffin Feedback
        public async Task<Feedback_Tiffin> SubmitTiffinFeedbackAsync(long userId, long tiffinId, int rating, string feedback)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            var tiffin = await _tiffinRepository.GetByIdAsync(tiffinId);
            if (tiffin == null)
                throw new InvalidOperationException("Tiffin not found");

            var feedbackTiffin = new Feedback_Tiffin
            {
                UserId = userId,
                TiffinId = tiffinId,
                Rating = rating,
                Feedback = feedback
            };

            _feedbackTiffinRepository.Add(feedbackTiffin);
            return feedbackTiffin;
        }

        public async Task<IEnumerable<Feedback_Tiffin>> GetTiffinFeedbackByUserAsync(long userId)
        {
            return await _feedbackTiffinRepository.GetByUserIdAsync(userId);
        }

        public async Task<IEnumerable<Feedback_Tiffin>> GetTiffinFeedbackByTiffinAsync(long tiffinId)
        {
            return await _feedbackTiffinRepository.GetByTiffinIdAsync(tiffinId);
        }

        private MenuDTO ConvertToDTO(Menu menu)
        {
            return new MenuDTO
            {
                Id = menu.Id,
                TiffinId = menu.TiffinId,
                DayOfWeek = menu.DayOfWeek,
                Breakfast = menu.Breakfast,
                Lunch = menu.Lunch,
                Dinner = menu.Dinner,
                MenuDate = menu.MenuDate,
                FoodCategory = menu.FoodCategory,
                Price = menu.Price,
                IsActive = menu.IsActive
            };
        }
    }
}