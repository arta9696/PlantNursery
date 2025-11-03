using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlantNurseryAPI.Model
{
    [Index(nameof(CustomerId), nameof(ProductId), IsUnique = true)]
    public class CartItem
    {
        public int Id { get; set; }
        [ForeignKey(nameof(Customer))]
        public int CustomerId { get; set; }
        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }

        public Product Product { get; set; } = null!;
        public Customer Customer { get; set; } = null!;
    }
}
