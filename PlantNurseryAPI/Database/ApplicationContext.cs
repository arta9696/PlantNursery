using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Database
{
    public class ApplicationContext: DbContext
    {
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Account> Accounts { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<CartItem> CartItems { get; set; } = null!;
        public DbSet<WaitProduct> WaitProducts { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<Favorite> Favorites { get; set; } = null!;

        public ApplicationContext(DbContextOptions<ApplicationContext> options): base(options)
        {
            Database.EnsureCreated();
        }
    }
}
