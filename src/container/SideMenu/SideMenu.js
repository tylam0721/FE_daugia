import React from "react";
import './SideMenu.css';
import { useHistory, Redirect } from "react-router-dom";


function SideMenu() {
  const history = useHistory();

  return (
    <div className="sidenav">
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Clients</a>
      <a href="#">Contact</a>
    </div>
  )
}

export default SideMenu;
