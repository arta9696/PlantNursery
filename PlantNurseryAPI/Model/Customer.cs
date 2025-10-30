using System.ComponentModel.DataAnnotations.Schema;

namespace PlantNurseryAPI.Model
{
    public class Customer
    {
        public int Id { get; set; }
        [ForeignKey(nameof(Account))]
        public int AccountId { get; set; }
        public string? Full_name { get; set; }
        public string? Address { get; set; }
        public Account Account { get; set; } = null!;

        public List<Cart_item> Cart_Items { get; } = [];
        public List<Product> Products { get; } = [];
    }
}
