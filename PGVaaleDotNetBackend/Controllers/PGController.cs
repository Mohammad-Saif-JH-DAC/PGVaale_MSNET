using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;
using System.Security.Claims;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/pg")]
    public class PGController : ControllerBase
    {
        private readonly IPGRepository _pgRepository;
        private readonly IUserRepository _userRepository;
        private readonly IOwnerRepository _ownerRepository;

        public PGController(IPGRepository pgRepository, IUserRepository userRepository, IOwnerRepository ownerRepository)
        {
            _pgRepository = pgRepository;
            _userRepository = userRepository;
            _ownerRepository = ownerRepository;
        }

        // GET /api/pg/all - Get all PGs (public access)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPGs()
        {
            try
            {
                var pgs = await _pgRepository.GetAllAsync();
                return Ok(pgs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching PGs: {ex.Message}");
            }
        }

        // GET /api/pg/{id} - Get specific PG by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPGById(long id)
        {
            try
            {
                var pg = await _pgRepository.GetByIdAsync(id);
                if (pg == null)
                {
                    return NotFound("PG not found");
                }
                return Ok(pg);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching PG: {ex.Message}");
            }
        }

        // GET /api/pg/user/booked - Get PGs booked by current user
        [HttpGet("user/booked")]
        [Authorize]
        public async Task<IActionResult> GetUserBookedPGs()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var user = await _userRepository.FindByUsernameAsync(username);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var bookedPGs = await _pgRepository.FindByRegisteredUserAsync(user);
                return Ok(bookedPGs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching booked PGs: {ex.Message}");
            }
        }

        // GET /api/pg/owner/{ownerId} - Get PGs owned by specific owner
        [HttpGet("owner/{ownerId}")]
        [Authorize]
        public async Task<IActionResult> GetOwnerPGs(long ownerId)
        {
            try
            {
                var owner = await _ownerRepository.GetByIdAsync(ownerId);
                if (owner == null)
                {
                    return NotFound("Owner not found");
                }

                var pgs = await _pgRepository.FindByOwnerAsync(owner);
                return Ok(pgs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching owner PGs: {ex.Message}");
            }
        }

        // POST /api/pg/register - Register new PG
        [HttpPost("register")]
        [Authorize]
        public async Task<IActionResult> RegisterPG([FromBody] PG pg)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var savedPG = await _pgRepository.SaveAsync(pg);
                return CreatedAtAction(nameof(GetPGById), new { id = savedPG.Id }, savedPG);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error registering PG: {ex.Message}");
            }
        }

        // PUT /api/pg/{id} - Update PG
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePG(long id, [FromBody] PG pg)
        {
            try
            {
                if (id != pg.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingPG = await _pgRepository.GetByIdAsync(id);
                if (existingPG == null)
                {
                    return NotFound("PG not found");
                }

                var updatedPG = await _pgRepository.SaveAsync(pg);
                return Ok(updatedPG);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating PG: {ex.Message}");
            }
        }

        // DELETE /api/pg/{id} - Delete PG
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePG(long id)
        {
            try
            {
                var pg = await _pgRepository.GetByIdAsync(id);
                if (pg == null)
                {
                    return NotFound("PG not found");
                }

                await _pgRepository.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting PG: {ex.Message}");
            }
        }

        // POST /api/pg/{id}/book - Book a PG
        [HttpPost("{id}/book")]
        [Authorize]
        public async Task<IActionResult> BookPG(long id)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                var user = await _userRepository.FindByUsernameAsync(username);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var pg = await _pgRepository.GetByIdAsync(id);
                if (pg == null)
                {
                    return NotFound("PG not found");
                }

                // Update the PG to assign it to the user
                pg.UserId = user.Id;
                pg.Availability = "Booked";
                
                var updatedPG = await _pgRepository.SaveAsync(pg);
                return Ok(updatedPG);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error booking PG: {ex.Message}");
            }
        }

        // GET /api/pg/region/{region} - Get PGs by region
        [HttpGet("region/{region}")]
        public async Task<IActionResult> GetPGsByRegion(string region)
        {
            try
            {
                var pgs = await _pgRepository.FindByRegionAsync(region);
                return Ok(pgs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching PGs by region: {ex.Message}");
            }
        }

        // GET /api/pg/preference/{preference} - Get PGs by preference
        [HttpGet("preference/{preference}")]
        public async Task<IActionResult> GetPGsByPreference(string preference)
        {
            try
            {
                var pgs = await _pgRepository.FindByGeneralPreferenceAsync(preference);
                return Ok(pgs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching PGs by preference: {ex.Message}");
            }
        }
    }
}