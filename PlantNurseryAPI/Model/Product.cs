using System.ComponentModel.DataAnnotations;

namespace PlantNurseryAPI.Model
{
    public class Product
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }
        [Required]
        public float Price { get; set; }
        public byte[]? Image { get; set; }

        public List<Cart_item> Cart_Items { get; } = [];
        public List<Customer> Customers { get; } = [];
    }
}
