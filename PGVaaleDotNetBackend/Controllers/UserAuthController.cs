using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PGVaaleDotNetBackend.DTOs;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;


namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserAuthController : ControllerBase
    {
        private readonly ILogger<UserAuthController> _logger;
        private readonly UserService _userService;
        private readonly EmailService _emailService;
        private readonly JwtService _jwtService;

        public UserAuthController(ILogger<UserAuthController> logger, UserService userService, EmailService emailService, JwtService jwtService)
        {
            _logger = logger;
            _userService = userService;
            _emailService = emailService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
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
                if (string.IsNullOrWhiteSpace(request.Aadhaar))
                {
                    return BadRequest("Aadhaar is required");
                }
                if (string.IsNullOrWhiteSpace(request.MobileNumber))
                {
                    return BadRequest("Mobile number is required");
                }
                if (string.IsNullOrWhiteSpace(request.Gender))
                {
                    return BadRequest("Gender is required");
                }

                // Check if username exists
                var existingUser = await _userService.GetUserByUsernameAsync(request.Username);
                if (existingUser != null)
                {
                    return BadRequest("Username already exists");
                }

                // Check if email exists
                var existingEmail = await _userService.GetUserByEmailAsync(request.Email);
                if (existingEmail != null)
                {
                    return BadRequest("Email already exists");
                }

                // Create new user
                var user = new User
                {
                    Username = request.Username,
                    Password = HashPassword(request.Password),
                    Email = request.Email,
                    Name = request.Name,
                    Aadhaar = request.Aadhaar,
                    MobileNumber = request.MobileNumber,
                    Age = request.Age ?? 0,
                    Gender = request.Gender,
                    // UniqueId removed as it doesn't exist in database schema
                };

                // Save user
                var savedUser = await _userService.SaveUserAsync(user);

                // Send welcome email
                try
                {
                    _emailService.SendWelcomeEmail(savedUser.Email, savedUser.Name, "User");
                }
                catch (Exception emailException)
                {
                    // Log email error but don't fail registration
                    _logger.LogError(emailException, "Failed to send welcome email to {Email}", savedUser.Email);
                }

                return Ok($"User registration successful for {savedUser.Username}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed");
                return StatusCode(500, $"Registration failed: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Login attempt for username: {Username}", request?.Username);
                
                if (string.IsNullOrWhiteSpace(request?.Username))
                {
                    _logger.LogWarning("Login failed: Username is required");
                    return BadRequest("Username is required");
                }
                if (string.IsNullOrWhiteSpace(request?.Password))
                {
                    _logger.LogWarning("Login failed: Password is required");
                    return BadRequest("Password is required");
                }

                // Check if user exists and is a USER
                var user = await _userService.GetUserByUsernameAsync(request.Username);
                if (user == null)
                {
                    _logger.LogWarning("Login failed: User not found for username: {Username}", request.Username);
                    return Unauthorized("Invalid credentials");
                }

                _logger.LogInformation("User found: {Username}, stored password hash: {PasswordHash}", user.Username, user.Password);

                // Verify password
                var inputHash = HashPassword(request.Password);
                _logger.LogInformation("Input password hash: {InputHash}", inputHash);
                
                if (!VerifyPassword(request.Password, user.Password))
                {
                    _logger.LogWarning("Login failed: Password verification failed for username: {Username}", request.Username);
                    return Unauthorized("Invalid credentials");
                }

                _logger.LogInformation("Login successful for username: {Username}", request.Username);

                // Generate JWT token using the JWT service
                var token = _jwtService.GenerateToken(user);

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed");
                return StatusCode(500, $"Login failed: {ex.Message}");
            }
        }

        private string HashPassword(string password)
        {
            // Use BCrypt to match existing database format
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }


    }
}