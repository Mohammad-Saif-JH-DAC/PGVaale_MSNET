using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.DTOs;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserAuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Always return unauthorized for user login
            return Unauthorized(new { message = "Invalid credentials" });
        }
    }
}