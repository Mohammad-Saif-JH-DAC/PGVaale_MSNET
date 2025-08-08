using Microsoft.AspNetCore.Identity;
using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;
using System.Security.Claims;

namespace PGVaaleDotNetBackend.Security
{
    public class CustomUserDetailsService : IUserDetailsService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAdminRepository _adminRepository;
        private readonly IOwnerRepository _ownerRepository;
        private readonly IMaidRepository _maidRepository;
        private readonly ITiffinRepository _tiffinRepository;

        public CustomUserDetailsService(
            IUserRepository userRepository,
            IAdminRepository adminRepository,
            IOwnerRepository ownerRepository,
            IMaidRepository maidRepository,
            ITiffinRepository tiffinRepository)
        {
            _userRepository = userRepository;
            _adminRepository = adminRepository;
            _ownerRepository = ownerRepository;
            _maidRepository = maidRepository;
            _tiffinRepository = tiffinRepository;
        }

        public async Task<UserDetails> LoadUserByUsernameAsync(string username)
        {
            // Try to find user in each repository
            var user = await _userRepository.FindByUsernameAsync(username);
            if (user != null)
            {
                return CreateUserDetails(user, "ROLE_USER");
            }

            var admin = await _adminRepository.GetByUsernameAsync(username);
            if (admin != null)
            {
                return CreateUserDetails(admin, "ROLE_ADMIN");
            }

            var owner = await _ownerRepository.FindByUsernameAsync(username);
            if (owner != null)
            {
                return CreateUserDetails(owner, "ROLE_OWNER");
            }

            var maid = await _maidRepository.FindByUsernameAsync(username);
            if (maid != null)
            {
                return CreateUserDetails(maid, "ROLE_MAID");
            }

            var tiffin = await _tiffinRepository.FindByUsernameAsync(username);
            if (tiffin != null)
            {
                return CreateUserDetails(tiffin, "ROLE_TIFFIN");
            }

            throw new UsernameNotFoundException($"User not found: {username}");
        }

        private UserDetails CreateUserDetails(BaseEntity entity, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, entity.Username),
                new Claim(ClaimTypes.Role, role),
                new Claim("UserId", entity.Id.ToString())
            };

            var identity = new ClaimsIdentity(claims, "Custom");
            var principal = new ClaimsPrincipal(identity);

            return new CustomUserDetails
            {
                Username = entity.Username,
                Password = entity.Password,
                Role = role,
                UserId = entity.Id,
                IsEnabled = true,
                ClaimsPrincipal = principal
            };
        }
    }

    public class CustomUserDetails : UserDetails
    {
        public override string Username { get; set; } = string.Empty;
        public override string Password { get; set; } = string.Empty;
        public override bool IsEnabled { get; set; }
        public string Role { get; set; } = string.Empty;
        public long UserId { get; set; }
        public ClaimsPrincipal ClaimsPrincipal { get; set; } = null!;
    }

    public class UsernameNotFoundException : Exception
    {
        public UsernameNotFoundException(string message) : base(message)
        {
        }
    }
}
