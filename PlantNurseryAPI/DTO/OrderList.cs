using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.DTO
{
    public class OrderList
    {
        public int AccountId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public DateOnly? CreatedDate {  get; set; }
        public string? Title { get; set; }
        public List<OrderItem> Items { get; set; }
    }
}
