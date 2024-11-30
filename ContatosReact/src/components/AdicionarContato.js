// src/components/AdicionarContato.js
import React, { useState } from 'react';
import api from '../services/api';

function AdicionarContato({ onContatoAdicionado }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [endereco, setEndereco] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userSenha, setUserSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Enviando dados:', { nome, email, celular, endereco, userEmail, userSenha });
      const response = await api.post(`/contatos/cadastrar/${userEmail}/${userSenha}`, {
        nome,
        email,
        celular,
        endereco
      });
      console.log('Resposta da API:', response.data);
      onContatoAdicionado(response.data);
      // Limpar o formulário
      setNome('');
      setEmail('');
      setCelular('');
      setEndereco('');
      setUserEmail('');
      setUserSenha('');
      alert('Contato adicionado com sucesso!');
    } catch (error) {
      console.error('Erro detalhado:', error);
      if (error.response) {
        console.error('Dados da resposta de erro:', error.response.data);
        console.error('Status do erro:', error.response.status);
        console.error('Headers do erro:', error.response.headers);
        alert(`Erro ao adicionar contato: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('Erro na requisição:', error.request);
        alert('Erro ao adicionar contato: Não foi possível conectar ao servidor.');
      } else {
        console.error('Erro:', error.message);
        alert(`Erro ao adicionar contato: ${error.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Adicionar Novo Contato</h3>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email do Contato"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Celular"
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Endereço"
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
      />
      <input
        type="email"
        placeholder="Seu Email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Sua Senha"
        value={userSenha}
        onChange={(e) => setUserSenha(e.target.value)}
        required
      />
      <button type="submit">Adicionar Contato</button>
    </form>
  );
}

export default AdicionarContato;