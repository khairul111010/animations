import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="navbar-item">
          <Link href="/">KHAIRUL HASAN</Link>
        </div>
      </div>
      <div className="navbar-items">
        <div className="navbar-item">
          <Link href="/">Genesis</Link>
        </div>
        <div className="navbar-item">
          <Link href="/cascade">CASCADE</Link>
        </div>
        <div className="navbar-item">
          <Link href="/orbit">ORBIT</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
