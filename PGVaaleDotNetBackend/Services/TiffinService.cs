using PGVaaleDotNetBackend.Entities;
using System.Collections.Generic;

namespace PGVaaleDotNetBackend.Services
{
    public class TiffinService
    {
        public IEnumerable<Tiffin> GetAllTiffins() => new List<Tiffin>();
        public Tiffin GetTiffinById(int id) => new Tiffin();
    }
}