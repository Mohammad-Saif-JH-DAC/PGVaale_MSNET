using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using PGVaaleDotNetBackend.Services;

namespace PGVaaleDotNetBackend.Controllers
{
    [ApiController]
    [Route("api/pdf")]
    [Authorize]
    public class PdfController : ControllerBase
    {
        private readonly PdfGeneratorService _pdfGeneratorService;
        private readonly ILogger<PdfController> _logger;

        public PdfController(PdfGeneratorService pdfGeneratorService, ILogger<PdfController> logger)
        {
            _pdfGeneratorService = pdfGeneratorService;
            _logger = logger;
        }

        [HttpGet("contract")]
        public async Task<IActionResult> GenerateContract([FromQuery] string roomNo, [FromQuery] string price)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                // Generate a simple user ID (in a real app, you'd get this from the database)
                var userId = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();

                // Generate the PDF
                var pdfBytes = _pdfGeneratorService.GenerateContractPdf(username, userId, roomNo, price);

                // Return the PDF as a file download
                return File(pdfBytes, "application/pdf", $"PGVaale_Contract_{username}_{DateTime.Now:yyyyMMdd}.pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate PDF contract");
                return StatusCode(500, "Failed to generate PDF contract");
            }
        }

        [HttpPost("contract")]
        public async Task<IActionResult> GenerateContractPost([FromBody] ContractRequest request)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User not authenticated");
                }

                // Generate a simple user ID (in a real app, you'd get this from the database)
                var userId = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();

                // Generate the PDF
                var pdfBytes = _pdfGeneratorService.GenerateContractPdf(username, userId, request.RoomNo, request.Price);

                // Return the PDF as a file download
                return File(pdfBytes, "application/pdf", $"PGVaale_Contract_{username}_{DateTime.Now:yyyyMMdd}.pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate PDF contract");
                return StatusCode(500, "Failed to generate PDF contract");
            }
        }
    }

    public class ContractRequest
    {
        public string RoomNo { get; set; } = string.Empty;
        public string Price { get; set; } = string.Empty;
    }
}
