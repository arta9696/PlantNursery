using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/[controller]")]
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
                db.Accounts.Add(new Account()
                { Email = account.Email, Password = account.Password, Role = db.Roles.Where(x => x.Name == "Customer").First() });
                db.SaveChanges();

                db.Customers.Add(new Customer()
                { Account = db.Accounts.Where(x => x.Email == account.Email && x.Password == account.Password).First() });
                db.SaveChanges();

                return StatusCode(201);
            }
            catch (DbUpdateException ex)
            {
                return Conflict();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("auth")]
        public IActionResult Auth([FromBody] AccountNew account, ApplicationContext db)
        {
            //Code for checking account
            try
            {
                var authAccount = db.Accounts.Where(x=>x.Email==account.Email&&x.Password==account.Password).FirstOrDefault();
                if (authAccount==null) return NotFound();

                return Ok(new AccountIdClass() { AccountId = authAccount.Id, Role = db.Roles.Where(x=>x.Id == authAccount.RoleId).First().Name });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}
