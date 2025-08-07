using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.DTOs;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminAuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request.Username == "admin" && request.Password == "admin123")
            {
                // This is a valid fake JWT: header.payload.signature
                // header: {"alg":"HS256","typ":"JWT"} (base64: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9)
                // payload: {"role":"admin"} (base64: eyJyb2xlIjoiYWRtaW4ifQ)
                string fakeJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ.signature";
                return Ok(new { token = fakeJwt });
            }
            else
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }
        }
    }
}