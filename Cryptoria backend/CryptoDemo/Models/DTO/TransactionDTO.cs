using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CryptoDemo.Models
{
    public class TransactionDTO
    {
        public int Id { get; set; }        
        public string TypeOfTransaction { get; set; }    
        public string CryptoSymbol { get; set; }
        public float CryptoValue { get; set; }

        // FK
        public int PortfolioId { get; set; }
    }
}
