using Contatos.Models;
using Contatos.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();
var app = builder.Build();

app.MapGet("/", () => "Contatos");

//Cadastrar Contatos
app.MapPost("/api/contatos/cadastrar", ([FromBody] dynamic requestBody, [FromServices] AppDataContext ctx) =>
{
    if (requestBody.usuario == null || requestBody.contato == null)
    {
        return Results.BadRequest("Dados incompletos na requisição.");
    }

    var usuarioJson = requestBody.usuario;
    var contatoJson = requestBody.contato;

    string? email = usuarioJson.email;
    string? senha = usuarioJson.senha;

    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(senha))
    {
        return Results.BadRequest("Email ou senha do usuário são obrigatórios.");
    }

    Usuario? usuario = ctx.Usuarios.FirstOrDefault(u => u.Email == email && u.Senha == senha);

    if (usuario is null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    Agenda? agenda = ctx.Agendas.FirstOrDefault(a => a.UsuarioId == usuario.Id);

    if (agenda is null)
    {
        return Results.NotFound("Agenda não encontrada.");
    }

    if (string.IsNullOrWhiteSpace((string)contatoJson.nome))
    {
        return Results.BadRequest("A inclusão de um nome é obrigatória.");
    }

    Contato novoContato = new Contato
    {
        Nome = contatoJson.nome,
        Email = contatoJson.email,
        Celular = contatoJson.celular,
        Endereco = contatoJson.endereco,
        AgendaId = agenda.Id,
        DataCadastro = DateTime.Now
    };

    ctx.Contatos.Add(novoContato);
    ctx.SaveChanges();

    return Results.Created("", novoContato);
});


