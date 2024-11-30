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

function Contatos() {
  const [contatos, setContatos] = useState([
    {
      id: 1,
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(11) 99999-9999",
      endereco: "Rua A, 123",
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@email.com",
      telefone: "(11) 88888-8888",
      endereco: "Av. B, 456",
    },
  ]);
  const [novoContato, setNovoContato] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enderecoDetalhado, setEnderecoDetalhado] = useState({
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const nome = localStorage.getItem("nomeUsuario");
    const email = localStorage.getItem("emailUsuario");
    const senha = localStorage.getItem("senhaUsuario");

    console.log(nome, email, senha);

    buscarContatos(nome, email, senha);
  }, []);

  const buscarContatos = async (e, email, senha) => {
    setIsLoading(true);
    setError(null);

    const usuario = {
      email: email,
      senha: senha,
    };

    console.log("Buscando usuário:", usuario);

    try {
      const response = await api.post("/contatos/listar", usuario);
      setContatos(response.data);
      console.log("Contatos carregados:", response.data);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);

      if (error.response && error.response.data) {
        setError(error.response.data); // Mensagem do backend
      } else {
        setError(
          "Não foi possível carregar os contatos. Por favor, tente novamente mais tarde."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNovoContato({ ...novoContato, [e.target.name]: e.target.value });
  };

  const handleEnderecoChange = (e) => {
    setEnderecoDetalhado({
      ...enderecoDetalhado,
      [e.target.name]: e.target.value,
    });
  };

  const adicionarContato = (e) => {
    e.preventDefault();
    setContatos([...contatos, { ...novoContato, id: Date.now() }]);
    setNovoContato({ nome: "", email: "", telefone: "", endereco: "" });
  };

  const salvarEndereco = () => {
    const { estado, cidade, bairro, rua, numero } = enderecoDetalhado;
    setNovoContato({
      ...novoContato,
      endereco: `${rua}, ${numero}, ${bairro}, ${cidade} - ${estado}`,
    });
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Title>Gerenciar Contatos</Title>
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
            name="telefone"
            placeholder="Telefone"
            value={novoContato.telefone}
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
            onClick={() => setIsModalOpen(true)}
            readOnly
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
                <FaMapMarkerAlt />
                {contato.endereco
                  ? `${contato.endereco.rua}, ${contato.endereco.numero}, ${contato.endereco.bairro}, ${contato.endereco.cidade} - ${contato.endereco.estado}`
                  : "Endereço não disponível"}
              </ContactInfo>

              <DeleteButton
                onClick={() =>
                  setContatos(contatos.filter((c) => c.id !== contato.id))
                }
              >
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
            <label>Estado</label>
            <Select
              name="estado"
              value={enderecoDetalhado.estado}
              onChange={handleEnderecoChange}
            >
              {estadosBrasileiros.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </Select>
            <label>Cidade</label>
            <Input
              type="text"
              name="cidade"
              value={enderecoDetalhado.cidade}
              onChange={handleEnderecoChange}
            />
            <label>Bairro</label>
            <Input
              type="text"
              name="bairro"
              value={enderecoDetalhado.bairro}
              onChange={handleEnderecoChange}
            />
            <label>Rua</label>
            <Input
              type="text"
              name="rua"
              value={enderecoDetalhado.rua}
              onChange={handleEnderecoChange}
            />
            <label>Número</label>
            <Input
              type="text"
              name="numero"
              value={enderecoDetalhado.numero}
              onChange={handleEnderecoChange}
            />
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
