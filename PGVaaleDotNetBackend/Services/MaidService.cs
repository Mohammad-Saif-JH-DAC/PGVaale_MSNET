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
            return await _maidRepository.GetAllMaidsAsync();
        }

        public async Task<Maid?> GetMaidByIdAsync(long id)
        {
            return await _maidRepository.GetMaidByIdAsync(id);
        }

        public async Task<Maid?> GetMaidByUsernameAsync(string username)
        {
            return await _maidRepository.GetMaidByUsernameAsync(username);
        }

        public async Task<Maid?> GetMaidByEmailAsync(string email)
        {
            return await _maidRepository.GetMaidByEmailAsync(email);
        }

        public async Task<List<Maid>> GetApprovedMaidsAsync()
        {
            return await _maidRepository.GetMaidsByApprovedStatusAsync(true);
        }

        public async Task<List<Maid>> GetMaidsByRegionAsync(string region)
        {
            return await _maidRepository.GetMaidsByRegionAndApprovedAsync(region, true);
        }

        public async Task<List<Maid>> GetMaidsByApprovedStatusAsync(bool approved)
        {
            return await _maidRepository.GetMaidsByApprovedStatusAsync(approved);
        }

        public async Task<List<Maid>> GetMaidsByRegionAndApprovedAsync(string region, bool approved)
        {
            return await _maidRepository.GetMaidsByRegionAndApprovedAsync(region, approved);
        }

        public async Task<Maid> SaveMaidAsync(Maid maid)
        {
            return await _maidRepository.SaveMaidAsync(maid);
        }

        public async Task DeleteMaidAsync(long id)
        {
            await _maidRepository.DeleteMaidAsync(id);
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
