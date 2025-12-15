using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.DTO;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ILogger<CartController> _logger;

        public CartController(ILogger<CartController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Get([FromBody] AccountIdClass account, ApplicationContext db)
        {
            //Code for getting all products in cart
            try
            {
                var accountSelect = db.Accounts.FirstOrDefault(x => x.Id == account.AccountId);
                if (accountSelect == null) { _logger.LogWarning("Account not found: " + account.AccountId); return NotFound(); }

                _logger.LogInformation("Starting cart select of: " + account.AccountId);
                var cartList = db.Customers
                .Where(x => x.AccountId == account.AccountId)
                .Join(db.CartItems, cu => cu.Id, ci => ci.CustomerId, (cu, ci) => new
                {
                    ci.CustomerId,
                    ci.ProductId,
                    ci.Count,
                }).Join(db.Products, cui => cui.ProductId, p => p.Id, (cui, p) => new ProductCount 
                { 
                    Id = p.Id, 
                    Title = p.Title, 
                    Description = p.Description,
                    Price = p.Price,
                    Image = p.Image,
                    Count = cui.Count,
                    IsActive = p.IsActive,
                }).ToList();
                _logger.LogInformation("Cart selected: " + account.AccountId);
                return Ok(new { products = cartList });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromBody] AccountIdClass account, ApplicationContext db)
        {
            //Code for deleting product from cart
            try
            {
                _logger.LogInformation("Starting deletion of cart item: " + id + "\n from: " + account.AccountId);
                var customer = db.Customers.FirstOrDefault(x => x.AccountId == account.AccountId);
                if (customer == null) { _logger.LogWarning("Account not found: " + account.AccountId); return NotFound("Customer"); }

                var cartItem = db.CartItems.FirstOrDefault(x => x.ProductId == id && x.CustomerId == customer.Id);
                if (cartItem == null) { _logger.LogWarning("Product not found: " + id); return NotFound("CartItem"); }

                db.CartItems.Remove(cartItem);
                db.SaveChanges();
                _logger.LogInformation("Deleted cart item: " + id + "\n from: " + account.AccountId);
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
