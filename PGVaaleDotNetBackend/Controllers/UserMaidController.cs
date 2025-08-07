using Microsoft.AspNetCore.Mvc;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/user-maid")]
    public class UserMaidController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok("UserMaid endpoint");
    }
}