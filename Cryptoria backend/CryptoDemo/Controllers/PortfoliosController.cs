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
    [Route("api/portfolios")]
    [ApiController]
    public class PortfoliosController : ControllerBase
    {
        private readonly CryptoDemoContext _context;

        public PortfoliosController(CryptoDemoContext context)
        {
            _context = context;
        }

        // GET: api/Portfolios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Portfolio>>> GetPortfolio()
        {                     
            // Við viljum alltaf fá allar transactions svo Include() er bætt við 
            return await _context.Portfolio.Include(x => x.Transactions).ToListAsync();
            
        }


     

        // GET: api/Portfolios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Portfolio>> GetPortfolio(int id)
        {
            var portfolio = await _context.Portfolio.FindAsync(id);

            if (portfolio == null)
            {
                return NotFound();
            }

            return portfolio;
        }

        // PUT: api/Portfolios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPortfolio(int id, Portfolio portfolio)
        {
            if (id != portfolio.Id)
            {
                return BadRequest();
            }

            _context.Entry(portfolio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PortfolioExists(id))
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

        // POST: api/Portfolios
        [HttpPost]
        public async Task<ActionResult<Portfolio>> PostPortfolio(Portfolio portfolio)
        {
            _context.Portfolio.Add(portfolio);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPortfolio", new { id = portfolio.Id }, portfolio);
        }

        // DELETE: api/Portfolios/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Portfolio>> DeletePortfolio(int id)
        {
            var portfolio = await _context.Portfolio.FindAsync(id);
            if (portfolio == null)
            {
                return NotFound();
            }

            _context.Portfolio.Remove(portfolio);
            await _context.SaveChangesAsync();

            return portfolio;
        }

        private bool PortfolioExists(int id)
        {
            return _context.Portfolio.Any(e => e.Id == id);
        }
    }
}
