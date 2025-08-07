using Microsoft.AspNetCore.Mvc;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        [HttpGet("profile")]
        public IActionResult GetProfile() => Ok("User profile");

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