using PGVaaleDotNetBackend.Entities;
using System.Collections.Generic;

namespace PGVaaleDotNetBackend.Services
{
    public class UserService
    {
        public IEnumerable<User> GetAllUsers() => new List<User>();
        public User GetUserById(int id) => new User();
    }
}