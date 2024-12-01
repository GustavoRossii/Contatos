// src/pages/Usuarios.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const UsuariosContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserItem = styled.li`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const LoadingMessage = styled.p`
  text-align: center;
`;

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailOriginal, setEmailOriginal] = useState(''); // Estado para armazenar o email original
  const [senhaOriginal, setSenhaOriginal] = useState(''); // Estado para armazenar a senha original
  const [usuarioEditado, setUsuarioEditado] = useState(null)


  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/usuarios/listar');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setError('Não foi possível carregar os usuários. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/usuarios/cadastrar', novoUsuario);
      setNovoUsuario({ nome: '', email: '', senha: '' });
      buscarUsuarios();
      alert('Usuário cadastrado com sucesso!');

      localStorage.setItem("nomeUsuario", novoUsuario.nome);
      localStorage.setItem("emailUsuario", novoUsuario.email);
      localStorage.setItem("senhaUsuario", novoUsuario.senha);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Erro ao cadastrar usuário. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (email, senha) => {

    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/usuarios/deletar/${email}/${senha}`);
        buscarUsuarios();
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário. Por favor, tente novamente.');
      }
    }
  };

  const iniciarEdicao = (usuario) => {
    setUsuarioEditado(usuario);
    setEmailOriginal(usuario.email);  // Armazene o email original
    setSenhaOriginal(usuario.senha);
  };
  

  const handleEdit = async () => {
    try {
      await api.put(
        `/usuarios/alterar/${emailOriginal}/${senhaOriginal}`,
        {
          nome: usuarioEditado.nome,
          email: usuarioEditado.email,
          senha: usuarioEditado.senha,
        }
      );
      
  
      alert('Usuário atualizado com sucesso!');
      buscarUsuarios(); // Atualiza a lista de usuários no estado
      setUsuarioEditado(null); // Fecha o modal ou limpa o estado
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário. Tente novamente.');
    }
  };

  const handleEditButtonClick = (usuario) => {
    setUsuarioEditado(usuario); // Preenche o estado com os dados do usuário
  };
  
  
  

  return (
    <UsuariosContainer>
      <Title>Gerenciar Usuários</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nome"
          value={novoUsuario.nome}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={novoUsuario.email}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={novoUsuario.senha}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
          required
        />
        <Button type="submit">Cadastrar Usuário</Button>
      </Form>
      {isLoading ? (
        <LoadingMessage>Carregando usuários...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <UserList>
          {usuarios.map((usuario) => (
            <UserItem key={usuario.id}>
            <span>{usuario.nome} - {usuario.email}</span>
            <div>
              <Button onClick={() => iniciarEdicao(usuario)}>Editar</Button>
              <DeleteButton onClick={() => handleDelete(usuario.email, usuario.senha)}>Excluir</DeleteButton>
            </div>
          </UserItem>
          
          ))}
        </UserList>
      )}
      {usuarioEditado && (
        <Form onSubmit={handleEdit}>
          <Input
            type="text"
            placeholder="Nome"
            value={usuarioEditado.nome}
            onChange={(e) => setUsuarioEditado({ ...usuarioEditado, nome: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={usuarioEditado.email}
            onChange={(e) => setUsuarioEditado({ ...usuarioEditado, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={usuarioEditado.senha}
            onChange={(e) => setUsuarioEditado({ ...usuarioEditado, senha: e.target.value })}
            required
          />
          <Button type="submit">Salvar Alterações</Button>
          <Button type="button" onClick={() => setUsuarioEditado(null)}>Cancelar</Button>
        </Form>
)}

    </UsuariosContainer>
  );
}

export default Usuarios;