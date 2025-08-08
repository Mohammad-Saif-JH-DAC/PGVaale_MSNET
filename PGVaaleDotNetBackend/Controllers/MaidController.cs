using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Services;
using System.Security.Claims;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/maid")]
    [Authorize]
    public class MaidController : ControllerBase
    {
        private readonly MaidService _maidService;
        private readonly UserMaidService _userMaidService;

        public MaidController(MaidService maidService, UserMaidService userMaidService)
        {
            _maidService = maidService;
            _userMaidService = userMaidService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var maid = await _maidService.GetMaidByUsernameAsync(username);
                if (maid == null)
                {
                    return NotFound("Maid not found");
                }

                var profile = new
                {
                    id = maid.Id,
                    name = maid.Name,
                    email = maid.Email,
                    phoneNumber = maid.PhoneNumber,
                    region = maid.Region,
                    services = maid.Services,
                    timing = maid.Timing,
                    monthlySalary = maid.MonthlySalary,
                    gender = maid.Gender,
                    approved = maid.Approved
                };

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching profile: {ex.Message}");
            }
        }

        [HttpPost("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] Dictionary<string, object> profileData)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var maid = await _maidService.GetMaidByUsernameAsync(username);
                if (maid == null)
                {
                    return NotFound("Maid not found");
                }

                // Update fields
                if (profileData.ContainsKey("name") && profileData["name"] != null)
                {
                    maid.Name = profileData["name"].ToString();
                }
                if (profileData.ContainsKey("email") && profileData["email"] != null)
                {
                    maid.Email = profileData["email"].ToString();
                }
                if (profileData.ContainsKey("phoneNumber") && profileData["phoneNumber"] != null)
                {
                    maid.PhoneNumber = profileData["phoneNumber"].ToString();
                }
                if (profileData.ContainsKey("region") && profileData["region"] != null)
                {
                    maid.Region = profileData["region"].ToString();
                }
                if (profileData.ContainsKey("services") && profileData["services"] != null)
                {
                    maid.Services = profileData["services"].ToString();
                }
                if (profileData.ContainsKey("timing") && profileData["timing"] != null)
                {
                    maid.Timing = profileData["timing"].ToString();
                }
                if (profileData.ContainsKey("monthlySalary"))
                {
                    if (profileData["monthlySalary"] is double salary)
                    {
                        maid.MonthlySalary = salary;
                    }
                    else if (profileData["monthlySalary"] is string salaryStr && double.TryParse(salaryStr, out double parsedSalary))
                    {
                        maid.MonthlySalary = parsedSalary;
                    }
                }

                await _maidService.SaveMaidAsync(maid);
                return Ok("Profile updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating profile: {ex.Message}");
            }
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var maid = await _maidService.GetMaidByUsernameAsync(username);
                if (maid == null)
                {
                    return NotFound("Maid not found");
                }

                var maidId = maid.Id;

                // Get counts
                var pendingRequests = await _userMaidService.CountPendingRequestsByMaidIdAsync(maidId);
                var acceptedJobs = await _userMaidService.GetRequestsByMaidIdAsync(maidId);
                var acceptedCount = acceptedJobs.Count(um => um.Status == UserMaid.RequestStatus.ACCEPTED);

                // Get recent activity
                var recentRequests = await _userMaidService.GetRequestsByMaidIdAsync(maidId);

                var dashboard = new
                {
                    maidName = maid.Name,
                    pendingRequests = pendingRequests,
                    acceptedJobs = acceptedCount,
                    averageRating = 0.0, // TODO: Implement feedback system
                    recentRequests = recentRequests
                };

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching dashboard: {ex.Message}");
            }
        }

        [HttpGet("requests")]
        public async Task<IActionResult> GetServiceRequests()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var maid = await _maidService.GetMaidByUsernameAsync(username);
                if (maid == null)
                {
                    return NotFound("Maid not found");
                }

                var requests = await _userMaidService.GetRequestsByMaidIdAsync(maid.Id);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching requests: {ex.Message}");
            }
        }

        [HttpPost("requests/{requestId}/status")]
        public async Task<IActionResult> UpdateRequestStatus(long requestId, [FromBody] Dictionary<string, string> statusData)
        {
            try
            {
                if (!statusData.ContainsKey("status"))
                {
                    return BadRequest("Status is required");
                }

                var newStatus = statusData["status"];
                if (!Enum.TryParse<UserMaid.RequestStatus>(newStatus.ToUpper(), out var status))
                {
                    return BadRequest("Invalid status");
                }

                // Verify the request belongs to the authenticated maid
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var maid = await _maidService.GetMaidByUsernameAsync(username);
                if (maid == null)
                {
                    return NotFound("Maid not found");
                }

                var request = await _userMaidService.GetRequestByIdAsync(requestId);
                if (request == null)
                {
                    return NotFound("Request not found");
                }

                if (request.MaidId != maid.Id)
                {
                    return Forbid("Unauthorized");
                }

                await _userMaidService.UpdateRequestStatusAsync(requestId, status);
                return Ok("Request status updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating request status: {ex.Message}");
            }
        }

        [HttpGet("requests/status/{status}")]
        public async Task<IActionResult> GetRequestsByStatus(string status)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var maid = await _maidService.GetMaidByUsernameAsync(username);
                if (maid == null)
                {
                    return NotFound("Maid not found");
                }

                if (!Enum.TryParse<UserMaid.RequestStatus>(status.ToUpper(), out var requestStatus))
                {
                    return BadRequest("Invalid status");
                }

                var requests = await _userMaidService.GetRequestsByMaidIdAsync(maid.Id);
                var filteredRequests = requests.Where(r => r.Status == requestStatus).ToList();

                return Ok(filteredRequests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching requests: {ex.Message}");
            }
        }

        [HttpGet("available")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvailableMaids([FromQuery] string? region)
        {
            try
            {
                List<Maid> maids;

                if (!string.IsNullOrEmpty(region))
                {
                    maids = await _maidService.GetMaidsByRegionAsync(region);
                }
                else
                {
                    maids = await _maidService.GetApprovedMaidsAsync();
                }

                return Ok(maids);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching available maids: {ex.Message}");
            }
        }

        [HttpGet("{maidId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetMaidById(long maidId)
        {
            try
            {
                var maid = await _maidService.GetMaidByIdAsync(maidId);
                if (maid == null)
                {
                    return NotFound("Maid not found");
                }

                if (!maid.Approved)
                {
                    return NotFound("Maid not available");
                }

                return Ok(maid);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching maid details: {ex.Message}");
            }
        }

        [HttpDelete("profile")]
        public async Task<IActionResult> DeleteAccount()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var maid = await _maidService.GetMaidByUsernameAsync(username);
                if (maid == null)
                {
                    return NotFound("Maid not found");
                }

                await _maidService.DeleteMaidAsync(maid.Id);
                return Ok("Account deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting account: {ex.Message}");
            }
        }
    }
}