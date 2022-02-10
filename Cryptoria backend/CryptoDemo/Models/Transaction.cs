using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CryptoDemo.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        [Required]
        public string TypeOfTransaction { get; set; }
        [Required]
        public string CryptoSymbol { get; set; }
        [Required]
        public float CryptoValue { get; set; }
        [Required]
        public float DollarBuyAmount { get; set; }
        [Required]
        public float ExchangeRate { get; set; }
        public string Date { get; set; }
        // FK
        public int PortfolioId { get; set; }
        
       
    }
}
