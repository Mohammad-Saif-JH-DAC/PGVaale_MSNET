using Microsoft.AspNetCore.Mvc;
using PGVaaleDotNetBackend.DTOs;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Services;
using System.Security.Claims;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;
        private readonly MaidService _maidService;
        private readonly TiffinService _tiffinService;
        private readonly DashboardService _dashboardService;
        private readonly EmailService _emailService;

        public AdminController(AdminService adminService, MaidService maidService, TiffinService tiffinService, DashboardService dashboardService, EmailService emailService)
        {
            _adminService = adminService;
            _maidService = maidService;
            _tiffinService = tiffinService;
            _dashboardService = dashboardService;
            _emailService = emailService;
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestAdmin()
        {
            try
            {
                var allAdmins = await _adminService.GetAllAdminsAsync();
                var adminOptional = await _adminService.GetAdminByUsernameAsync("admin");

                var result = new
                {
                    totalAdmins = allAdmins.Count,
                    adminExists = adminOptional != null,
                    adminDetails = adminOptional != null ? new
                    {
                        id = adminOptional.Id,
                        username = adminOptional.Username,
                        email = adminOptional.Email,
                        name = adminOptional.Name
                    } : null
                };

                return Ok(result);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error: {e.Message}");
            }
        }

        [HttpGet("maids")]
        public async Task<IActionResult> GetAllMaids()
        {
            try
            {
                var maids = await _maidService.GetAllMaidsAsync();
                return Ok(maids);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error fetching maids: {e.Message}");
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAdmins()
        {
            try
            {
                var admins = await _adminService.GetAllAdminsAsync();
                return Ok(admins);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error fetching admins: {e.Message}");
            }
        }

        // Get pending maids (not approved yet)
        [HttpGet("maids/pending")]
        public async Task<IActionResult> GetPendingMaids()
        {
            try
            {
                var pendingMaids = await _maidService.GetMaidsByApprovedStatusAsync(false);
                return Ok(pendingMaids);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error fetching pending maids: {e.Message}");
            }
        }

        // Approve maid
        [HttpPost("maids/{id}/approve")]
        public async Task<IActionResult> ApproveMaid(long id)
        {
            try
            {
                var maid = await _maidService.GetMaidByIdAsync(id);
                if (maid == null)
                {
                    return NotFound();
                }

                maid.Approved = true;
                var savedMaid = await _maidService.SaveMaidAsync(maid);

                // Send approval confirmation email
                try
                {
                    _emailService.SendApprovalConfirmationEmail(savedMaid.Email ?? "", savedMaid.Name ?? "", "Maid");
                }
                catch (Exception emailException)
                {
                    // Log email error but don't fail approval
                    Console.WriteLine($"Failed to send approval confirmation email to {savedMaid.Email}: {emailException.Message}");
                }

                return Ok($"Maid {savedMaid.Name} approved successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error approving maid: {e.Message}");
            }
        }

        // Reject maid
        [HttpPost("maids/{id}/reject")]
        public async Task<IActionResult> RejectMaid(long id)
        {
            try
            {
                var maid = await _maidService.GetMaidByIdAsync(id);
                if (maid == null)
                {
                    return NotFound();
                }

                await _maidService.DeleteMaidAsync(id);
                return Ok("Maid rejected and removed successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error rejecting maid: {e.Message}");
            }
        }

        // Get dashboard statistics
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error fetching dashboard statistics: {e.Message}");
            }
        }

        // Get pending tiffins
        [HttpGet("tiffins/pending")]
        public async Task<IActionResult> GetPendingTiffins()
        {
            try
            {
                var pendingTiffins = await _tiffinService.GetAllTiffinsAsync();
                var pendingList = pendingTiffins.Where(t => !t.Approved).ToList();
                return Ok(pendingList);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error fetching pending tiffins: {e.Message}");
            }
        }

        // Approve tiffin
        [HttpPost("tiffins/{id}/approve")]
        public async Task<IActionResult> ApproveTiffin(long id)
        {
            try
            {
                var tiffin = _tiffinService.GetTiffinById(id);
                if (tiffin == null)
                {
                    return NotFound();
                }

                tiffin.Approved = true;
                var savedTiffin = _tiffinService.SaveTiffin(tiffin);

                // Send approval confirmation email
                try
                {
                    _emailService.SendApprovalConfirmationEmail(savedTiffin.Email ?? "", savedTiffin.Name ?? "", "Tiffin");
                }
                catch (Exception emailException)
                {
                    // Log email error but don't fail approval
                    Console.WriteLine($"Failed to send approval confirmation email to {savedTiffin.Email}: {emailException.Message}");
                }

                return Ok($"Tiffin {savedTiffin.Name} approved successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error approving tiffin: {e.Message}");
            }
        }

        // Reject tiffin
        [HttpPost("tiffins/{id}/reject")]
        public async Task<IActionResult> RejectTiffin(long id)
        {
            try
            {
                var tiffin = _tiffinService.GetTiffinById(id);
                if (tiffin == null)
                {
                    return NotFound();
                }

                _tiffinService.DeleteTiffin(id);
                return Ok("Tiffin rejected and removed successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error rejecting tiffin: {e.Message}");
            }
        }
    }
}
