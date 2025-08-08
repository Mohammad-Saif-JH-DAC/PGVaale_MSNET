using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;

namespace PGVaaleDotNetBackend.Services
{
    public class AdminService
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<List<Admin>> GetAllAdminsAsync()
        {
            return await _adminRepository.GetAllAsync();
        }

        public async Task<Admin?> GetAdminByIdAsync(long id)
        {
            return await _adminRepository.GetByIdAsync(id);
        }

        public async Task<Admin> SaveAdminAsync(Admin admin)
        {
            return await _adminRepository.SaveAsync(admin);
        }

        public async Task DeleteAdminAsync(long id)
        {
            await _adminRepository.DeleteAsync(id);
        }

        public async Task<Admin?> GetAdminByUsernameAsync(string username)
        {
            return await _adminRepository.GetByUsernameAsync(username);
        }

        public async Task<Admin?> GetAdminByEmailAsync(string email)
        {
            return await _adminRepository.GetByEmailAsync(email);
        }
    }
}
