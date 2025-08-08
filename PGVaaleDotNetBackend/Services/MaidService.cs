using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;

namespace PGVaaleDotNetBackend.Services
{
    public class MaidService
    {
        private readonly IMaidRepository _maidRepository;

        public MaidService(IMaidRepository maidRepository)
        {
            _maidRepository = maidRepository;
        }

        public async Task<List<Maid>> GetAllMaidsAsync()
        {
            return await _maidRepository.GetAllAsync();
        }

        public async Task<Maid?> GetMaidByIdAsync(long id)
        {
            return await _maidRepository.GetByIdAsync(id);
        }

        public async Task<Maid?> GetMaidByUsernameAsync(string username)
        {
            return await _maidRepository.FindByUsernameAsync(username);
        }

        public async Task<Maid?> GetMaidByEmailAsync(string email)
        {
            return await _maidRepository.FindByEmailAsync(email);
        }

        public async Task<List<Maid>> GetApprovedMaidsAsync()
        {
            return await _maidRepository.FindByApprovedTrueAsync();
        }

        public async Task<List<Maid>> GetMaidsByRegionAsync(string region)
        {
            return await _maidRepository.FindByRegionAndApprovedTrueAsync(region);
        }

        public async Task<List<Maid>> GetMaidsByApprovedStatusAsync(bool approved)
        {
            if (approved)
                return await _maidRepository.FindByApprovedTrueAsync();
            else
                return await _maidRepository.FindByApprovedFalseAsync();
        }

        public async Task<List<Maid>> GetMaidsByRegionAndApprovedAsync(string region, bool approved)
        {
            if (approved)
                return await _maidRepository.FindByRegionAndApprovedTrueAsync(region);
            else
                return new List<Maid>(); // No method for region + not approved
        }

        public async Task<Maid> SaveMaidAsync(Maid maid)
        {
            return await _maidRepository.SaveAsync(maid);
        }

        public async Task DeleteMaidAsync(long id)
        {
            await _maidRepository.DeleteAsync(id);
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
