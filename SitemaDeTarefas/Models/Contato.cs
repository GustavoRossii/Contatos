namespace SitemaDeTarefas.Models;

public class Contato
{
    public int Id {get; set;}
    public int AgendaId {get; set;}
    public string? Nome {get; set;}
    public string? Telefone {get; set;}
    public string? Email {get; set;}
    public string? Endereco {get; set;}
    public DateTime CriadoEm {get; set;} = DateTime.Now;
    public DateTime AtualizadoEm {get; set;}

}
