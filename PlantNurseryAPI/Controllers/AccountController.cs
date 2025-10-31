using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult Register([FromBody] AccountNew account)
        {
            //code for registration
            return Created();
        }

        [HttpPost("auth")]
        public IActionResult Auth([FromBody] AccountNew account)
        {
            //Code for checking account
            return Ok(new AccountIdClass() { AccountId = 0, Role = "Manager"});
        }
    }
}
