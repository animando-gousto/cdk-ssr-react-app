import { useRef, useState, useCallback } from 'react';
import Header from '../Header';
import styled from 'styled-components';
import useResizeCallback from '../../utils/hooks/useResizeCallback';
import Icon from '../Icon'

export const WithBase = (Component: React.ComponentType) => () => (
  <Base>
    <Component />
  </Base>
)
type BaseProps = {
  children: React.ReactNode
}

const Main: React.ComponentType<any> = styled.main`
  margin-right: ${({ offsetRight }: any) => offsetRight ? `${offsetRight}px` : undefined};
`
const Sidebar = styled.aside`
  position: fixed;
  top: ${({theme}) => `${theme.layout.header.height}px`};
  height: 100vh;
  right: 0;
`
const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  height: ${({theme}) => `${theme.layout.footer.height}px`};
`

const Base = ({ children }: BaseProps) => {
  const sidebarRef = useRef<HTMLElement>(null) as any;
  const [width, setWidth] = useState(0);

  const updateWidth = useCallback((rect) => {
    setWidth(rect.width)
  }, [])
  useResizeCallback(sidebarRef, updateWidth);

  return (
    <div>
      <Header />
      <div>
        <Main offsetRight={width}>{children}</Main>
        <Sidebar ref={sidebarRef}><Icon icon={'check-square'} /></Sidebar>
      </div>
      <Footer>Footer</Footer>
    </div>
  )
}

export default Base;
