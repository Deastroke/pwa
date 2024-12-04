import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("userId", data.userId);
      navigate("/Incio");
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al iniciar sesión");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-12 px-4">
      {/* Contenedor principal */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-12">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Bienvenido
        </h2>
        <p className="text-base text-gray-600 text-center mb-10">
          Por favor, inicia sesión para continuar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campo de correo electrónico */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          {/* Campo de contraseña */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="********"
              required
            />
          </div>

          {/* Mensaje de error */}
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}

          {/* Botón de inicio */}
          <button
            type="submit"
            className="w-[100%] py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Links adicionales */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <a href="#" className="text-purple-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <a href="/Register" className="text-purple-600 font-medium hover:underline">
            Regístrate aquí
          </a>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
