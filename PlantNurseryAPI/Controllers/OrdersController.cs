using CSharpVitamins;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.DTO;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<AccountController> _logger;

        public OrdersController(ILogger<AccountController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Get([FromBody] AccountIdClass AccountId, ApplicationContext db)
        {
            try
            {
                var account = db.Accounts.FirstOrDefault(x => x.Id == AccountId.AccountId);
                if (account == null) { _logger.LogWarning("Account not found: " + AccountId.AccountId); return NotFound(); }
                var customer = db.Customers.First(x => x.AccountId == AccountId.AccountId);

                var allOrders = db.Orders.Where(x => x.CustomerId == customer.Id).ToList();
                var orders = new List<OrderList>();
                foreach (var order in allOrders)
                {
                    var itemList = db.OrderItems
                    .Where(x => x.OrderId == order.Id)
                    .Join(db.Products, oi => oi.ProductId, p => p.Id, (oi, p) => new OrderItemTitle()
                    {
                        Id = oi.Id,
                        OrderId = oi.OrderId,
                        ProductId = oi.ProductId,
                        Count = oi.Count,
                        PriceAtMoment = oi.PriceAtMoment,
                        Title = p.Title,
                    }).ToList();
                    orders.Add(new OrderList()
                    {
                        AccountId = account.Id,
                        FullName = order.FullName,
                        Address = order.Address,
                        Items = [.. itemList]
                    });
                }
                return Ok(new { orders });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("add")]
        public IActionResult Add([FromBody] OrderList orderList, ApplicationContext db)
        {
            try
            {
                var account = db.Accounts.FirstOrDefault(x => x.Id == orderList.AccountId);
                if (account == null) { _logger.LogWarning("Account not found: " + orderList.AccountId); return NotFound(); }
                var customer = db.Customers.First(x => x.AccountId == orderList.AccountId);

                var order = new Order()
                {
                    Title = "ЧЗ-"+ShortGuid.NewGuid(),
                    CustomerId = customer.Id,
                    FullName = orderList.FullName,
                    Address = orderList.Address,
                };
                db.Orders.Add(order);
                db.SaveChanges();
                order = db.Orders.First(x => x.Title == order.Title);

                foreach(var item in orderList.Items)
                {
                    item.OrderId = order.Id;
                    db.OrderItems.Add(item);
                }
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
    }
}
