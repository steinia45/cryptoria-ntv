using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CryptoDemo.Models
{
    public class Portfolio
    {
        public int Id { get; set; }
        public string PortfolioName { get; set; }
        public float PortfolioValue { get; set; }
        public float DollarAmount { get; set; }

        // Nav prop
        public List<Transaction> Transactions { get; set; }
    }
}
