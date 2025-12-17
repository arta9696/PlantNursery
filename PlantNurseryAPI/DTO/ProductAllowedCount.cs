using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.DTO
{
    public class ProductAllowedCount: Product
    {
        public int AllowedCount { get; set; }
        public ProductAllowedCount()
        {
        }
        public ProductAllowedCount(Product product, int alowedCount)
        {
            Id = product.Id;
            Title = product.Title;
            Price = product.Price;
            Description = product.Description;
            Image = product.Image;
            IsActive = product.IsActive;
            IsDeleted = product.IsDeleted;
            AllowedCount = alowedCount;
        }
    }
}
