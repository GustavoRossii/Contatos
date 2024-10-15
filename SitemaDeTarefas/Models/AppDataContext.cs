using Microsoft.EntityFrameworkCore;

namespace SitemaDeTarefas.Models;

public class AppDataContext : DbContext
{
    public DbSet<Agenda> Agendas {get; set;}
    public DbSet<Contato> Contatos {get; set;}
    public DbSet<Usuario> Usuarios {get; set;}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=SistemaDeContatos.db");
    }
}
