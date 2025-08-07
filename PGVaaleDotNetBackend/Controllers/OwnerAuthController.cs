using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.DTOs;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/owner")]
    public class OwnerAuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            return Ok(new { token = "owner-token-sample" });
        }
    }
}