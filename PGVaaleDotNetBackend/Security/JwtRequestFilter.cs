using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Text.Json;

namespace PGVaaleDotNetBackend.Security
{
    public class JwtRequestFilter : IMiddleware
    {
        private readonly IJwtUtil _jwtUtil;
        private readonly ILogger<JwtRequestFilter> _logger;

        public JwtRequestFilter(IJwtUtil jwtUtil, ILogger<JwtRequestFilter> logger)
        {
            _jwtUtil = jwtUtil;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            var path = context.Request.Path.Value;
            var method = context.Request.Method;

            _logger.LogInformation("JWT Filter - {Method} {Path}", method, path);
            _logger.LogInformation("Authorization Header: {AuthHeader}", context.Request.Headers["Authorization"].ToString());

            // List of public paths
            if (IsPublicPath(path))
            {
                _logger.LogInformation("Allowing public access to: {Path}", path);
                await next(context);
                return;
            }

            // Allow unauthenticated access to public auth routes
            if (path?.StartsWith("/api/auth/login") == true || 
                path?.StartsWith("/api/auth/register") == true ||
                path?.StartsWith("/api/user/pgs") == true)
            {
                await next(context);
                return;
            }

            var authHeader = context.Request.Headers["Authorization"].ToString();
            string? username = null;
            string? jwt = null;

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                jwt = authHeader.Substring(7);
                try
                {
                    username = _jwtUtil.ExtractUsername(jwt);
                    _logger.LogInformation("Extracted username: {Username}", username);
                }
                catch (Exception e)
                {
                    _logger.LogError("Error extracting username: {Error}", e.Message);
                }
            }
            else
            {
                _logger.LogInformation("No valid Bearer token found.");
            }

            if (!string.IsNullOrEmpty(username) && context.User.Identity?.IsAuthenticated != true)
            {
                try
                {
                    // Extract role from token
                    var role = _jwtUtil.ExtractClaim(jwt!, claims => claims.Claims.FirstOrDefault(c => c.Type == "role")?.Value);
                    _logger.LogInformation("Extracted role: {Role}", role);

                    if (string.IsNullOrEmpty(role))
                    {
                        _logger.LogError("No role found in JWT token");
                        await next(context);
                        return;
                    }

                    // Create claims and set authentication
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, username),
                        new Claim(ClaimTypes.Role, role)
                    };

                    var identity = new ClaimsIdentity(claims, "Bearer");
                    var principal = new ClaimsPrincipal(identity);

                    context.User = principal;
                    _logger.LogInformation("Authentication successful for user: {Username} with role: {Role}", username, role);
                }
                catch (Exception e)
                {
                    _logger.LogError("JWT validation/authentication failed: {Error}", e.Message);
                }
            }
            else if (string.IsNullOrEmpty(username))
            {
                _logger.LogInformation("No username extracted from JWT token");
            }
            else
            {
                _logger.LogInformation("User already authenticated: {Username}", username);
            }

            await next(context);
        }

        private bool IsPublicPath(string? path)
        {
            if (string.IsNullOrEmpty(path))
                return false;

            // Public endpoints (matching Java Spring Security configuration)
            return path.StartsWith("/api/user/register") ||
                   path.StartsWith("/api/user/login") ||
                   path.StartsWith("/api/admin/register") ||
                   path.StartsWith("/api/admin/login") ||
                   path.StartsWith("/api/admin/test") ||
                   path.StartsWith("/api/admin/test-password") ||
                   path.StartsWith("/api/owner/register") ||
                   path.StartsWith("/api/owner/login") ||
                   path.StartsWith("/api/maid/register") ||
                   path.StartsWith("/api/maid/login") ||
                   path.StartsWith("/api/tiffin/register") ||
                   path.StartsWith("/api/tiffin/login") ||
                   path.StartsWith("/api/auth/register") ||
                   path.StartsWith("/api/auth/login") ||
                   path.StartsWith("/api/public") ||
                   path.StartsWith("/api/pg/all") ||
                   path.StartsWith("/api/pg/region") ||
                   path.StartsWith("/api/pgrooms") ||
                   path.StartsWith("/api/room-interests") ||
                   path.StartsWith("/api/pdf") ||
                   path.StartsWith("/api/contactUs") ||
                   path.StartsWith("/swagger-ui") ||
                   path.StartsWith("/v3/api-docs") ||
                   path.StartsWith("/api/"); // Allow all /api/ endpoints for now (adjust as needed)
        }
    }
}
