using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/[controller]")]
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
                var cartList = db.Customers
                .Where(x => x.AccountId == account.AccountId)
                .Join(db.CartItems, cu => cu.Id, ci => ci.CustomerId, (cu, ci) => new
                {
                    ci.CustomerId,
                    ci.ProductId
                }).Join(db.Products, cui => cui.ProductId, p => p.Id, (cui, p) => p).ToList();

                return Ok(cartList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromBody] AccountIdClass account, ApplicationContext db)
        {
            //Code for deleting product from cart
            try
            {
                var customer = db.Customers.FirstOrDefault(x => x.AccountId == account.AccountId);
                if (customer == null) return NotFound("Customer");

                var cartItem = db.CartItems.FirstOrDefault(x => x.ProductId == id && x.CustomerId == customer.Id);
                if (cartItem == null) return NotFound("CartItem");

                db.CartItems.Remove(cartItem);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}
