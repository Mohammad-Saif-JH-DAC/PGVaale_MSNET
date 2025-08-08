using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using PGVaaleDotNetBackend.Services;
using PGVaaleDotNetBackend.Repositories;
using PGVaaleDotNetBackend.DTOs;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IUserRepository _userRepository;

        public UserController(UserService userService, IUserRepository userRepository)
        {
            _userService = userService;
            _userRepository = userRepository;
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

                var user = await _userRepository.FindByUsernameAsync(username);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Return user profile data
                var profileData = new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    name = user.Name,
                    aadhaar = user.Aadhaar,
                    age = user.Age,
                    gender = user.Gender,
                    mobileNumber = user.MobileNumber
                };

                return Ok(profileData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching user profile: {ex.Message}");
            }
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var user = await _userRepository.FindByUsernameAsync(username);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Update allowed fields
                user.Name = request.Name;
                user.Email = request.Email;
                user.MobileNumber = request.MobileNumber;
                user.Age = request.Age;
                user.Gender = request.Gender;

                var updatedUser = await _userRepository.SaveAsync(user);

                var profileData = new
                {
                    id = updatedUser.Id,
                    username = updatedUser.Username,
                    email = updatedUser.Email,
                    name = updatedUser.Name,
                    aadhaar = updatedUser.Aadhaar,
                    age = updatedUser.Age,
                    gender = updatedUser.Gender,
                    mobileNumber = updatedUser.MobileNumber
                };

                return Ok(profileData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating user profile: {ex.Message}");
            }
        }

        [HttpDelete("profile")]
        public async Task<IActionResult> DeleteProfile()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var user = await _userRepository.FindByUsernameAsync(username);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                await _userRepository.DeleteAsync(user.Id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting user profile: {ex.Message}");
            }
        }

        [HttpGet("maids")]
        public IActionResult GetMaids() => Ok("List of maids");

        [HttpGet("maids/{maidId}")]
        public IActionResult GetMaid(int maidId) => Ok($"Maid {maidId}");

        [HttpPost("maids/hire")]
        public IActionResult HireMaid() => Ok("Hire maid");

        [HttpGet("maid-requests")]
        public IActionResult GetMaidRequests() => Ok("Maid requests");

        [HttpPost("maid-requests/{requestId}/change")]
        public IActionResult ChangeMaidRequest(int requestId) => Ok($"Change maid request {requestId}");

        [HttpGet("tiffins")]
        public IActionResult GetTiffins() => Ok("List of tiffins");

        [HttpGet("tiffins/{tiffinId}")]
        public IActionResult GetTiffin(int tiffinId) => Ok($"Tiffin {tiffinId}");

        [HttpPost("tiffins/{tiffinId}/request")]
        public IActionResult RequestTiffin(int tiffinId) => Ok($"Request tiffin {tiffinId}");

        [HttpGet("requests")]
        public IActionResult GetRequests() => Ok("User requests");

        [HttpGet("active-service")]
        public IActionResult GetActiveService() => Ok("Active service");

        [HttpGet("bookings")]
        public IActionResult GetBookings() => Ok("User bookings");

        [HttpGet("pgs")]
        public IActionResult GetPGs() => Ok("List of PGs");
    }
}