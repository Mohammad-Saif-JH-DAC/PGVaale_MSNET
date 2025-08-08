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

        // Java: public List<Admin> getAllAdmins()
        public async Task<List<Admin>> GetAllAdminsAsync()
        {
            return await _adminRepository.GetAllAsync();
        }

        // Java: public Optional<Admin> getAdminById(Long id)
        public async Task<Admin?> GetAdminByIdAsync(long id)
        {
            return await _adminRepository.GetByIdAsync(id);
        }

        // Java: public Admin saveAdmin(Admin admin)
        public async Task<Admin> SaveAdminAsync(Admin admin)
        {
            return await _adminRepository.SaveAsync(admin);
        }

        // Java: public void deleteAdmin(Long id)
        public async Task DeleteAdminAsync(long id)
        {
            await _adminRepository.DeleteAsync(id);
        }

        // Additional methods for authentication
        public async Task<Admin?> GetAdminByUsernameAsync(string username)
        {
            return await _adminRepository.FindByUsernameAsync(username);
        }

        public async Task<Admin?> GetAdminByEmailAsync(string email)
        {
            return await _adminRepository.FindByEmailAsync(email);
        }
    }
}
