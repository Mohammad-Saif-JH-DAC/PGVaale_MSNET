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
        public IEnumerable<Tiffin> GetAllTiffins()
        {
            return _tiffinRepository.GetAll();
        }

        public async Task<IEnumerable<Tiffin>> GetAllTiffinsAsync()
        {
            return await Task.FromResult(_tiffinRepository.GetAll());
        }

        public Tiffin? GetTiffinById(long id)
        {
            return _tiffinRepository.GetById(id);
        }

        public Tiffin SaveTiffin(Tiffin tiffin)
        {
            if (tiffin.Id == 0)
            {
                _tiffinRepository.Add(tiffin);
            }
            else
            {
                _tiffinRepository.Update(tiffin);
            }
            return tiffin;
        }

        public void DeleteTiffin(long id)
        {
            _tiffinRepository.Delete(id);
        }

        // Menu Management
        public MenuDTO CreateMenu(MenuDTO menuDTO)
        {
            var tiffin = _tiffinRepository.GetById(menuDTO.TiffinId);
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
                Price = menuDTO.Price,
                IsActive = true
            };

            _menuRepository.Add(menu);
            return ConvertToDTO(menu);
        }

        public MenuDTO UpdateMenu(long menuId, MenuDTO menuDTO)
        {
            var menu = _menuRepository.GetById(menuId);
            if (menu == null)
                throw new InvalidOperationException("Menu not found");

            menu.Breakfast = menuDTO.Breakfast;
            menu.Lunch = menuDTO.Lunch;
            menu.Dinner = menuDTO.Dinner;
            menu.MenuDate = menuDTO.MenuDate;
            menu.FoodCategory = menuDTO.FoodCategory;
            menu.Price = menuDTO.Price;

            _menuRepository.Update(menu);
            return ConvertToDTO(menu);
        }

        public void DeleteMenu(long menuId)
        {
            var menu = _menuRepository.GetById(menuId);
            if (menu == null)
                throw new InvalidOperationException("Menu not found");

            menu.IsActive = false;
            _menuRepository.Update(menu);
        }

        public async Task<IEnumerable<MenuDTO>> GetWeeklyMenuAsync(long tiffinId)
        {
            var menus = await _menuRepository.GetByTiffinIdAndIsActiveAsync(tiffinId, true);
            return menus.Select(ConvertToDTO);
        }

        public async Task<MenuDTO?> GetMenuByDayAsync(long tiffinId, string dayOfWeek)
        {
            var menu = await _menuRepository.GetByTiffinIdAndDayOfWeekAndIsActiveAsync(tiffinId, dayOfWeek, true);
            return menu != null ? ConvertToDTO(menu) : null;
        }

        // User Request Management
        public UserTiffinDTO CreateUserRequest(long userId, long tiffinId)
        {
            var user = _userRepository.GetById(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            var tiffin = _tiffinRepository.GetById(tiffinId);
            if (tiffin == null)
                throw new InvalidOperationException("Tiffin not found");

            // Check if request already exists
            var existingRequest = _userTiffinRepository.GetByUserIdAndTiffinIdAsync(userId, tiffinId).Result;
            if (existingRequest != null)
                throw new InvalidOperationException("Request already exists");

            var userTiffin = new UserTiffin
            {
                UserId = userId,
                TiffinId = tiffinId,
                Status = UserTiffin.RequestStatus.PENDING,
                AssignedDateTime = DateTime.UtcNow
            };

            _userTiffinRepository.Add(userTiffin);
            return UserTiffinDTO.FromEntity(userTiffin);
        }

        public UserTiffinDTO UpdateRequestStatus(long requestId, UserTiffin.RequestStatus status)
        {
            var userTiffin = _userTiffinRepository.GetById(requestId);
            if (userTiffin == null)
                throw new InvalidOperationException("Request not found");

            userTiffin.Status = status;
            if (status == UserTiffin.RequestStatus.REJECTED)
            {
                userTiffin.DeletionDateTime = DateTime.UtcNow;
            }

            _userTiffinRepository.Update(userTiffin);
            return UserTiffinDTO.FromEntity(userTiffin);
        }

        public async Task<IEnumerable<UserTiffinDTO>> GetTiffinRequestsAsync(long tiffinId, UserTiffin.RequestStatus? status)
        {
            IEnumerable<UserTiffin> userTiffins;
            if (status == null)
            {
                userTiffins = await _userTiffinRepository.GetByTiffinIdAsync(tiffinId);
            }
            else
            {
                userTiffins = await _userTiffinRepository.GetByTiffinIdAndStatusAsync(tiffinId, status.Value);
            }
            return userTiffins.Select(UserTiffinDTO.FromEntity);
        }

        public async Task<IEnumerable<UserTiffinDTO>> GetUserRequestsAsync(long userId, UserTiffin.RequestStatus? status)
        {
            IEnumerable<UserTiffin> userTiffins;
            if (status == null)
            {
                userTiffins = await _userTiffinRepository.GetByUserIdAsync(userId);
            }
            else
            {
                userTiffins = await _userTiffinRepository.GetByUserIdAndStatusAsync(userId, status.Value);
            }
            return userTiffins.Select(UserTiffinDTO.FromEntity);
        }

        public void CancelUserRequest(long requestId)
        {
            var userTiffin = _userTiffinRepository.GetById(requestId);
            if (userTiffin == null)
                throw new InvalidOperationException("Request not found");

            userTiffin.Status = UserTiffin.RequestStatus.REJECTED;
            userTiffin.DeletionDateTime = DateTime.UtcNow;
            _userTiffinRepository.Update(userTiffin);
        }

        // Dashboard
        public async Task<TiffinDashboardDTO> GetTiffinDashboardAsync(long tiffinId)
        {
            var tiffin = _tiffinRepository.GetById(tiffinId);
            if (tiffin == null)
                throw new InvalidOperationException("Tiffin not found");

            var pendingRequests = await _userTiffinRepository.CountByTiffinIdAndStatusAsync(tiffinId, UserTiffin.RequestStatus.PENDING);
            var acceptedRequests = await _userTiffinRepository.CountByTiffinIdAndStatusAsync(tiffinId, UserTiffin.RequestStatus.ACCEPTED);
            var rejectedRequests = await _userTiffinRepository.CountByTiffinIdAndStatusAsync(tiffinId, UserTiffin.RequestStatus.REJECTED);

            var recentRequests = await _userTiffinRepository.GetByTiffinIdAsync(tiffinId);
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
        public Feedback_Tiffin SubmitTiffinFeedback(long userId, long tiffinId, int rating, string feedback)
        {
            var user = _userRepository.GetById(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            var tiffin = _tiffinRepository.GetById(tiffinId);
            if (tiffin == null)
                throw new InvalidOperationException("Tiffin not found");

            var feedbackTiffin = new Feedback_Tiffin
            {
                UserId = userId,
                TiffinId = tiffinId,
                Rating = rating,
                Feedback = feedback,
                CreatedAt = DateTime.UtcNow
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