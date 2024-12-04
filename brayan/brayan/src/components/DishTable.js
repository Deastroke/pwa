import React, { useState, useEffect } from "react";
import axios from "axios";

const DishTable = () => {
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({
    nombre: "",
    tamaño: "",
    color: "",
    precio: "",
  });
  
  

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get("http://localhost:4000/get_passwords", {
        headers: { userId },
      })
      .then((response) => setDishes(response.data))
      .catch((error) => console.error("Error al obtener la ropa", error));

    // Verificar suscripción y suscribirse si no está suscrito
    if (!localStorage.getItem('isSubscribed')) {
      subscribeToNotifications();
      localStorage.setItem('isSubscribed', 'true'); // Marca que la suscripción fue hecha
    }
  }, []);

  const handleChange = (e) => {
    setNewDish({ ...newDish, [e.target.name]: e.target.value });
  };

  const handleAddDish = async () => {
    const userId = localStorage.getItem("userId"); 
  
    if (!userId) {
      console.error("Error: No se ha encontrado el ID de usuario."); 
      return;
    }
  
    const dishToSend = {
      nombre: newDish.nombre,
      color: newDish.color,
      tamaño: newDish.tamaño,
      precio: newDish.precio,
      userId: userId,
    };
  
    try {
      const response = await fetch('http://localhost:4000/post_cocina', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(dishToSend)
      }); 
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la API: ${errorData.message}`);
      }
  
      const data = await response.json();
      // Actualiza la lista de con lo nuevo
      setDishes([...dishes, data]);
      setNewDish({ nombre: '', color: '', tamaño: '', precio: '' });
  
    } catch (error) {
      console.error('Error:', error);

      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
          const sw = await navigator.serviceWorker.ready;
          await sw.sync.register('sync-cocina'); 
          console.log('Sincronización registrada');
        } catch (err) {
          console.error('Error al registrar la sincronización:', err);
        }
      }

      try {
        await saveDishToIndexedDB(dishToSend);
        console.log('Ropa guardada en IndexedDB debido a la falla en la red'); 
      } catch (err) {
        console.error('Error al guardar en IndexedDB:', err);
      }
    }
  };
  
  const saveDishToIndexedDB = (dish) => {
    return new Promise((resolve, reject) => {
      let dbRequest = indexedDB.open('dishDB');
  
      dbRequest.onupgradeneeded = event => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains('dishes')) {
          db.createObjectStore('dishes', { keyPath: 'id', autoIncrement: true });
        }
      };
  
      dbRequest.onsuccess = event => {
        let db = event.target.result;
        let transaction = db.transaction('dishes', 'readwrite');
        let objectStore = transaction.objectStore('dishes');
        let addRequest = objectStore.add(dish);
  
        addRequest.onsuccess = () => {
          resolve();
        };
  
        addRequest.onerror = () => {
          reject('Error al guardar en IndexedDB');
        };
      };
  
      dbRequest.onerror = () => {
        reject('Error al abrir IndexedDB');
      };
    });
  };
  

  const deleteDish = (id) => {
    axios
      .delete(`/delete/${id}`)
      .then(() => setDishes(dishes.filter((dish) => dish._id !== id)))
      .catch((error) => console.error("Error al eliminar la ropa:", error));
  };

  async function subscribeToNotifications() {
    const userId = localStorage.getItem("userId");
  
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
  
        // Verificar si ya existe una suscripción
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          console.log("El usuario ya está suscrito");
          return;
        }
  
        // Solicitar permiso para notificaciones
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const newSubscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "BMFs1abMQdigAfOcZDc36bRKgAeZfg_VYc3_h-Kho0n0ouZBhi_Kr4-8j_mWd5WyVZ_zyrZtxT2p6GI_RMHhYfA"
          });
  
          // Formatear los datos de suscripción junto con userId
          const subscriptionData = {
            ...newSubscription.toJSON(),
            userId 
          };
  
          // Enviar la suscripción a la API
          const response = await fetch('http://localhost:4000/suscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscriptionData)
          });
  
          if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
          }
  
          const data = await response.json();
          console.log('Suscripción guardada en la BD', data);
        } else {
          console.log("Permiso para notificaciones denegado");
        }
      } catch (error) {
        console.error('Error en el proceso de suscripción', error);
      }
    } else {
      console.log("El navegador no soporta Service Worker o Push Notifications");
    }
  }
  

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Registro de ropa</h2>

      {/* Formulario para registrar platillos */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar ropa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            value={newDish.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="border border-gray-300 p-2 rounded-lg"
          />
          <input
            type="text"
            name="color"
            value={newDish.color}
            onChange={handleChange}
            placeholder="Color"
            className="border border-gray-300 p-2 rounded-lg"
          />
          <input
            type="text"
            name="tamaño"
            value={newDish.tamaño}
            onChange={handleChange}
            placeholder="Tamaño"
            className="border border-gray-300 p-2 rounded-lg"
          />
          <input
            type="number"
            name="precio"
            value={newDish.precio}
            onChange={handleChange}
            placeholder="Precio ($)"
            className="border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <button
          onClick={handleAddDish}
          className="bg-black text-white mt-4 py-2 px-4 rounded-lg"
        >
          Registrar 
        </button>
      </div>

      {/* Tabla de platillos registrados */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Color</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Tamaño</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish) => (
            <tr key={dish._id} className="border-t">
              <td className="py-3 px-4">{dish.nombre}</td>
              <td className="py-3 px-4">{dish.color}</td>
              <td className="py-3 px-4">{dish.tamaño}</td>
              <td className="py-3 px-4">${dish.precio}</td>
              <td className="py-3 px-4 flex space-x-2">
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => deleteDish(dish._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DishTable;
