using Microsoft.AspNetCore.Mvc;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/pg")]
    public class PGController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok("PG endpoint");
    }
}