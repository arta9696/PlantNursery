using Microsoft.EntityFrameworkCore;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Database
{
    public class ApplicationContext: DbContext
    {
        DbSet<Role> Roles { get; set; } = null!;
        DbSet<Account> Accounts { get; set; } = null!;
        DbSet<Customer> Customers { get; set; } = null!;
        DbSet<Product> Products { get; set; } = null!;
        DbSet<Cart_item> CartItems { get; set; } = null!;

        public ApplicationContext(DbContextOptions<ApplicationContext> options): base(options)
        {
            Database.EnsureCreated();
        }
    }
}
