using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Contatos.Models;

public class Endereco{
    public int Id { get; set; }
    public int ContatoId { get; set; }
    
    [Required(ErrorMessage = "O estado é obrigatório.")]
    public string? Estado { get; set; }

    [Required(ErrorMessage = "A cidade é obrigatória.")]
    public string? Cidade { get; set; }

    [Required(ErrorMessage = "O bairro é obrigatório.")]
    public string? Bairro { get; set; }

    [Required(ErrorMessage = "A rua é obrigatória.")]
    public string? Rua { get; set; }
    
    [Required(ErrorMessage = "O numero é obrigatório.")]
    public int? Numero { get; set; }
}