//Listar os contatos
app.MapGet("/api/contatos/listar", ([FromBody] Usuario? usuario, [FromServices] AppDataContext ctx) =>
{
    Usuario? usuarioDb = ctx.Usuarios.FirstOrDefault(u => u.Email == usuario.Email && u.Senha == usuario.Senha);
    if (usuarioDb is null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    Agenda? agenda = ctx.Agendas.FirstOrDefault(a => a.UsuarioId == usuarioDb.Id);
    if (agenda is null)
    {
        return Results.NotFound("Agenda não encontrada.");
    }

    var contatos = ctx.Contatos.Where(c => c.AgendaId == agenda.Id).ToList();

    if (contatos.Any())
    {
        return Results.Ok(contatos);
    }

    return Results.NotFound("Nenhum contato cadastrado para essa agenda.");
});


//Buscar contatos com base em seu numero e no usuario que esta buscando
app.MapGet("/api/contatos/buscar/{celular}", ([FromRoute] string celular, [FromBody] Usuario? usuario, [FromServices] AppDataContext ctx) =>
{
    if (usuario is null)
    {
        return Results.BadRequest("Usuário inválido.");
    }

    Usuario? usuarioEncontrado = ctx.Usuarios.FirstOrDefault(u => u.Email == usuario.Email && u.Senha == usuario.Senha);

    if (usuarioEncontrado is null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    Agenda? agenda = ctx.Agendas.FirstOrDefault(a => a.UsuarioId == usuarioEncontrado.Id);

    if (agenda is null)
    {
        return Results.NotFound("Agenda não encontrada.");
    }

    Contato? contato = ctx.Contatos.FirstOrDefault(c => c.AgendaId == agenda.Id && c.Celular == celular);

    if (contato is null)
    {
        return Results.NotFound("Contato não encontrado.");
    }

    return Results.Ok(contato);
});


//Alterar contato com base em seu numero
app.MapPut("/api/contatos/alterar/{numero}", ([FromBody] dynamic requestBody, [FromRoute] string numero, [FromServices] AppDataContext ctx) =>
{
    if (requestBody.usuario == null || requestBody.contato == null)
    {
        return Results.BadRequest("Dados incompletos na requisição.");
    }

    var usuarioJson = requestBody.usuario;
    var contatoJson = requestBody.contato;

    string? email = usuarioJson.email;
    string? senha = usuarioJson.senha;

    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(senha))
    {
        return Results.BadRequest("Email ou senha do usuário são obrigatórios.");
    }

    Usuario? usuario = ctx.Usuarios.FirstOrDefault(u => u.Email == email && u.Senha == senha);
    if (usuario is null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    Agenda? agenda = ctx.Agendas.FirstOrDefault(a => a.UsuarioId == usuario.Id);
    if (agenda is null)
    {
        return Results.NotFound("Agenda não encontrada.");
    }

    if (string.IsNullOrWhiteSpace((string)contatoJson.nome))
    {
        return Results.BadRequest("A inclusão de um nome é obrigatória.");
    }

    Contato? contato = ctx.Contatos.FirstOrDefault(c => c.AgendaId == agenda.Id && c.Celular == numero);
    if (contato is null)
    {
        return Results.NotFound("Contato não encontrado.");
    }

    contato.Nome = (string)contatoJson.nome;
    contato.Email = (string)contatoJson.email;
    contato.Celular = (string)contatoJson.celular;
    contato.Endereco = (string)contatoJson.endereco;

    ctx.Contatos.Update(contato);
    ctx.SaveChanges();

    return Results.Ok(contato);
});



//Deletar contato com base em seu numero
// Deletar contato com base em seu número
app.MapDelete("/api/contatos/deletar/{numero}", ([FromRoute] string numero, [FromBody] Usuario? usuario, [FromServices] AppDataContext ctx) =>
{
    Console.WriteLine($"Tentando deletar o contato com número: {numero}");

    if (usuario is null)
    {
        return Results.BadRequest("Usuário inválido.");
    }

    Usuario? usuarioDb = ctx.Usuarios.FirstOrDefault(u => u.Email == usuario.Email && u.Senha == usuario.Senha);
    if (usuarioDb is null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    Agenda? agenda = ctx.Agendas.FirstOrDefault(a => a.UsuarioId == usuarioDb.Id);
    if (agenda is null)
    {
        return Results.NotFound("Agenda não encontrada.");
    }

    Contato? contato = ctx.Contatos.FirstOrDefault(c => c.AgendaId == agenda.Id && c.Celular == numero);
    if (contato == null)
    {
        return Results.NotFound("Contato não encontrado.");
    }

    ctx.Contatos.Remove(contato);
    ctx.SaveChanges();
    Console.WriteLine("Contato deletado com sucesso.");
    return Results.Ok(contato);
});


//FUNCIONALIDADES DE USUARIO -------------------------------------------

app.MapPost("/api/usuarios/cadastrar", ([FromBody] Usuario usuario, [FromServices] AppDataContext ctx) =>
{
    if (string.IsNullOrWhiteSpace(usuario.Nome))
    {
        return Results.BadRequest("A inclusão de um nome é obrigatória.");
    }

    ctx.Usuarios.Add(usuario);
    ctx.SaveChanges();

    // Criar agenda
    Agenda agenda = new Agenda
    {
        UsuarioId = usuario.Id,
        Nome = "Agenda de " + usuario.Email,
        Usuario = usuario
    };

    ctx.Agendas.Add(agenda);
    ctx.SaveChanges();

    return Results.Created("", usuario);
});


//Listar usuarios
app.MapGet("/api/usuarios/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Usuarios.Any())
    {
        return Results.Ok(ctx.Usuarios.ToList());
    }
    return Results.NotFound("Nenhum usuário cadastrado.");
});



//Buscar usuario com base em seu email
app.MapGet("/api/usuarios/buscar/{email}", ([FromRoute] string email, [FromServices] AppDataContext ctx) =>
{
    Usuario? usuario = ctx.Usuarios.FirstOrDefault((usuario) => usuario.Email == email);
    if (usuario is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(usuario);
});

//Alterar usuarios com base em seu email
app.MapPut("/api/usuarios/alterar/{email}/{senha}", ([FromBody] Usuario usuarioAlterado, [FromRoute] string email, [FromRoute] string senha, [FromServices] AppDataContext ctx) =>
{
    Usuario? usuario = ctx.Usuarios.FirstOrDefault((usuario) => usuario.Email == email && usuario.Senha == senha);
    if (usuario is null)
    {
        return Results.NotFound();
    }
    usuario.Nome = usuarioAlterado.Nome;
    usuario.Email = usuarioAlterado.Email;
    usuario.Senha = usuarioAlterado.Senha;

    ctx.Usuarios.Update(usuario);
    ctx.SaveChanges();
    return Results.Ok(usuario);
});


//Deletar usuario com base em seu email
app.MapDelete("/api/usuarios/deletar/{email}/{senha}", ([FromRoute] string email, [FromRoute] string senha, [FromServices] AppDataContext ctx) =>
{
    Console.WriteLine($"Tentando deletar o usuario com Email: {email}");
    Usuario? usuario = ctx.Usuarios.FirstOrDefault((usuario) => usuario.Email == email && usuario.Senha == senha);
    if (usuario == null)
    {
        Console.WriteLine("Usuario não encontrado.");
        return Results.NotFound();
    }
    ctx.Usuarios.Remove(usuario);
    ctx.SaveChanges();
    Console.WriteLine("Usuario deletado com sucesso.");
    return Results.Ok(usuario);
});


app.Run();