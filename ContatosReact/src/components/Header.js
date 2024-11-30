// src/components/Header.js
import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';

const Nav = styled.nav`
  background: ${props => props.theme.gradients.primary};
  padding: 15px 0;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  color: ${props => props.theme.colors.surface};
  font-size: 1.5em;
  font-weight: 700;
  text-decoration: none;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 30px;
  align-items: center;
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.surface};
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1em;
  padding: 5px 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.theme.colors.surface};
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after,
  &.active::after {
    transform: scaleX(1);
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.surface};
  font-size: 1.2em;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

function Header({ toggleTheme, isDarkMode }) {
  const location = useLocation();

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">GerenciadorApp</Logo>
        <NavList>
          <NavItem>
            <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/usuarios" className={location.pathname === '/usuarios' ? 'active' : ''}>Usuários</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contatos" className={location.pathname === '/contatos' ? 'active' : ''}>Contatos</NavLink>
          </NavItem>
          <NavItem>
            <ThemeToggle onClick={toggleTheme}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </ThemeToggle>
          </NavItem>
        </NavList>
      </NavContainer>
    </Nav>
  );
}

export default Header;