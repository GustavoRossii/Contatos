// src/pages/Home.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUsers, FaAddressBook, FaRocket } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomeContainer = styled.div`
  max-width: 1000px;
  margin: 80px auto;
  padding: 50px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.large};
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 3em;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.lightText};
  font-size: 1.2em;
  margin-bottom: 40px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
`;

const StyledLink = styled(Link)`
  padding: 15px 30px;
  background: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.surface};
  text-decoration: none;
  border-radius: 30px;
  font-size: 1.1em;
  font-weight: 600;
  transition: all ${props => props.theme.transitions.default};
  box-shadow: ${props => props.theme.shadows.small};
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const FeatureSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 60px;
`;

const FeatureCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.medium};
  width: 30%;
  transition: all ${props => props.theme.transitions.default};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const FeatureIcon = styled.div`
  font-size: 2em;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
`;

const FeatureTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.lightText};
`;

function Home() {
  return (
    <HomeContainer>
      <Title>Bem-vindo ao GerenciadorApp</Title>
      <Subtitle>Gerencie seus contatos e usuários com facilidade e eficiência.</Subtitle>
      <ButtonContainer>
        <StyledLink to="/usuarios"><FaUsers /> Gerenciar Usuários</StyledLink>
        <StyledLink to="/contatos"><FaAddressBook /> Gerenciar Contatos</StyledLink>
      </ButtonContainer>
      <FeatureSection>
        <FeatureCard>
          <FeatureIcon><FaUsers /></FeatureIcon>
          <FeatureTitle>Gerenciamento de Usuários</FeatureTitle>
          <FeatureDescription>Adicione, edite e remova usuários com facilidade.</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon><FaAddressBook /></FeatureIcon>
          <FeatureTitle>Organização de Contatos</FeatureTitle>
          <FeatureDescription>Mantenha seus contatos organizados e atualizados.</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon><FaRocket /></FeatureIcon>
          <FeatureTitle>Rápido e Eficiente</FeatureTitle>
          <FeatureDescription>Interface intuitiva para máxima produtividade.</FeatureDescription>
        </FeatureCard>
      </FeatureSection>
    </HomeContainer>
  );
}

export default Home;