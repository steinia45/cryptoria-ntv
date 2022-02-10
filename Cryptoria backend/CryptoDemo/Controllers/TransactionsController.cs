using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CryptoDemo.Data;
using CryptoDemo.Models;

namespace CryptoDemo.Controllers
{
    [Route("api/transactions")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly CryptoDemoContext _context;

        public TransactionsController(CryptoDemoContext context)
        {
            _context = context;
        }

        // GET: api/Transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransaction()
        {
            return await _context.Transaction.ToListAsync();
        }

        // GET: Ná í n síðustu færslur
        [HttpGet("historical/{n}")]
        public async Task<ActionResult<IEnumerable<Object>>> GetHistoricalTransactions(int n)
        {
            var historicalTransactions = await _context.Transaction
                .OrderByDescending(i => i.Id)
                .Take(n)
                .ToListAsync();
            return historicalTransactions;
        }

        // GET: transactions eftir id á þeim
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transaction.FindAsync(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return transaction;
        }

        // Fáum aggregated sum á gjaldmiðla per portfolioId (pId)
        [HttpGet("pretty/{pId}")]
        public async Task<ActionResult<IEnumerable<Object>>> GetTransactionPerPortfolio(int pId)
        {
            var theTransactions = await _context.Transaction
                .Where(x => x.PortfolioId == pId)
                .GroupBy(c => c.CryptoSymbol)
                .Select(Group => new
                {
                    Token = Group.Key,
                    TotalValueInTokens = Group.Sum(t => t.CryptoValue)
                }
                // Þetta er hér svo að við renderum ekki tómar færslur í frontend ef að notandi hefur selt 100% af tokeninu
                ).Where(t => t.TotalValueInTokens != 0)
                .ToListAsync();
                
 
            if (theTransactions == null)
            {
                return NotFound();
            }
            //return JsonResult(new { Data = model }, JsonRequestBehavior.AllowGet);
            return theTransactions;
        }
    

        // PUT: api/Transactions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
        {
            if (id != transaction.Id)
            {
                return BadRequest();
            }

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Transactions
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            _context.Transaction.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransaction", new { id = transaction.Id }, transaction);
        }

        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Transaction>> DeleteTransaction(int id)
        {
            var transaction = await _context.Transaction.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transaction.Remove(transaction);
            await _context.SaveChangesAsync();

            return transaction;
        }

        private bool TransactionExists(int id)
        {
            return _context.Transaction.Any(e => e.Id == id);
        }
    }
}
