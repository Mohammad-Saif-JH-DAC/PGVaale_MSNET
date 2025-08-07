using PGVaaleDotNetBackend.Entities;
using System.Collections.Generic;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IMaidRepository
    {
        IEnumerable<Maid> GetAll();
        Maid GetById(int id);
        void Add(Maid maid);
        void Update(Maid maid);
        void Delete(int id);
    }
}