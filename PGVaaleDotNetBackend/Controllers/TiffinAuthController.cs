using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PGVaaleDotNetBackend.DTOs;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Services;
using PGVaaleDotNetBackend.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/tiffin")]
    public class TiffinAuthController : ControllerBase
    {
        private readonly ILogger<TiffinAuthController> _logger;
        private readonly TiffinService _tiffinService;
        private readonly ITiffinRepository _tiffinRepository;
        private readonly EmailService _emailService;
        private readonly JwtService _jwtService;

        public TiffinAuthController(
            ILogger<TiffinAuthController> logger, 
            TiffinService tiffinService, 
            ITiffinRepository tiffinRepository,
            EmailService emailService, 
            JwtService jwtService)
        {
            _logger = logger;
            _tiffinService = tiffinService;
            _tiffinRepository = tiffinRepository;
            _emailService = emailService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] TiffinRegisterRequest request)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(request.Username))
                {
                    return BadRequest("Username is required");
                }
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest("Email is required");
                }
                if (string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest("Password is required");
                }
                if (string.IsNullOrWhiteSpace(request.Name))
                {
                    return BadRequest("Name is required");
                }
                if (string.IsNullOrWhiteSpace(request.PhoneNumber))
                {
                    return BadRequest("Phone number is required");
                }
                if (string.IsNullOrWhiteSpace(request.Aadhaar))
                {
                    return BadRequest("Aadhaar is required");
                }
                if (string.IsNullOrWhiteSpace(request.FoodCategory))
                {
                    return BadRequest("Food category is required");
                }
                if (string.IsNullOrWhiteSpace(request.Region))
                {
                    return BadRequest("Region is required");
                }
                if (string.IsNullOrWhiteSpace(request.MaidAddress))
                {
                    return BadRequest("Address is required");
                }

                // Check if username exists
                var existingTiffin = await _tiffinRepository.GetByUsernameAsync(request.Username);
                if (existingTiffin != null)
                {
                    return BadRequest("Username already exists");
                }

                // Check if email exists
                var existingEmail = await _tiffinRepository.GetByEmailAsync(request.Email);
                if (existingEmail != null)
                {
                    return BadRequest("Email already exists");
                }

                // Create new tiffin
                var tiffin = new Tiffin
                {
                    Username = request.Username,
                    Password = HashPassword(request.Password),
                    Email = request.Email,
                    Name = request.Name,
                    PhoneNumber = request.PhoneNumber,
                    Aadhaar = request.Aadhaar,
                    Price = request.Price,
                    FoodCategory = request.FoodCategory,
                    Region = request.Region,
                    MaidAddress = request.MaidAddress,
                    Approved = false, // Default to false, needs admin approval
                    UniqueId = Guid.NewGuid().ToString()
                };

                // Save tiffin
                var savedTiffin = _tiffinService.SaveTiffin(tiffin);

                // Send pending approval email
                try
                {
                    _emailService.SendWelcomeEmail(savedTiffin.Email ?? "", savedTiffin.Name ?? "", "Tiffin");
                }
                catch (Exception emailException)
                {
                    // Log email error but don't fail registration
                    _logger.LogError(emailException, "Failed to send welcome email to {Email}", savedTiffin.Email);
                }

                return Ok($"Tiffin registration successful for {savedTiffin.Username}. Your account is pending admin approval.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tiffin registration failed");
                return StatusCode(500, $"Registration failed: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Tiffin login attempt for username: {Username}", request?.Username);
                
                if (string.IsNullOrWhiteSpace(request?.Username))
                {
                    _logger.LogWarning("Tiffin login failed: Username is required");
                    return BadRequest("Username is required");
                }
                if (string.IsNullOrWhiteSpace(request?.Password))
                {
                    _logger.LogWarning("Tiffin login failed: Password is required");
                    return BadRequest("Password is required");
                }

                // Check if tiffin exists
                var tiffin = await _tiffinRepository.GetByUsernameAsync(request.Username);
                if (tiffin == null)
                {
                    _logger.LogWarning("Tiffin login failed: Tiffin not found for username: {Username}", request.Username);
                    return Unauthorized("Invalid credentials");
                }

                // Check if tiffin is approved by admin
                if (!tiffin.Approved)
                {
                    _logger.LogWarning("Tiffin login failed: Account not approved for username: {Username}", request.Username);
                    return Unauthorized("Account is pending admin approval. Please wait for approval.");
                }

                _logger.LogInformation("Tiffin found: {Username}, stored password hash: {PasswordHash}", tiffin.Username, tiffin.Password);

                // Verify password
                if (!VerifyPassword(request.Password, tiffin.Password ?? ""))
                {
                    _logger.LogWarning("Tiffin login failed: Password verification failed for username: {Username}", request.Username);
                    return Unauthorized("Invalid credentials");
                }

                _logger.LogInformation("Tiffin login successful for username: {Username}", request.Username);

                // Generate JWT token using the JWT service
                var token = _jwtService.GenerateToken(tiffin);

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tiffin login failed");
                return StatusCode(500, $"Login failed: {ex.Message}");
            }
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            var hashedInput = HashPassword(password);
            return hashedInput == hashedPassword;
        }
    }
}