using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PGVaaleDotNetBackend.DTOs;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Services;
using System;
using System.Collections.Generic;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/maid")]
    public class MaidAuthController : ControllerBase
    {
        private readonly ILogger<MaidAuthController> _logger;
        private readonly MaidService _maidService;
        private readonly EmailService _emailService;
        private readonly JwtService _jwtService;

        public MaidAuthController(ILogger<MaidAuthController> logger, MaidService maidService, EmailService emailService, JwtService jwtService)
        {
            _logger = logger;
            _maidService = maidService;
            _emailService = emailService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] MaidRegisterRequest request)
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

                // Check if username exists
                var existingMaid = await _maidService.GetMaidByUsernameAsync(request.Username);
                if (existingMaid != null)
                {
                    return BadRequest("Username already exists");
                }

                // Check if email exists
                var existingEmail = await _maidService.GetMaidByEmailAsync(request.Email);
                if (existingEmail != null)
                {
                    return BadRequest("Email already exists");
                }

                // Create new maid
                var maid = new Maid
                {
                    Username = request.Username,
                    Password = _maidService.HashPassword(request.Password),
                    Email = request.Email,
                    Name = request.Name,
                    PhoneNumber = request.PhoneNumber,
                    Aadhaar = request.Aadhaar,
                    Services = request.Services,
                    MonthlySalary = request.MonthlySalary,
                    Gender = request.Gender,
                    Timing = request.Timing,
                    Region = request.Region,
                    Approved = false, // Default to false, needs admin approval
                    Active = true
                };

                // Save maid
                var savedMaid = await _maidService.SaveMaidAsync(maid);

                // Send pending approval email
                try
                {
                    _emailService.SendWelcomeEmail(savedMaid.Email ?? "", savedMaid.Name ?? "", "Maid");
                }
                catch (Exception emailException)
                {
                    // Log email error but don't fail registration
                    _logger.LogError(emailException, "Failed to send welcome email to {Email}", savedMaid.Email);
                }

                return Ok($"Maid registration successful for {savedMaid.Username}. Your account is pending admin approval.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Maid registration failed");
                return StatusCode(500, $"Registration failed: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Maid login attempt for username: {Username}", request?.Username);
                
                if (string.IsNullOrWhiteSpace(request?.Username))
                {
                    _logger.LogWarning("Maid login failed: Username is required");
                    return BadRequest("Username is required");
                }
                if (string.IsNullOrWhiteSpace(request?.Password))
                {
                    _logger.LogWarning("Maid login failed: Password is required");
                    return BadRequest("Password is required");
                }

                // Check if maid exists
                var maid = await _maidService.GetMaidByUsernameAsync(request.Username);
                if (maid == null)
                {
                    _logger.LogWarning("Maid login failed: Maid not found for username: {Username}", request.Username);
                    return Unauthorized("Invalid credentials");
                }

                // Check if maid is approved by admin
                if (!maid.Approved)
                {
                    _logger.LogWarning("Maid login failed: Account not approved for username: {Username}", request.Username);
                    return Unauthorized("Account is pending admin approval. Please wait for approval.");
                }

                _logger.LogInformation("Maid found: {Username}, stored password hash: {PasswordHash}", maid.Username, maid.Password);

                // Verify password
                if (!_maidService.VerifyPassword(request.Password, maid.Password ?? ""))
                {
                    _logger.LogWarning("Maid login failed: Password verification failed for username: {Username}", request.Username);
                    return Unauthorized("Invalid credentials");
                }

                _logger.LogInformation("Maid login successful for username: {Username}", request.Username);

                // Generate JWT token using the JWT service
                var token = _jwtService.GenerateToken(maid);

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Maid login failed");
                return StatusCode(500, $"Login failed: {ex.Message}");
            }
        }


    }
}