using Contatos.Models;
using Contatos.Data;  
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;  
using System.Linq;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();
var app = builder.Build();

app.MapGet("/", () => "Contatos");

app.MapPost("/api/contatos/cadastrar", ([FromBody] Contato contato, [FromServices] AppDataContext ctx) =>
{
    //Para garantir que o contato tenha nome
    if (string.IsNullOrWhiteSpace(contato.Nome)){
        return Results.BadRequest("A inclusão de um nome é obrigatória.");
    }

    ctx.Contatos.Add(contato);
    ctx.SaveChanges();
    return Results.Created("", contato);
});

app.MapGet("/api/contatos/listar", ([FromServices] AppDataContext ctx) =>{
    if(ctx.Contatos.Any()){
        return Results.Ok(ctx.Contatos.ToList());
    }
    return Results.NotFound("Nenhum contato cadastrado");
});

app.MapGet("/api/contatos/buscar/{id}", ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Contato? contato = ctx.Contatos.Find(id);
    if (contato is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(contato);
});

app.MapPut("/api/contatos/alterar/{id}", ([FromBody] Contato contatoAlterado, [FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Contato? contato = ctx.Contatos.Find(id);
    if (contato is null)
    {
        return Results.NotFound();
    }
    contato.Nome = contatoAlterado.Nome;
    contato.Email = contatoAlterado.Email;
    contato.Celular = contatoAlterado.Celular;

    ctx.Contatos.Update(contato);
    ctx.SaveChanges();
    return Results.Ok(contato);
});

app.MapDelete("/api/contatos/deletar/{id}", ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Console.WriteLine($"Tentando deletar o contato com ID: {id}");
    Contato? contato = ctx.Contatos.Find(id);
    if (contato == null)
    {
        Console.WriteLine("Contato não encontrado.");
        return Results.NotFound();
    }
    ctx.Contatos.Remove(contato);
    ctx.SaveChanges();
    Console.WriteLine("Contato deletado com sucesso.");
    return Results.Ok(contato);
});

//FUNCIONALIDADES DE USUARIO -------------------------------------------

app.MapPost("/api/usuarios/cadastrar", ([FromBody] Usuarios usuario, [FromServices] AppDataContext ctx) =>
{
    //Para garantir que o contato tenha nome
    if (string.IsNullOrWhiteSpace(usuario.Nome)){
        return Results.BadRequest("A inclusão de um nome é obrigatória.");
    }

    ctx.Usuarios.Add(usuario);
    ctx.SaveChanges();
    return Results.Created("", usuario);
});


app.MapGet("/api/usuarios/listar", ([FromServices] AppDataContext ctx) =>{
    if(ctx.Usuarios.Any()){
        return Results.Ok(ctx.Usuarios.ToList());
    }
    return Results.NotFound("Nenhum contato cadastrado");
});


app.MapGet("/api/usuarios/buscar/{id}", ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Usuarios? usuario = ctx.Usuarios.Find(id);
    if (usuario is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(usuario);
});

app.MapPut("/api/usuarios/alterar/{id}", ([FromBody] Usuarios usuarioAlterado, [FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Usuarios? usuario = ctx.Usuarios.Find(id);
    if (usuario is null)
    {
        return Results.NotFound();
    }
    usuario.Nome = usuarioAlterado.Nome;
    usuario.Email = usuarioAlterado.Email;

    ctx.Usuarios.Update(usuario);
    ctx.SaveChanges();
    return Results.Ok(usuario);
});


app.MapDelete("/api/usuarios/deletar/{id}", ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Console.WriteLine($"Tentando deletar o usuario com ID: {id}");
    Usuarios? usuario = ctx.Usuarios.Find(id);
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