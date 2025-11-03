using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

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
        [JsonIgnore]
        public List<CartItem> CartItems { get; } = [];
    }
}
