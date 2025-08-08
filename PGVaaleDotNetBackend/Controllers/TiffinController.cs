using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.DTOs;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;
using PGVaaleDotNetBackend.Services;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/tiffin")]
    public class TiffinController : ControllerBase
    {
        private readonly TiffinService _tiffinService;
        private readonly ITiffinRepository _tiffinRepository;
        private readonly IFeedback_TiffinRepository _feedbackTiffinRepository;
        private readonly IUserTiffinRepository _userTiffinRepository;
        private readonly IMenuRepository _menuRepository;

        public TiffinController(
            TiffinService tiffinService,
            ITiffinRepository tiffinRepository,
            IFeedback_TiffinRepository feedbackTiffinRepository,
            IUserTiffinRepository userTiffinRepository,
            IMenuRepository menuRepository)
        {
            _tiffinService = tiffinService;
            _tiffinRepository = tiffinRepository;
            _feedbackTiffinRepository = feedbackTiffinRepository;
            _userTiffinRepository = userTiffinRepository;
            _menuRepository = menuRepository;
        }

        // Dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                // TODO: Get tiffin ID from authentication context
                // For now, we'll use a placeholder - you'll need to implement proper authentication
                var tiffinId = GetTiffinIdFromUsername("placeholder_username");
                var dashboard = await _tiffinService.GetTiffinDashboardAsync(tiffinId);
                return Ok(dashboard);
            }
            catch (Exception e)
            {
                return BadRequest($"Error fetching dashboard: {e.Message}");
            }
        }

        // Menu Management
        [HttpPost("menu")]
        public async Task<IActionResult> CreateMenu([FromBody] MenuDTO menuDTO)
        {
            try
            {
                // TODO: Get tiffin ID from authentication context
                var tiffinId = GetTiffinIdFromUsername("placeholder_username");
                menuDTO.TiffinId = tiffinId;
                var createdMenu = _tiffinService.CreateMenu(menuDTO);
                return Ok(createdMenu);
            }
            catch (Exception e)
            {
                return BadRequest($"Error creating menu: {e.Message}");
            }
        }

        [HttpPut("menu/{menuId}")]
        public async Task<IActionResult> UpdateMenu(long menuId, [FromBody] MenuDTO menuDTO)
        {
            try
            {
                var updatedMenu = _tiffinService.UpdateMenu(menuId, menuDTO);
                return Ok(updatedMenu);
            }
            catch (Exception e)
            {
                return BadRequest($"Error updating menu: {e.Message}");
            }
        }

        [HttpDelete("menu/{menuId}")]
        public async Task<IActionResult> DeleteMenu(long menuId)
        {
            try
            {
                _tiffinService.DeleteMenu(menuId);
                return Ok("Menu deleted successfully");
            }
            catch (Exception e)
            {
                return BadRequest($"Error deleting menu: {e.Message}");
            }
        }

        [HttpGet("menu")]
        public async Task<IActionResult> GetWeeklyMenu()
        {
            try
            {
                // TODO: Get tiffin ID from authentication context
                var tiffinId = GetTiffinIdFromUsername("placeholder_username");
                var menus = await _tiffinService.GetWeeklyMenuAsync(tiffinId);
                return Ok(menus);
            }
            catch (Exception e)
            {
                return BadRequest($"Error fetching menu: {e.Message}");
            }
        }

        [HttpGet("menu/{dayOfWeek}")]
        public async Task<IActionResult> GetMenuByDay(string dayOfWeek)
        {
            try
            {
                // TODO: Get tiffin ID from authentication context
                var tiffinId = GetTiffinIdFromUsername("placeholder_username");
                var menu = await _tiffinService.GetMenuByDayAsync(tiffinId, dayOfWeek);
                if (menu != null)
                {
                    return Ok(menu);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Error fetching menu: {e.Message}");
            }
        }

        // Request Management
        [HttpGet("requests")]
        public async Task<IActionResult> GetRequests([FromQuery] string? status)
        {
            try
            {
                // TODO: Get tiffin ID from authentication context
                var tiffinId = GetTiffinIdFromUsername("placeholder_username");
                UserTiffin.RequestStatus? requestStatus = null;
                if (!string.IsNullOrEmpty(status))
                {
                    if (Enum.TryParse<UserTiffin.RequestStatus>(status.ToUpper(), out var parsedStatus))
                    {
                        requestStatus = parsedStatus;
                    }
                }
                var requests = await _tiffinService.GetTiffinRequestsAsync(tiffinId, requestStatus);
                return Ok(requests);
            }
            catch (Exception e)
            {
                return BadRequest($"Error fetching requests: {e.Message}");
            }
        }

        [HttpPost("requests/{requestId}/status")]
        public async Task<IActionResult> UpdateRequestStatus(long requestId, [FromBody] Dictionary<string, string> request)
        {
            try
            {
                var status = request["status"];
                if (Enum.TryParse<UserTiffin.RequestStatus>(status.ToUpper(), out var requestStatus))
                {
                    var updatedRequest = _tiffinService.UpdateRequestStatus(requestId, requestStatus);
                    return Ok(updatedRequest);
                }
                else
                {
                    return BadRequest("Invalid status value");
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Error updating request status: {e.Message}");
            }
        }

        // Profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                // TODO: Get username from authentication context
                var username = "placeholder_username";
                return Ok(new { username = username, message = "Profile endpoint" });
            }
            catch (Exception e)
            {
                return BadRequest($"Error fetching profile: {e.Message}");
            }
        }

        [HttpPost("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] Dictionary<string, object> profileData)
        {
            try
            {
                // TODO: Implement profile update logic
                return Ok("Profile updated successfully");
            }
            catch (Exception e)
            {
                return BadRequest($"Error updating profile: {e.Message}");
            }
        }

        // Delete tiffin account
        [HttpDelete("profile")]
        public async Task<IActionResult> DeleteAccount()
        {
            try
            {
                // TODO: Get username from authentication context
                var username = "placeholder_username";
                var tiffinOptional = await _tiffinRepository.GetByUsernameAsync(username);
                if (tiffinOptional == null)
                {
                    return NotFound();
                }

                var tiffin = tiffinOptional;
                var tiffinId = tiffin.Id;

                // Delete all feedback for this tiffin
                var tiffinFeedback = await _feedbackTiffinRepository.GetByTiffinIdAsync(tiffinId);
                foreach (var feedback in tiffinFeedback)
                {
                    _feedbackTiffinRepository.Delete(feedback.Id);
                }

                // Delete all user-tiffin relationships for this tiffin
                var userTiffinRelations = await _userTiffinRepository.GetByTiffinIdAsync(tiffinId);
                foreach (var relation in userTiffinRelations)
                {
                    _userTiffinRepository.Delete(relation.Id);
                }

                // Delete all menus for this tiffin
                var tiffinMenus = await _menuRepository.GetByTiffinIdAsync(tiffinId);
                foreach (var menu in tiffinMenus)
                {
                    _menuRepository.Delete(menu.Id);
                }

                // Delete the tiffin account
                _tiffinRepository.Delete(tiffinId);

                return Ok("Account deleted successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error deleting account: {e.Message}");
            }
        }

        // Helper method to get tiffin ID from username
        private long GetTiffinIdFromUsername(string username)
        {
            try
            {
                var tiffin = _tiffinRepository.GetByUsername(username);
                if (tiffin != null)
                {
                    return tiffin.Id;
                }
                throw new InvalidOperationException($"Tiffin not found for username: {username}");
            }
            catch (Exception e)
            {
                throw new InvalidOperationException($"Error getting tiffin ID: {e.Message}");
            }
        }
    }
}
