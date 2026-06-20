import Link from 'next/link'
import React from 'react'

const Nav = () => {
  return (
    <nav>
        <div className="nav-logo">
            <Link href="/">Khairul Hasan</Link>
        </div>
        <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/archive">Archive</Link>
            <Link href="/contact">Contact</Link>
        </div>
    </nav>
  )
}

export default Nav