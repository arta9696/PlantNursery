using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PlantNurseryAPI.Model
{
    public class Customer
    {
        public int Id { get; set; }
        [ForeignKey(nameof(Account))]
        public int AccountId { get; set; }
        public string? FullName { get; set; }
        public string? Address { get; set; }
        [JsonIgnore]
        public Account Account { get; set; } = null!;
        [JsonIgnore]
        public List<CartItem> CartItems { get; } = [];
    }
}
