namespace SitemaDeTarefas.Models;

public class Agenda
{

    public int Id { get; set; }
    public int Usuario_id { get; set; }
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;
    public string? Nome { get; set; }
    public DateTime Criado_em { get; set; }

}
