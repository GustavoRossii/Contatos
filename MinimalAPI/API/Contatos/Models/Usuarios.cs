using System;
using System.ComponentModel.DataAnnotations;

namespace Contatos.Models;

public class Usuarios
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome é obrigatório.")]
    public string? Nome { get; set; }

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "A senha é obrigatória.")]
    [StringLength(20, MinimumLength = 6, ErrorMessage = "A senha deve ter entre 6 e 20 caracteres.")]
    public string? Senha { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
