using PGVaaleDotNetBackend.Entities;
using System.Collections.Generic;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IUserRepository
    {
        IEnumerable<User> GetAll();
        User? GetById(long id);
        User? GetByUsername(string username);
        User? GetByEmail(string email);
        void Add(User user);
        void Update(User user);
        void Delete(long id);
        Task<User?> GetUserByIdAsync(long id);
    }
}