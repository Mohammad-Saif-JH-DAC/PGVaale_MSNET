using System.IdentityModel.Tokens.Jwt;

namespace PGVaaleDotNetBackend.Security
{
    public interface IJwtUtil
    {
        string? ExtractUsername(string token);
        long? ExtractUserId(string token);
        DateTime? ExtractExpiration(string token);
        T? ExtractClaim<T>(string token, Func<JwtSecurityToken, T> claimsResolver);
        bool ValidateToken(string token);
        bool ValidateToken(string token, string username);
        string GenerateToken(string username, string role);
        string GenerateToken(string username, string role, long? userId);
    }
}
