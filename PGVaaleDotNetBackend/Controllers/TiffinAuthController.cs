using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.DTOs;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/tiffin")]
    public class TiffinAuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            return Ok(new { token = "tiffin-token-sample" });
        }
    }
}