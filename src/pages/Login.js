import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Login completado");
    try {
      const response = await axios.post(
        "http://localhost:4321/api/auth/login",
        { email, password }
      );
      console.log("Respuesta data:", response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al hacer login:", error);
      const errorMessage = error.response
        ? error.response.data.message
        : error.message;
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-800">
      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="IPH Logo" className="h-20 mb-4" />
        <div className="bg-white p-8 rounded w-full max-w-md">
          <h2 className="text-2xl text-black font-bold mb-6 text-center">
            Iniciar sesión
          </h2>
          <form onSubmit={handleLogin}>
            <fieldset>
              <legend className="sr-only">Iniciar Sesión</legend>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-black text-sm font-bold mb-2"
                >
                  Email:
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Contraseña:
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {error && (
                <p role="alert" className="text-red-500 text-xs italic mb-4">
                  {error}
                </p>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Login
                </button>
              </div>
            </fieldset>
          </form>
          <p className="text-center text-gray-500 text-xs mt-4">
            Email: admin@test.com | Contraseña: 1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
