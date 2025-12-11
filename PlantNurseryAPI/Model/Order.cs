using System.ComponentModel.DataAnnotations.Schema;

namespace PlantNurseryAPI.Model
{
    public class Order
    {
        public int Id { get; set; }
        public string Title { get; set; }
        [ForeignKey(nameof(Customer))]
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public DateOnly CreationDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
        public string FullName { get; set; }
        public string Address { get; set; }
    }
}
