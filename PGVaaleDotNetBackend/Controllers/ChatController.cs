using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;
using System.Security.Claims;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/chat")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatMessageRepository _chatMessageRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<ChatController> _logger;

        public ChatController(IChatMessageRepository chatMessageRepository, IUserRepository userRepository, ILogger<ChatController> logger)
        {
            _chatMessageRepository = chatMessageRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages([FromQuery] string region)
        {
            try
            {
                // Check if user is authenticated
                if (!User.Identity?.IsAuthenticated == true)
                {
                    _logger.LogWarning("User not authenticated for chat messages");
                    return Unauthorized("User not authenticated");
                }

                if (string.IsNullOrEmpty(region))
                {
                    return BadRequest("Region is required");
                }

                var messages = await _chatMessageRepository.GetByRegionOrderByTimestampAscAsync(region);
                
                // Convert to DTO for frontend
                var messageDtos = messages.Select(m => new
                {
                    id = m.Id,
                    username = m.Username,
                    message = m.Message,
                    region = m.Region,
                    timestamp = m.Timestamp
                }).ToList();

                return Ok(messageDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching messages for region: {Region}", region);
                return StatusCode(500, $"Error fetching messages: {ex.Message}");
            }
        }

        [HttpPost("message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageRequest request)
        {
            try
            {
                // Check if user is authenticated
                if (!User.Identity?.IsAuthenticated == true)
                {
                    _logger.LogWarning("User not authenticated for sending message");
                    return Unauthorized("User not authenticated");
                }

                if (string.IsNullOrEmpty(request.Message) || string.IsNullOrEmpty(request.Region))
                {
                    return BadRequest("Message and region are required");
                }

                // Get the current user from the JWT token
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    _logger.LogWarning("Username not found in JWT token claims");
                    return Unauthorized("User not authenticated - username not found");
                }

                // Get user ID from JWT token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                {
                    _logger.LogWarning("User ID not found in JWT token claims");
                    return Unauthorized("User not authenticated - user ID not found");
                }

                // Validate that the user exists in the database
                var user = await _userRepository.FindByUsernameAsync(username);
                if (user == null)
                {
                    _logger.LogWarning("User not found in database: {Username}", username);
                    return Unauthorized("User not found");
                }

                _logger.LogInformation("Sending message for user: {Username} (ID: {UserId})", username, userId);

                // Create a new chat message
                var chatMessage = new ChatMessage
                {
                    Username = username, // Use the authenticated user's username
                    Message = request.Message,
                    Region = request.Region,
                    Timestamp = DateTime.UtcNow,
                    SenderId = userId, // Use the actual sender ID from JWT token
                    ReceiverId = userId // For now, set to same user (can be updated for direct messaging)
                };

                var savedMessage = await _chatMessageRepository.SaveAsync(chatMessage);

                // Return the saved message
                var messageDto = new
                {
                    id = savedMessage.Id,
                    username = savedMessage.Username,
                    message = savedMessage.Message,
                    region = savedMessage.Region,
                    timestamp = savedMessage.Timestamp
                };

                _logger.LogInformation("Message sent successfully for user: {Username}", username);
                return Ok(messageDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message");
                return StatusCode(500, $"Error sending message: {ex.Message}");
            }
        }
    }

    public class ChatMessageRequest
    {
        public string Message { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
    }
}
