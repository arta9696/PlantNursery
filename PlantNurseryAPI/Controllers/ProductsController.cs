using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.DTO;
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

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, ApplicationContext db)
        {
            try
            {
                var prod = db.Products.FirstOrDefault(x => x.Id == id);
                if (prod == null) { _logger.LogWarning("Product not found: " + id); return NotFound(); }
                prod.IsDeleted = true;
                db.Products.Update(prod);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("{id}/add")]
        public IActionResult Add(int id, [FromBody] AccountCountClass account, ApplicationContext db) //TODO узнать про "не более 10 товаров за раз"
        {
            //Code for adding product in cart
            try
            {
                _logger.LogInformation("Starting products add of: " + id + "\nto: " + account.AccountId);
                var product = db.Products.FirstOrDefault(x => x.Id == id);
                if (product == null) { _logger.LogWarning("Product not found: " + id); return NotFound("Product"); }

                var customer = db.Customers.FirstOrDefault(x => x.AccountId == account.AccountId);
                if (customer == null) { _logger.LogWarning("Account not found: " + account.AccountId); return NotFound("Customer"); }

                db.CartItems.Add(new CartItem() { Product = product, Customer = customer, Count = account.Count });
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

        [HttpPost("add")]
        public IActionResult Add([FromBody] Product product, ApplicationContext db)
        {
            try
            {
                db.Products.Add(product);
                db.SaveChanges();
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

        [HttpPut("{id}/update")]
        public IActionResult Update(int id, [FromBody] Product product, ApplicationContext db)
        {
            try
            {
                db.Products.Update(product);
                db.SaveChanges();
                return Ok();
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

        [HttpPost("{id}/wait")]
        public IActionResult Wait(int id, [FromBody] AccountIdClass AccountId, ApplicationContext db)
        {
            return StatusCode(500); //TODO какое поведение если кнопка уже была нажата?
        }

        [HttpPost("{id}/favorite")]
        public IActionResult AddFavorite(int id, [FromBody] AccountIdClass AccountId, ApplicationContext db)
        {
            try
            {
                var account = db.Accounts.FirstOrDefault(x => x.Id == AccountId.AccountId);
                if (account == null) { _logger.LogWarning("Account not found: " + AccountId.AccountId); return NotFound("Account"); }
                var customer = db.Customers.First(x => x.AccountId == AccountId.AccountId);

                var product = db.Products.FirstOrDefault(x => x.Id == id);
                if (product == null) { _logger.LogWarning("Product not found: " + id); return NotFound("Product"); }

                db.Favorites.Add(new Favorite() { CustomerId = customer.Id, ProductId = id });
                db.SaveChanges();
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

        [HttpDelete("{id}/favorite")]
        public IActionResult DeleteFavorite(int id, [FromBody] AccountIdClass AccountId, ApplicationContext db)
        {
            try
            {
                var account = db.Accounts.FirstOrDefault(x => x.Id == AccountId.AccountId);
                if (account == null) { _logger.LogWarning("Account not found: " + AccountId.AccountId); return NotFound("Account"); }
                var customer = db.Customers.First(x => x.AccountId == AccountId.AccountId);

                var product = db.Products.FirstOrDefault(x => x.Id == id);
                if (product == null) { _logger.LogWarning("Product not found: " + id); return NotFound("Product"); }

                var favorite = db.Favorites.FirstOrDefault(x => x.CustomerId == customer.Id && x.ProductId == id);
                if (favorite == null) { _logger.LogWarning("Favorite not found"); return NotFound("Favorite"); }

                db.Favorites.Remove(favorite);

                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }


    }
}
