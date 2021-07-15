import React from 'react'
import { HeaderStyle } from './styles'

export interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <HeaderStyle>
      <div className="header-title">{title}</div>
    </HeaderStyle>
  )
}

export default Header
