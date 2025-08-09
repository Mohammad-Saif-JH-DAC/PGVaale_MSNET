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

            _logger.LogDebug("JWT Filter - {Method} {Path}", method, path);

            // Check if this is a public path first
            if (IsPublicPath(path))
            {
                _logger.LogDebug("Allowing public access to: {Path}", path);
                await next(context);
                return;
            }

            _logger.LogDebug("Path {Path} requires authentication", path);

            // For all other paths, require authentication
            var authHeader = context.Request.Headers["Authorization"].ToString();
            string? username = null;
            string? jwt = null;

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                jwt = authHeader.Substring(7);
                _logger.LogDebug("Found Bearer token for path: {Path}", path);
                
                try
                {
                    // Validate the token first
                    if (!_jwtUtil.ValidateToken(jwt))
                    {
                        _logger.LogWarning("Invalid or expired JWT token for path: {Path}", path);
                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync("{\"message\":\"Invalid or expired token\"}");
                        return;
                    }

                    username = _jwtUtil.ExtractUsername(jwt);
                    _logger.LogDebug("Extracted username: {Username} for path: {Path}", username, path);
                    
                    if (string.IsNullOrEmpty(username))
                    {
                        _logger.LogWarning("No username could be extracted from token for path: {Path}", path);
                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync("{\"message\":\"Invalid token: no username found\"}");
                        return;
                    }
                }
                catch (Exception e)
                {
                    _logger.LogError("Error extracting username from token for path {Path}: {Error}", path, e.Message);
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{\"message\":\"Invalid token\"}");
                    return;
                }
            }
            else
            {
                _logger.LogWarning("No valid Bearer token found for protected path: {Path}", path);
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("{\"message\":\"Authorization header required\"}");
                return;
            }

            if (!string.IsNullOrEmpty(username) && context.User.Identity?.IsAuthenticated != true)
            {
                try
                {
                    // Extract role from token - try multiple possible claim types
                    var role = _jwtUtil.ExtractClaim(jwt!, claims => 
                    {
                        // Try different possible role claim types
                        var roleClaim = claims.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
                        if (!string.IsNullOrEmpty(roleClaim))
                            return roleClaim;
                            
                        var roleClaim2 = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
                        if (!string.IsNullOrEmpty(roleClaim2))
                            return roleClaim2;
                            
                        var roleClaim3 = claims.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
                        if (!string.IsNullOrEmpty(roleClaim3))
                            return roleClaim3;
                            
                        return null;
                    });
                    
                    _logger.LogDebug("Extracted role: {Role} for user: {Username}", role, username);

                    if (string.IsNullOrEmpty(role))
                    {
                        _logger.LogError("No role found in JWT token for user: {Username}", username);
                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync("{\"message\":\"Invalid token: no role found\"}");
                        return;
                    }

                    // Extract user ID from token
                    var userId = _jwtUtil.ExtractUserId(jwt!);
                    _logger.LogDebug("Extracted user ID: {UserId} for user: {Username}", userId, username);

                    // Create claims and set authentication
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, username),
                        new Claim(ClaimTypes.Role, role)
                    };

                    // Add user ID claim if available
                    if (userId.HasValue)
                    {
                        claims.Add(new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()));
                    }

                    var identity = new ClaimsIdentity(claims, "Bearer");
                    var principal = new ClaimsPrincipal(identity);

                    context.User = principal;
                    _logger.LogDebug("Authentication successful for user: {Username} with role: {Role} and ID: {UserId}", username, role, userId);
                }
                catch (Exception e)
                {
                    _logger.LogError("JWT validation/authentication failed for user {Username}: {Error}", username, e.Message);
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{\"message\":\"Authentication failed\"}");
                    return;
                }
            }
            else if (string.IsNullOrEmpty(username))
            {
                _logger.LogWarning("No username extracted from JWT token for path: {Path}", path);
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("{\"message\":\"Invalid token: no username found\"}");
                return;
            }
            else
            {
                _logger.LogDebug("User already authenticated: {Username} for path: {Path}", username, path);
            }

            await next(context);
        }

        private bool IsPublicPath(string? path)
        {
            if (string.IsNullOrEmpty(path))
                return false;

            // Normalize the path to ensure consistent matching
            var normalizedPath = path.ToLowerInvariant().TrimEnd('/');

            // Public endpoints (matching Java Spring Security configuration)
            var publicPaths = new[]
            {
                "/api/user/register",
                "/api/user/login",
                "/api/admin/register", 
                "/api/admin/login",
                "/api/admin/test",
                "/api/admin/test-password",
                "/api/owner/register",
                "/api/owner/login",
                "/api/maid/register",
                "/api/maid/login",
                "/api/tiffin/register",
                "/api/tiffin/login",
                "/api/tiffin/all",
                "/api/auth/register",
                "/api/auth/login",
                "/api/public",
                "/api/pg/all",
                "/api/pg/region",
                "/api/pgrooms",
                "/api/room-interests",
                "/api/pdf",
                "/api/contactUs",
                "/swagger-ui",
                "/v3/api-docs",
                "/swagger",
                "/api/swagger"
            };

            // Check if the normalized path starts with any of the public paths
            var isPublic = publicPaths.Any(publicPath => 
            {
                var normalizedPublicPath = publicPath.ToLowerInvariant();
                return normalizedPath.StartsWith(normalizedPublicPath) || 
                       normalizedPath.Equals(normalizedPublicPath);
            });

            if (isPublic)
            {
                _logger.LogDebug("Path {Path} is identified as public", path);
            }
            else
            {
                _logger.LogDebug("Path {Path} requires authentication", path);
            }

            return isPublic;
        }
    }
}
