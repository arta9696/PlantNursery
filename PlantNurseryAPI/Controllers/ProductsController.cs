using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/[controller]")]
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
                return Ok(db.Products.ToList());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id, ApplicationContext db)
        {
            //Code for getting product by id
            try
            {
                var product = db.Products.FirstOrDefault(x => x.Id == id);
                if (product == null) return NotFound();

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("{id}/add")]
        public IActionResult Add(int id, [FromBody] AccountIdClass account, ApplicationContext db)
        {
            //Code for adding product in cart
            try
            {
                var product = db.Products.FirstOrDefault(x => x.Id == id);
                if (product == null) return NotFound("Product");

                var customer = db.Customers.FirstOrDefault(x => x.AccountId == account.AccountId);
                if (customer == null) return NotFound("Customer");

                db.CartItems.Add(new CartItem() { Product = product, Customer = customer });
                db.SaveChanges();

                return Ok();
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
    }
}
