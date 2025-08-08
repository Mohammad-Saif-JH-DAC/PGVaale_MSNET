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
        // ✅ Secure 256-bit base64 encoded key (DO NOT expose in production)
        private static readonly string SECRET_STRING = "Wv3mRZ+bc5P69ZUI/epDWrKhfNRti/fvEbhN0v2NMWs=";
        
        // Decode the key and create SecretKey
        private readonly SymmetricSecurityKey SECRET_KEY;
        private readonly long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours
        private readonly ILogger<JwtUtil> _logger;

        public JwtUtil(ILogger<JwtUtil> logger)
        {
            _logger = logger;
            var keyBytes = Convert.FromBase64String(SECRET_STRING);
            SECRET_KEY = new SymmetricSecurityKey(keyBytes);
        }

        public string ExtractUsername(string token)
        {
            try
            {
                return ExtractClaim(token, claims => claims.Subject);
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
                return ExtractClaim(token, claims =>
                {
                    if (claims.TryGetValue("userId", out var userIdObj))
                    {
                        if (userIdObj is JsonElement element)
                        {
                            if (element.ValueKind == JsonValueKind.Number)
                            {
                                return element.GetInt64();
                            }
                        }
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
                return ExtractClaim(token, claims => claims.Expiration);
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

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

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
            var expiration = ExtractExpiration(token);
            return expiration == null || expiration < DateTime.UtcNow;
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
                    Expires = DateTime.UtcNow.AddMilliseconds(EXPIRATION_TIME),
                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
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
