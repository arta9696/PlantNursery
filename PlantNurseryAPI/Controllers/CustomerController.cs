using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.Model;
using System.Security.Principal;

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
                db.SaveChanges();
                _logger.LogInformation("Profile updated: " + account.AccountId);

                return Ok(account);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
            
        }
    }
}
