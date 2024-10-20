using System;
using Microsoft.EntityFrameworkCore;
using Contatos.Models;

namespace Contatos.Data;

public class AppDataContext : DbContext
{
    public DbSet<Agenda> Agendas { get; set; }
    public DbSet<Contato> Contatos { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=sistema_contatos.db");
    }
}
