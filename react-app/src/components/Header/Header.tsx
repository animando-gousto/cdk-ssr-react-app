import { ReactNode } from 'react'
import {
  useHistory,
  Link,
} from "react-router-dom";
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { doLogout, getToken } from '../../store/session/state';
import Table from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const MenuContainer = ({ children }: {children: ReactNode}) => (
  <Table>
    <Row>
      {children}
    </Row>
  </Table>
)
const MenuItemContainer = ({ children }: {children: ReactNode}) => (
  <Col xs={false} sm="12" md="4">
    {children}
  </Col>
)

const LinkButton = styled.button`
  border: 0;
  &:hover {
    text-decoration: underline;
  }
`
const Logout = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const logout = async () => {
    dispatch(doLogout() as any).then(() => history.push('/'))
  }

  return <LinkButton onClick={logout} type='button'>Logout</LinkButton>
}

const StyledLink = styled(Link)`
  color: black;
  &:hover {
    color: black;
  }
`
const AuthActions = () => {
  const token = useAppSelector(getToken);
  return <MenuContainer>
    <MenuItemContainer>
      {token ? <Logout /> : <StyledLink to="/login">Login</StyledLink>}
    </MenuItemContainer>
  </MenuContainer>
}
const MenuItem = ({ to, title }: {to: string, title: string}) => (
  <MenuItemContainer><StyledLink to={to}>{title}</StyledLink></MenuItemContainer>
)

const Menu = () => {
  return <MenuContainer>
    <MenuItem to="/" title="Home" />
    <MenuItem to="/users" title="Users" />
  </MenuContainer>
}

const StyledHeader = styled.header`
  height: ${({theme}) => `${theme.layout.header.height}px`};
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding: 10px;
`

const Header = () => {
  return (
    <StyledHeader>
      <AuthActions />
      <Menu />
    </StyledHeader>
  );
}

export default Header;
