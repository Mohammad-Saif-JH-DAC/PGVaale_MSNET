using PGVaaleDotNetBackend.Entities;
using System.Collections.Generic;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IUserMaidRepository
    {
        IEnumerable<UserMaid> GetAll();
        UserMaid GetById(int id);
        void Add(UserMaid userMaid);
        void Update(UserMaid userMaid);
        void Delete(int id);
    }
}