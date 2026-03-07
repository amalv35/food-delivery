import React from 'react'
import "./NavBar.css";
import { IoMdContact } from "react-icons/io";

const NavBar = () => {
  return (
    <div className="navbar">
        <img src="/assets/logo.png" alt="" className="logo" />
        <p className="title">Admin Dashboard</p>
        <IoMdContact className="profile" />
    </div>
  )
}

export default NavBar