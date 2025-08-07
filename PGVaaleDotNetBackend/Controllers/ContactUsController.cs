using Microsoft.AspNetCore.Mvc;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/contactUs")]
    public class ContactUsController : ControllerBase
    {
        [HttpGet("all")]
        public IActionResult GetAllContactUs()
        {
            // TODO: Replace with real data
            return Ok(new[] { new { id = 1, name = "John Doe", message = "Hello!" } });
        }
    }
}
