using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ILogger<CustomerController> _logger;

        public CustomerController(ILogger<CustomerController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Get([FromBody] AccountIdClass AccountId, ApplicationContext db)
        {
            //Code for getting account data
            try
            {
                var accountSelect = db.Accounts.Where(x => x.Id == AccountId.AccountId).FirstOrDefault();
                if (accountSelect == null) return NotFound();

                var customer = db.Customers.Where(x => x.AccountId == AccountId.AccountId).First();

                return Ok(new AccountPutClass()
                { AccountId = AccountId.AccountId, Address = customer.Address ?? "", Email = accountSelect.Email, FullName = customer.FullName ?? "", Password = accountSelect.Password });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
            
        }

        [HttpPut]
        public IActionResult Put([FromBody] AccountPutClass account, ApplicationContext db)
        {
            //Code for updating account data
            try
            {
                var accountSelect = db.Accounts.Where(x => x.Id == account.AccountId).FirstOrDefault();
                if (accountSelect == null) return NotFound();

                var customer = db.Customers.Where(x => x.AccountId == account.AccountId).First();
                customer.FullName = account.FullName;
                customer.Address = account.Address;
                db.Customers.Update(customer);

                db.SaveChanges();

                return Ok(account);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
            
        }
    }
}
