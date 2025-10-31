using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult Get([FromBody] AccountIdClass account)
        {
            //Code for getting account data
            return Ok(new AccountPutClass() { AccountId = 0, Address = "Pushkina", Email = "a@b.ru", FullName = "Ivan I.I.", Password="abcde"});
        }

        [HttpPut]
        public IActionResult Put([FromBody] AccountPutClass account)
        {
            //Code for updating account data
            return Ok(account);
        }
    }
}
