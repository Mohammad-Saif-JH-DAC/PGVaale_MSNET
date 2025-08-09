using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace PGVaaleDotNetBackend.Security
{
    public class JwtUtil : IJwtUtil
    {
        // Use the same secret key as JwtService
        private readonly SymmetricSecurityKey SECRET_KEY;
        private readonly ILogger<JwtUtil> _logger;
        private readonly string _issuer;
        private readonly string _audience;

        public JwtUtil(ILogger<JwtUtil> logger, IConfiguration configuration)
        {
            _logger = logger;
            // Use the same secret key as JwtService
            var secretKey = configuration["Jwt:SecretKey"] ?? "your-super-secret-key-with-at-least-32-characters";
            var keyBytes = Encoding.ASCII.GetBytes(secretKey);
            SECRET_KEY = new SymmetricSecurityKey(keyBytes);
            
            // Read issuer and audience from configuration
            _issuer = configuration["Jwt:Issuer"] ?? "PGVaale";
            _audience = configuration["Jwt:Audience"] ?? "PGVaaleUsers";
        }

        public string ExtractUsername(string token)
        {
            try
            {
                var claims = ExtractAllClaims(token);
                if (claims != null)
                {
                    // First try to get from claims (JwtService stores it in ClaimTypes.Name)
                    var nameClaim = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
                    if (!string.IsNullOrEmpty(nameClaim))
                    {
                        return nameClaim;
                    }
                    
                    // Try the full claim type name (what gets serialized in JWT)
                    var fullNameClaim = claims.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;
                    if (!string.IsNullOrEmpty(fullNameClaim))
                    {
                        return fullNameClaim;
                    }
                    
                    // Try unique_name claim (what appears in the JWT)
                    var uniqueNameClaim = claims.Claims.FirstOrDefault(c => c.Type == "unique_name")?.Value;
                    if (!string.IsNullOrEmpty(uniqueNameClaim))
                    {
                        return uniqueNameClaim;
                    }
                    
                    // Try to extract from the raw JWT payload
                    try
                    {
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var jsonToken = tokenHandler.ReadJwtToken(token);
                        var payload = jsonToken.Payload;
                        
                        // Check if unique_name exists in the payload
                        if (payload.ContainsKey("unique_name"))
                        {
                            return payload["unique_name"].ToString();
                        }
                        
                        // Check if name exists in the payload
                        if (payload.ContainsKey("name"))
                        {
                            return payload["name"].ToString();
                        }
                    }
                    catch (Exception payloadEx)
                    {
                        _logger.LogDebug("Could not extract from payload: {Error}", payloadEx.Message);
                    }
                    
                    // Try Subject field (fallback)
                    if (!string.IsNullOrEmpty(claims.Subject))
                    {
                        return claims.Subject;
                    }
                    
                    // Try other possible claim types
                    var subClaim = claims.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                    if (!string.IsNullOrEmpty(subClaim))
                    {
                        return subClaim;
                    }
                    
                    // Try username claim
                    var usernameClaim = claims.Claims.FirstOrDefault(c => c.Type == "username")?.Value;
                    if (!string.IsNullOrEmpty(usernameClaim))
                    {
                        return usernameClaim;
                    }
                }
                return null;
            }
            catch (Exception e)
            {
                _logger.LogError("Error extracting username from token: {Error}", e.Message);
                return null;
            }
        }

        public long? ExtractUserId(string token)
        {
            try
            {
                return ExtractClaim<long?>(token, claims =>
                {
                    // First try to find the user ID in the NameIdentifier claim
                    var nameIdentifierClaim = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                    if (!string.IsNullOrEmpty(nameIdentifierClaim) && long.TryParse(nameIdentifierClaim, out long userId))
                    {
                        return userId;
                    }

                    // Fallback to "userId" claim for backward compatibility
                    var userIdClaim = claims.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
                    if (!string.IsNullOrEmpty(userIdClaim) && long.TryParse(userIdClaim, out long fallbackUserId))
                    {
                        return fallbackUserId;
                    }

                    return null;
                });
            }
            catch (Exception e)
            {
                _logger.LogError("Error extracting user ID from token: {Error}", e.Message);
                return null;
            }
        }

        public DateTime? ExtractExpiration(string token)
        {
            try
            {
                return ExtractClaim(token, claims => claims.ValidTo);
            }
            catch (Exception e)
            {
                _logger.LogError("Error extracting expiration from token: {Error}", e.Message);
                return null;
            }
        }

        public T? ExtractClaim<T>(string token, Func<JwtSecurityToken, T> claimsResolver)
        {
            var claims = ExtractAllClaims(token);
            if (claims != null)
            {
                return claimsResolver(claims);
            }
            return default(T);
        }

        private JwtSecurityToken? ExtractAllClaims(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = SECRET_KEY;

                _logger.LogDebug("Validating token with issuer: {Issuer}, audience: {Audience}", _issuer, _audience);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false, // Match Program.cs configuration
                    ValidateAudience = false, // Match Program.cs configuration
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero // Match JwtService behavior
                };

                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                return (JwtSecurityToken)validatedToken;
            }
            catch (Exception e)
            {
                _logger.LogError("Error parsing JWT: {Error}", e.Message);
                return null;
            }
        }

        private bool IsTokenExpired(string token)
        {
            try
            {
                var expiration = ExtractExpiration(token);
                if (expiration == null)
                {
                    _logger.LogWarning("No expiration found in token");
                    return false; // If no expiration, consider it valid
                }
                
                var isExpired = expiration < DateTime.UtcNow;
                if (isExpired)
                {
                    _logger.LogDebug("Token expired at {Expiration}, current time: {CurrentTime}", expiration, DateTime.UtcNow);
                }
                
                return isExpired;
            }
            catch (Exception e)
            {
                _logger.LogError("Error checking token expiration: {Error}", e.Message);
                return false; // If we can't check expiration, consider it valid
            }
        }

        public string GenerateToken(string username, string role)
        {
            return GenerateToken(username, role, null);
        }

        public string GenerateToken(string username, string role, long? userId)
        {
            var claims = new Dictionary<string, object>();
            if (!string.IsNullOrEmpty(role))
            {
                claims["role"] = role;
            }
            if (userId.HasValue)
            {
                claims["userId"] = userId.Value;
            }
            return CreateToken(claims, username);
        }

        private string CreateToken(Dictionary<string, object> claims, string subject)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = SECRET_KEY;

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, subject) }),
                    Claims = claims,
                    Expires = DateTime.UtcNow.AddHours(24),
                    Issuer = _issuer,
                    Audience = _audience,
                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception e)
            {
                _logger.LogError("Error creating JWT: {Error}", e.Message);
                throw new Exception("Failed to generate JWT token", e);
            }
        }

        public bool ValidateToken(string token)
        {
            try
            {
                var extractedUsername = ExtractUsername(token);
                return !string.IsNullOrEmpty(extractedUsername) && !IsTokenExpired(token);
            }
            catch (Exception e)
            {
                _logger.LogError("Error validating token: {Error}", e.Message);
                return false;
            }
        }

        public bool ValidateToken(string token, string username)
        {
            try
            {
                var extractedUsername = ExtractUsername(token);
                return extractedUsername != null && extractedUsername.Equals(username) && !IsTokenExpired(token);
            }
            catch (Exception e)
            {
                _logger.LogError("Error validating token: {Error}", e.Message);
                return false;
            }
        }
    }
}
