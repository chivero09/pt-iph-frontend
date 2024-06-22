import React from "react";
import { NavLink } from "react-router-dom";

const Menu = () => {
  return (
    <nav className="bg-zinc-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="IPH Logo" className="h-10 mr-4" />
          <ul className="flex space-x-4 list-none font-semibold">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-cyan-700" : "text-white hover:text-gray-400"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/terminales"
                className={({ isActive }) =>
                  isActive ? "text-cyan-700" : "text-white hover:text-gray-400"
                }
              >
                Terminales
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/grupos"
                className={({ isActive }) =>
                  isActive ? "text-cyan-700" : "text-white hover:text-gray-400"
                }
              >
                Grupos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chats"
                className={({ isActive }) =>
                  isActive ? "text-cyan-700" : "text-white hover:text-gray-400"
                }
              >
                Chats
              </NavLink>
            </li>
          </ul>
        </div>
        <ul className="list-none">
          <li>
            <NavLink
              to="/login"
              onClick={() => localStorage.removeItem("token")}
              className={({ isActive }) =>
                isActive ? "text-yellow-400" : "text-white hover:text-gray-400"
              }
            >
              Cerrar sesión
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
