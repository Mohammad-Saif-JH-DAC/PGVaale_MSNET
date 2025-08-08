using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;

namespace PGVaaleDotNetBackend.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User?> GetUserByIdAsync(long id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _userRepository.FindByUsernameAsync(username);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.FindByEmailAsync(email);
        }

        public async Task<User> SaveUserAsync(User user)
        {
            return await _userRepository.SaveAsync(user);
        }

        public async Task DeleteUserAsync(long id)
        {
            await _userRepository.DeleteAsync(id);
        }
    }
}