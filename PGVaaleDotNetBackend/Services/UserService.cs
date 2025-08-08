using PGVaaleDotNetBackend.Entities;
using PGVaaleDotNetBackend.Repositories;
using System.Collections.Generic;

namespace PGVaaleDotNetBackend.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _userRepository.GetAll();
        }

        public User? GetUserById(int id)
        {
            return _userRepository.GetById(id);
        }

        public User? GetUserByUsername(string username)
        {
            return _userRepository.GetByUsername(username);
        }

        public User? GetUserByEmail(string email)
        {
            return _userRepository.GetByEmail(email);
        }

        public User SaveUser(User user)
        {
            if (user.Id == 0)
            {
                _userRepository.Add(user);
            }
            else
            {
                _userRepository.Update(user);
            }
            return user;
        }

        public void DeleteUser(int id)
        {
            _userRepository.Delete(id);
        }
    }
}