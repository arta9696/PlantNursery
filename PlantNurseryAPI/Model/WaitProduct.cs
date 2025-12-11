using System.ComponentModel.DataAnnotations.Schema;

namespace PlantNurseryAPI.Model
{
    public class WaitProduct
    {
        public int Id { get; set; }
        [ForeignKey(nameof(Customer))]
        public int CustomerId { get; set; }
        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }

        public Customer Customer { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}
