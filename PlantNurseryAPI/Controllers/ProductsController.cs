using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get(ApplicationContext db)
        {
            //Code for getting all products
            try
            {
                _logger.LogInformation("Starting products select");
                var products = db.Products.ToList();
                _logger.LogInformation("Products selected");
                return Ok(new { products });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id, ApplicationContext db)
        {
            //Code for getting product by id
            try
            {
                _logger.LogInformation("Starting products select of: " + id);
                var product = db.Products.FirstOrDefault(x => x.Id == id);
                if (product == null) { _logger.LogWarning("Product not found: " + id); return NotFound(); }
                _logger.LogInformation("Product selected: " + id);
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("{id}/add")]
        public IActionResult Add(int id, [FromBody] AccountIdClass account, ApplicationContext db)
        {
            //Code for adding product in cart
            try
            {
                _logger.LogInformation("Starting products add of: " + id + "\nto: " + account.AccountId);
                var product = db.Products.FirstOrDefault(x => x.Id == id);
                if (product == null) { _logger.LogWarning("Product not found: " + id); return NotFound("Product"); }

                var customer = db.Customers.FirstOrDefault(x => x.AccountId == account.AccountId);
                if (customer == null) { _logger.LogWarning("Account not found: " + account.AccountId); return NotFound("Customer"); }

                db.CartItems.Add(new CartItem() { Product = product, Customer = customer });
                db.SaveChanges();
                _logger.LogInformation("Product added: " + id + "\nto: " + account.AccountId);

                return Ok();
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
    }
}
