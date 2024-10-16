using System;
using Microsoft.EntityFrameworkCore;
using Contatos.Models;

namespace Contatos.Data;

public class ContatoContext : DbContext
    {
        public ContatoContext(DbContextOptions<ContatoContext> options) : base(options)
        {
        }

        public DbSet<Contato> Contatos { get; set; }
    }
