using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CryptoDemo.Models;

namespace CryptoDemo.Data
{
    public class CryptoDemoContext : DbContext
    {
        public CryptoDemoContext (DbContextOptions<CryptoDemoContext> options)
            : base(options)
        {
        }

        public DbSet<CryptoDemo.Models.Transaction> Transaction { get; set; }

        public DbSet<CryptoDemo.Models.Portfolio> Portfolio { get; set; }
    }
}
