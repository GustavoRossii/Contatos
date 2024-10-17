using Contatos.Models;
using Contatos.Data;  
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;  
using System.Linq;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Contatos");

app.MapPost("/api/contatos/cadastrar", ([FromBody] Contato contato, [FromServices] ContatoContext ctx) =>
{
    //Para garantir que o contato tenha nome
    if (string.IsNullOrWhiteSpace(contato.Nome)){
        return Results.BadRequest("A inclusão de um nome é obrigatória.");
    }

    ctx.Contatos.Add(contato);
    ctx.SaveChanges();
    return Results.Created("", contato);
});

app.MapGet("/api/contatos/listar", ([FromServices] ContatoContext ctx) =>{
    if(ctx.Contatos.Any()){
        return Results.Ok(ctx.Contatos.ToList());
    }
    return Results.NotFound("Nenhum contato cadastrado");
});

app.MapGet("/api/contatos/buscar/{id}", ([FromRoute] int id, [FromServices] ContatoContext ctx) =>
{
    Contato? contato = ctx.Contatos.Find(id);
    if (contato is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(contato);
});

app.MapPut("/api/contatos/alterar/{id}", ([FromBody] Contato contatoAlterado, [FromRoute] int id, [FromServices] ContatoContext ctx) =>
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

app.MapDelete("/api/contatos/deletar/{id}", ([FromRoute] int id, [FromServices] ContatoContext ctx) =>
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



app.Run();