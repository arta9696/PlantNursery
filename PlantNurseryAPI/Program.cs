
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using PlantNurseryAPI.Database;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var AnyPolicy = "_AnyPolicy";
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<ApplicationContext>((serviceProvider, options) =>
            {
                var env = serviceProvider.GetRequiredService<IWebHostEnvironment>();
                var configuration = serviceProvider.GetRequiredService<IConfiguration>();

                if (env.IsDevelopment())
                {
                    options.UseNpgsql(configuration.GetConnectionString("DebugConnection"));
                }
                else
                {
                    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
                }
            });
            builder.Logging.AddConsole();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: AnyPolicy,
                                  policy =>
                                  {
                                      policy.AllowAnyOrigin()
                                      .AllowAnyHeader()
                                      .AllowAnyMethod();
                                  });
            });


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                //app.UseSwagger();
                //app.UseSwaggerUI();

                using var scope = app.Services.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
                dbContext.Database.Migrate();

                dbContext.Roles.Add(new Role() { Name = "Manager" });
                dbContext.Roles.Add(new Role() { Name = "Customer" });

                dbContext.SaveChanges();
            }

            app.UseCors(AnyPolicy);

            app.UseHttpsRedirection();
            //app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
