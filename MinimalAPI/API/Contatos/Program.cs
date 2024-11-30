using Contatos.Models;
using Contatos.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });

builder.Services.AddDbContext<AppDataContext>();
var app = builder.Build();

app.MapGet("/", () => "Contatos");

// Cadastrar Contatos
app.MapPost("/api/contatos/cadastrar/{email}/{senha}", ([FromRoute] string email, [FromRoute] string senha, [FromBody] Contato contato, [FromServices] AppDataContext ctx) =>
{
    if (contato == null)
    {
        return Results.BadRequest("Dados incompletos na requisição.");
    }

    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(senha))
    {
        return Results.BadRequest("Email ou senha do usuário são obrigatórios.");
    }

    // Verifica se o usuário existe
    Usuario? usuarioDb = ctx.Usuarios.FirstOrDefault(u => u.Email == email && u.Senha == senha);
    if (usuarioDb is null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    Agenda? agenda = ctx.Agendas.FirstOrDefault(a => a.UsuarioId == usuarioDb.Id);
    if (agenda is null)
    {
        return Results.NotFound("Agenda não encontrada.");
    }

    if (string.IsNullOrWhiteSpace(contato.Nome))
    {
        return Results.BadRequest("A inclusão de um nome é obrigatória.");
    }

    bool contatoExistente = ctx.Contatos.Any(c => c.AgendaId == agenda.Id && 
        (c.Email == contato.Email || c.Celular == contato.Celular));

    if (contatoExistente)
    {
        return Results.Conflict("Já existe um contato cadastrado com este email ou número.");
    }

     if (string.IsNullOrWhiteSpace(contato.Estado) || 
        string.IsNullOrWhiteSpace(contato.Cidade) || 
        string.IsNullOrWhiteSpace(contato.Bairro) || 
        string.IsNullOrWhiteSpace(contato.Rua) || 
        contato.Numero is null)
    {
        return Results.BadRequest("Todos os campos do endereço são obrigatórios.");
    }

    Contato novoContato = new Contato
    {
        Nome = contato.Nome,
        Email = contato.Email,
        Celular = contato.Celular,
        AgendaId = agenda.Id,
        DataCadastro = DateTime.Now
    };
    ctx.Contatos.Add(novoContato);
    ctx.SaveChanges();


    // Cria o endereço vinculado ao contato
    Endereco novoEndereco = new Endereco
    {
        ContatoId = novoContato.Id,
        Estado = contato.Estado,
        Cidade = contato.Cidade,
        Bairro = contato.Bairro,
        Rua = contato.Rua,
        Numero = contato.Numero
    };
    ctx.Enderecos.Add(novoEndereco);
    ctx.SaveChanges();

    return Results.Created($"/api/contatos/{novoContato.Id}", new { Contato = novoContato, Endereco = novoEndereco });
});


// Listar os contatos
app.MapGet("/api/contatos/listar", ([FromBody] Usuario usuario, [FromServices] AppDataContext ctx) =>
{
    if (usuario == null || string.IsNullOrWhiteSpace(usuario.Email) || string.IsNullOrWhiteSpace(usuario.Senha))
    {
        return Results.BadRequest("Email e senha são obrigatórios.");
    }

    // Verifica se o usuário existe
    Usuario? usuarioDb = ctx.Usuarios.FirstOrDefault(u => u.Email == usuario.Email && u.Senha == usuario.Senha);
    if (usuarioDb is null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    // Verifica se a agenda do usuário existe
    Agenda? agenda = ctx.Agendas.FirstOrDefault(a => a.UsuarioId == usuarioDb.Id);
    if (agenda is null)
    {
        return Results.NotFound("Agenda não encontrada.");
    }

    // Recupera contatos e seus endereços
    var contatos = ctx.Contatos
        .Where(c => c.AgendaId == agenda.Id)
        .Select(c => new
        {
            c.Id,
            c.Nome,
            c.Email,
            c.Celular,
            c.DataCadastro,
            Endereco = ctx.Enderecos.FirstOrDefault(e => e.ContatoId == c.Id)
        })
        .ToList();

    if (!contatos.Any())
    {
        return Results.NotFound("Nenhum contato cadastrado para essa agenda.");
    }

    return Results.Ok(contatos);
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

    // Busca o endereço relacionado ao contato
    Endereco? endereco = ctx.Enderecos.FirstOrDefault(e => e.ContatoId == contato.Id);

    // Retorna o contato com o endereço (se encontrado)
    return Results.Ok(new
    {
        Contato = new
        {
            contato.Id,
            contato.Nome,
            contato.Email,
            contato.Celular
        },
        Endereco = endereco is not null ? new
        {
            endereco.Estado,
            endereco.Cidade,
            endereco.Bairro,
            endereco.Rua,
            endereco.Numero
        } : null
    });
});


//Alterar contato com base em seu numero
app.MapPut("/api/contatos/alterar/{email}/{senha}/{numero}", ([FromRoute] string email, [FromRoute] string senha, [FromRoute] string numero, [FromBody] Contato contato, [FromServices] AppDataContext ctx) =>
{
    if (contato == null)
    {
        return Results.BadRequest("Dados incompletos na requisição.");
    }

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

    if (string.IsNullOrWhiteSpace(contato.Nome))
    {
        return Results.BadRequest("A inclusão de um nome é obrigatória.");
    }

    Contato? contatoExistente = ctx.Contatos.FirstOrDefault(c => c.AgendaId == agenda.Id && c.Celular == numero);

    if (contatoExistente is null)
    {
        return Results.NotFound("Contato não encontrado.");
    }

    contatoExistente.Nome = contato.Nome;
    contatoExistente.Email = contato.Email;
    contatoExistente.Celular = contato.Celular;

    ctx.Contatos.Update(contatoExistente);
    ctx.SaveChanges();

    return Results.Ok(contatoExistente);
});

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
    if (ctx.Usuarios.Any(u => u.Email == usuario.Email))
    {
        return Results.BadRequest("Um usuário com este e-mail já existe.");
    }

    ctx.Usuarios.Add(usuario);
    ctx.SaveChanges();

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

//Para listar os usuarios sem a senha
// app.MapGet("/api/usuarios/listar", ([FromServices] AppDataContext ctx) =>
// {
//     var usuarios = ctx.Usuarios.ToList();
//     var usuariosSemSenha = new List<Usuario>();

//     if (usuarios.Any())
//     {
//         foreach (var usuario in usuarios)
//         {
//             // Criar uma cópia do usuário sem a senha
//             usuariosSemSenha.Add(new Usuario
//             {
//                 Id = usuario.Id,
//                 Nome = usuario.Nome,
//                 Email = usuario.Email,
//                 // Não inclua a senha
//                 // Outros campos que você deseja incluir
//             });
//         }

//         return Results.Ok(usuariosSemSenha);
//     }

//     return Results.NotFound("Nenhum usuário cadastrado.");
// });


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