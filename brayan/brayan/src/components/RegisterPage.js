import React, { useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Usuario registrado exitosamente.");
      } else {
        setMessage(data.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Ocurrió un error al registrar el usuario.");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-12 px-4">
      {/* Contenedor del formulario */}
      <div className="w-full max-w-2xl bg-white p-12 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Crear Nueva Cuenta
        </h2>
        <p className="text-base text-gray-600 text-center mb-10">
          ¡Bienvenido! Por favor, completa el formulario para registrarte.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campo de nombre de usuario */}
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ingresa tu nombre de usuario"
              required
            />
          </div>

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
              placeholder="Ingresa tu correo"
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
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {/* Campo de confirmación de contraseña */}
          <div className="flex flex-col">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          {/* Mensaje de error o éxito */}
          {message && (
            <div
              className={`text-sm text-center ${
                message.includes("exitosamente") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-[100%] py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          >
            Crear Cuenta
          </button>
        </form>

        {/* Link para iniciar sesión */}
        <div className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tienes una cuenta?{" "}
          <a
            href="/Login"
            className="text-purple-600 font-medium hover:underline"
          >
            Inicia sesión aquí
          </a>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
