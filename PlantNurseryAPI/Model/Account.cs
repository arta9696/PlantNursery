using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlantNurseryAPI.Model
{
    public class Account
    {
        public int Id { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [ForeignKey(nameof(Role))]
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        public Customer? Customer { get; set; }
    }
}
