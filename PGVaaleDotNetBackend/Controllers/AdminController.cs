using Microsoft.AspNetCore.Mvc;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        [HttpGet("tiffins/pending")]
        public IActionResult GetPendingTiffins()
        {
            // TODO: Replace with real data
            return Ok(new[] { new { id = 1, name = "Sample Tiffin", status = "pending" } });
        }

        [HttpGet("maids/pending")]
        public IActionResult GetPendingMaids()
        {
            // TODO: Replace with real data
            return Ok(new[] { new { id = 1, name = "Sample Maid", status = "pending" } });
        }

        [HttpGet("dashboard-stats")]
        public IActionResult GetDashboardStats()
        {
            // TODO: Replace with real stats
            return Ok(new { users = 10, maids = 2, tiffins = 3, pgs = 1 });
        }
    }
}
