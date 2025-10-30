using System.ComponentModel.DataAnnotations;

namespace PlantNurseryAPI.Model
{
    public class Role
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public List<Account> Accounts { get; } = new List<Account>();
    }
}
