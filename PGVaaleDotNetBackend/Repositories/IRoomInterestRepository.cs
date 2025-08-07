using PGVaaleDotNetBackend.Entities;
using System.Collections.Generic;

namespace PGVaaleDotNetBackend.Repositories
{
    public interface IRoomInterestRepository
    {
        IEnumerable<RoomInterest> GetAll();
        RoomInterest GetById(int id);
        void Add(RoomInterest roomInterest);
        void Update(RoomInterest roomInterest);
        void Delete(int id);
    }
}