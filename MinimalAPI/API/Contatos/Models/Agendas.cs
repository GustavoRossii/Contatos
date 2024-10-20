using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Contatos.Models;

public class Agendas
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    [Required(ErrorMessage = "O nome da agenda é obrigatório.")]
    public string? Nome { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.Now;

    public Usuarios? Usuario { get; set; }

    public ICollection<Contato>? Contatos { get; set; }
}
