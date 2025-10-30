using System.ComponentModel.DataAnnotations.Schema;

namespace PlantNurseryAPI.Model
{
    public class Cart_item
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
