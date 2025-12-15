using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.DTO;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ILogger<AccountController> _logger;

        public AccountController(ILogger<AccountController> logger)
        {
            _logger = logger;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] AccountNew account, ApplicationContext db)
        {
            //code for registration
            try
            {
                _logger.LogInformation("Starting registration of: " + account.Email);
                db.Accounts.Add(new Account()
                { Email = account.Email, Password = account.Password, Role = db.Roles.Where(x => x.Name == "Customer").First() });
                db.SaveChanges();
                _logger.LogInformation("Account created: " + account.Email);

                db.Customers.Add(new Customer()
                { Account = db.Accounts.Where(x => x.Email == account.Email && x.Password == account.Password).First() });
                db.SaveChanges();
                _logger.LogInformation("Customer created: " + account.Email);

                return StatusCode(201);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex.Message);
                return Conflict();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("auth")]
        public async Task<IActionResult> Auth([FromBody] AccountNew account, ApplicationContext db)
        {
            //Code for checking account
            try
            {
                _logger.LogInformation("Starting auth of: " + account.Email);
                var authAccount = db.Accounts.FirstOrDefault(x => x.Email == account.Email);
                if (authAccount == null) { _logger.LogWarning("Account not found: " + account.Email); return NotFound(); }
                if (authAccount.Password != account.Password) { _logger.LogWarning("Account password wrong: " + account.Email); return Unauthorized(); }
                _logger.LogInformation("Authorized: " + account.Email);

                var customer = db.Customers.FirstOrDefault(x => x.AccountId == authAccount.Id);
                var waitedProducts = db.WaitProducts
                    .Where(x => x.CustomerId == customer.Id && x.IsNotified == false)
                    .Join(db.Products, x => x.ProductId, p => p.Id, (x, p) => p)
                    .ToList();
                 await db.WaitProducts.Where(x => x.CustomerId == customer.Id && x.IsNotified == false).ForEachAsync(x => { x.IsNotified = true; });
                db.SaveChanges();

                return Ok(new 
                { 
                    AccountId = authAccount.Id, 
                    Role = db.Roles.First(x => x.Id == authAccount.RoleId).Name,
                    waitProducts = new List<Product>(waitedProducts)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
    }
}
