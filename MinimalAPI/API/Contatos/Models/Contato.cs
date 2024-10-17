using System;

namespace Contatos.Models;

public class Contato
{   
        public int Id { get; set; }  
        public string Nome { get; set; }  

        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string? Email { get; set; }  

        [RegularExpression(@"^\d{11}$", ErrorMessage = "O celular deve ter 11 dígitos (com DDD).")]
        public string? Celular { get; set; }     

        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
}