// src/pages/Contatos.js
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import InputMask from "react-input-mask";
import api from "../services/api";
import estadosBrasileiros from "../services/estados";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 50px auto;
  padding: 40px;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.shadows.large};
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.8em;
  font-weight: 700;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  background: ${(props) => props.theme.colors.background};
  padding: 30px;
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.shadows.medium};
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid ${(props) => props.theme.colors.lightText};
  border-radius: ${(props) => props.theme.borderRadius};
  font-size: 1em;
  transition: all 0.3s;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => `${props.theme.colors.primary}33`};
    outline: none;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.lightText};
`;

const Button = styled.button`
  grid-column: span 2;
  padding: 15px 0;
  background: ${(props) => props.theme.gradients.primary};
  color: ${(props) => props.theme.colors.surface};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius};
  font-size: 1.2em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.medium};
  }
`;

const ContactList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ContactItem = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 20px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${(props) => props.theme.shadows.medium};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${(props) => props.theme.gradients.primary};
  }
`;

const ContactName = styled.h3`
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 10px;
  font-size: 1.2em;
`;

const ContactInfo = styled.p`
  color: ${(props) => props.theme.colors.lightText};
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.error};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const MaskedInput = styled(InputMask)`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid ${(props) => props.theme.colors.lightText};
  border-radius: ${(props) => props.theme.borderRadius};
  font-size: 1em;
  transition: all 0.3s;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => `${props.theme.colors.primary}33`};
    outline: none;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: ${(props) => props.theme.colors.surface};
  padding: 20px;
  border-radius: ${(props) => props.theme.borderRadius};
  width: 400px;
  box-shadow: ${(props) => props.theme.shadows.large};
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid ${(props) => props.theme.colors.lightText};
  border-radius: ${(props) => props.theme.borderRadius};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.error};
  font-size: 1.5em;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const LoadingMessage = styled.p`
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const UserSelector = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid ${(props) => props.theme.colors.lightText};
  border-radius: ${(props) => props.theme.borderRadius};
  font-size: 1em;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
`;

function Contatos() {
  const [contatos, setContatos] = useState([]);
  const [novoContato, setNovoContato] = useState({
    nome: "",
    email: "",
    celular: "",
    endereco: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    buscarUsuarios();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      buscarContatos();
    }
  }, [selectedUser]);

  const buscarUsuarios = async () => {
    try {
      const response = await api.get("/usuarios/listar");
      setUsuarios(response.data);
      if (response.data.length > 0) {
        setSelectedUser(response.data[0].email);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setError("Não foi possível carregar os usuários.");
    }
  };

  const buscarContatos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/contatos/listar", {
        email: selectedUser,
        senha: "senha_padrao", // Você pode precisar ajustar isso dependendo da sua API
      });
      setContatos(response.data);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      setError(
        "Não foi possível carregar os contatos. Por favor, tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoContato((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const adicionarContato = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        `/contatos/cadastrar/${selectedUser}/senha_padrao`,
        novoContato
      );
      setContatos((prev) => [...prev, response.data]);
      setNovoContato({
        nome: "",
        email: "",
        celular: "",
        endereco: "",
      });
      alert("Contato adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar contato:", error);
      setError(
        "Não foi possível cadastrar o contato. Por favor, tente novamente mais tarde."
      );
    }
  };

  const deletarContato = async (celular) => {
    try {
      await api.delete(`/contatos/deletar/${celular}`, {
        data: { email: selectedUser, senha: "senha_padrao" },
      });
      setContatos((prev) => prev.filter((contato) => contato.celular !== celular));
      alert("Contato deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
      alert("Erro ao deletar contato. Por favor, tente novamente.");
    }
  };

  const salvarEndereco = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Title>Gerenciar Contatos</Title>
      <UserSelector
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Selecione um usuário</option>
        {usuarios.map((usuario) => (
          <option key={usuario.id} value={usuario.email}>
            {usuario.nome} ({usuario.email})
          </option>
        ))}
      </UserSelector>
      <Form onSubmit={adicionarContato}>
        <InputGroup>
          <InputIcon>
            <FaUser />
          </InputIcon>
          <Input
            type="text"
            name="nome"
            placeholder="Nome"
            value={novoContato.nome}
            onChange={handleInputChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <InputIcon>
            <FaEnvelope />
          </InputIcon>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={novoContato.email}
            onChange={handleInputChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <InputIcon>
            <FaPhone />
          </InputIcon>
          <MaskedInput
            mask="(99) 99999-9999"
            name="celular"
            placeholder="Celular"
            value={novoContato.celular}
            onChange={handleInputChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <InputIcon>
            <FaMapMarkerAlt />
          </InputIcon>
          <Input
            type="text"
            name="endereco"
            placeholder="Endereço"
            value={novoContato.endereco}
            onChange={handleInputChange}
            required
          />
        </InputGroup>
        <Button type="submit">
          <FaPlus /> Adicionar Contato
        </Button>
      </Form>

      {isLoading ? (
        <LoadingMessage>Carregando contatos...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <ContactList>
          {contatos.map((contato) => (
            <ContactItem key={contato.id}>
              <ContactName>{contato.nome}</ContactName>
              <ContactInfo>
                <FaEnvelope /> {contato.email}
              </ContactInfo>
              <ContactInfo>
                <FaPhone /> {contato.celular}
              </ContactInfo>
              <ContactInfo>
                <FaMapMarkerAlt /> {contato.endereco}
              </ContactInfo>
              <DeleteButton onClick={() => deletarContato(contato.celular)}>
                <FaTrash />
              </DeleteButton>
            </ContactItem>
          ))}
        </ContactList>
      )}

      {isModalOpen && (
        <ModalBackdrop onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              &times;
            </CloseButton>
            <h2>Detalhes do Endereço</h2>
            <Select
              name="estado"
              onChange={handleInputChange}
            >
              {estadosBrasileiros.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </Select>
            <Input type="text" name="cidade" placeholder="Cidade" onChange={handleInputChange} />
            <Input type="text" name="bairro" placeholder="Bairro" onChange={handleInputChange} />
            <Input type="text" name="rua" placeholder="Rua" onChange={handleInputChange} />
            <Input type="text" name="numero" placeholder="Número" onChange={handleInputChange} />
            <Button type="button" onClick={salvarEndereco}>
              Salvar
            </Button>
          </ModalContent>
        </ModalBackdrop>
      )}
    </Container>
  );
}

export default Contatos;