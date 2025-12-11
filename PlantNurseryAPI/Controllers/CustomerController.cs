using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.DTO;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ILogger<CustomerController> _logger;

        public CustomerController(ILogger<CustomerController> logger)
        {
            _logger = logger;
        }

        [HttpPost("profile")]
        public IActionResult Get([FromBody] AccountIdClass AccountId, ApplicationContext db)
        {
            //Code for getting account data
            try
            {
                _logger.LogInformation("Starting profile select of: " + AccountId.AccountId);
                var accountSelect = db.Accounts.FirstOrDefault(x => x.Id == AccountId.AccountId);
                if (accountSelect == null) { _logger.LogWarning("Account not found: " + AccountId.AccountId); return NotFound(); }

                var customer = db.Customers.First(x => x.AccountId == AccountId.AccountId);
                _logger.LogInformation("Profile selected: " + AccountId.AccountId);
                return Ok(new AccountPutClass()
                { AccountId = AccountId.AccountId, Address = customer.Address ?? "", Email = accountSelect.Email, FullName = customer.FullName ?? "", Password = accountSelect.Password });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
            
        }

        [HttpPut("profile")]
        public IActionResult Put([FromBody] AccountPutClass account, ApplicationContext db)
        {
            //Code for updating account data
            try
            {
                _logger.LogInformation("Starting profile update of: " + account.AccountId);
                var accountSelect = db.Accounts.FirstOrDefault(x => x.Id == account.AccountId);
                if (accountSelect == null) { _logger.LogWarning("Account not found: " + account.AccountId); return NotFound(); }

                var customer = db.Customers.First(x => x.AccountId == account.AccountId);
                customer.FullName = account.FullName;
                customer.Address = account.Address;
                db.Customers.Update(customer);
                var newAccountData = db.Accounts.First(x => x.Id == account.AccountId);
                newAccountData.Email = account.Email;
                newAccountData.Password = account.Password;
                db.Accounts.Update(newAccountData);
                db.SaveChanges();
                _logger.LogInformation("Profile updated: " + account.AccountId);

                return Ok(account);
            } 
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("favorites")]
        public IActionResult Favorites([FromBody] AccountIdClass AccountId, ApplicationContext db)
        {
            try
            {
                var account = db.Accounts.FirstOrDefault(x => x.Id == AccountId.AccountId);
                if (account == null) { _logger.LogWarning("Account not found: " + AccountId.AccountId); return NotFound("Account"); }
                var customer = db.Customers.First(x => x.AccountId == AccountId.AccountId);

                var products = db.Favorites
                    .Where(x => x.CustomerId == customer.Id)
                    .Join(db.Products, f => f.ProductId, p => p.Id, (f, p) => p).ToList();

                return Ok(new { products });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
    }
}
