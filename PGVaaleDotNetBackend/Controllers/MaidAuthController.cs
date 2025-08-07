using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.DTOs;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/maid")]
    public class MaidAuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            return Ok(new { token = "maid-token-sample" });
        }
    }
}