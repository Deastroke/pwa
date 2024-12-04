/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/App.js",
    "./src/views/Inicio.jsx",
    "./src/views/Login.jsx",
    "./src/views/Register.jsx",
    "./src/components/DishTable.js",
    "./src/components/RegisterPage.js",
    "./src/components/LoginPage.js",
  ],
  theme: {
    extend: {

    },
    width: {
      'sidebar': '20%',
      'content': '80%',
      'sidebar-cero': '0%',
      'content-full': '100%',
      'width-full':'100%',
      'modal': '90%'
    },
  },
  plugins: [],
}


