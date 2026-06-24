import { Link } from 'next-view-transitions'
import React from 'react'

const Nav = () => {
  return (
    <div className="flex justify-center items-center p-4 bg-gray-800 text-white">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
    </div>
  )
}

export default Nav