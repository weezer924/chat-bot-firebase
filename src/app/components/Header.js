import * as React from 'react'
import Link from 'next/link'

const Header = ({ pathname }) => (
  <header>
    <Link href="/">
      <a className={pathname === '/' ? 'is-active' : ''}>Home</a>
    </Link>{' '}
  </header>
)

export default Header
