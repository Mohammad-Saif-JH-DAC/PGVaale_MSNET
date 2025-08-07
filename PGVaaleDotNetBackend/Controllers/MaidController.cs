using Microsoft.AspNetCore.Mvc;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/maid")]
    public class MaidController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok("Maid endpoint");
    }
}