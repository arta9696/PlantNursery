using System.ComponentModel.DataAnnotations.Schema;

namespace PlantNurseryAPI.Model
{
    public class OrderItem
    {
        public int Id { get; set; }
        [ForeignKey(nameof(Order))]
        public int? OrderId { get; set; }
        public Order? Order { get; set; }
        [ForeignKey(nameof(Product))]
        public int? ProductId { get; set; }
        public Product? Product { get; set; }
        public int Count { get; set; }
        public float PriceAtMoment { get; set; }
    }
}
