import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import Pet from './schemas/Ropa'; // Esquema actualizado a Pet
import User from './schemas/User';
import Suscription from './schemas/Suscription';
import { sendPush } from './pushServer';


dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.SERVER_PORT || 4000;

// Middleware configuration
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';
mongoose.connect(mongoURI)

  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

  app.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
  
    try {
      // Verificar si el correo ya existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'El correo ya está en uso.' });
      }
  
      // Crear el nuevo usuario
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el usuario.', error });
    }
  });


  app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("Cuerpo de la solicitud:", req.body);
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
  
    try {
      // Buscar usuario por correo electrónico
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
      }
  
      // Verificar contraseña
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
      }
  
      res.status(200).json({ message: 'Inicio de sesión exitoso.', userId: user._id });
    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión.', error });
    }
  });


  app.post('/suscription', async (req: Request, res: Response) => {
    const { userId, endpoint, ...subscriptionData } = req.body;
  
    try {
      // Buscar si ya existe una suscripción con el mismo userId y endpoint
      const existingSubscription = await Suscription.findOne({ userId, endpoint });
  
      if (existingSubscription) {
        return res.status(200).json({ message: 'El usuario ya está suscrito con este endpoint' });
      }
  
      // Crear una nueva suscripción
      const newSubscription = new Suscription({
        userId,
        endpoint,
        ...subscriptionData,
      });
  
      await newSubscription.save();
      res.status(200).json({ message: 'Suscripción añadida exitosamente' });
    } catch (error) {
      res.status(400).json({ error: 'Error al agregar la nueva suscripción' });
    }
  });

  app.post('/sendNotification', async (req: Request, res: Response) => {
    const { userId, message } = req.body;
  
    try {
      // Buscar la suscripción del usuario
      const subscription = await Suscription.findOne({ userId });
      if (!subscription) {
        return res.status(404).json({ error: 'No subscription found for the specified userId.' });
      }
  
      // Verificar si las claves existen
      if (!subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
        return res.status(400).json({ error: 'Invalid subscription keys.' });
      }
  
      // Formatear la suscripción para cumplir con el tipo PushSubscription
      const pushSubscription = {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime ? subscription.expirationTime.getTime() : null, // Convertir Date a número
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      };
  
      // Enviar notificación push
      await sendPush(pushSubscription, message);
      res.status(200).json({ message: 'Push notification sent successfully.' });
    } catch (error) {
      console.error('Error sending push notification:', error);
      res.status(500).json({ error: 'Failed to send push notification.' });
    }
  });

// Routes
// Route to get all pets
app.get('/get_passwords', async (req: Request, res: Response) => {
  try {
    const userId = req.headers.userid as string; // Obtener userId desde los headers

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const passwords = await Pet.find({ userId });
    res.status(200).json(passwords);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving passwords', error });
  }
});

// Route to add a new pet
app.post('/post_cocina', async (req, res) => {
  const { nombre, color, tamaño, precio, userId } = req.body;
  console.log("Datos recibidos:", req.body);

  if (!nombre || !color || !tamaño || !precio || !userId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const nuevaPet = new Pet({ nombre, color, tamaño, precio, userId});
    await nuevaPet.save();
    res.status(201).json(nuevaPet);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar la ropa.', error });
  }
});

// Route to delete a pet by ID
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Pet.findByIdAndDelete(id);
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pet', error });
  }
});

// Route to add a new subscription
app.post('/suscription', async (req: Request, res: Response) => {
  const { userId, endpoint, ...subscriptionData } = req.body;

  try {
    // Buscar si ya existe una suscripción con el mismo userId y endpoint
    const existingSubscription = await Suscription.findOne({ userId, endpoint });

    if (existingSubscription) {
      return res.status(200).json({ message: 'El usuario ya está suscrito con este endpoint' });
    }

    // Crear una nueva suscripción
    const newSubscription = new Suscription({
      userId,
      endpoint,
      ...subscriptionData,
    });

    await newSubscription.save();
    res.status(200).json({ message: 'Suscripción añadida exitosamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al agregar la nueva suscripción' });
  }
});

app.post('/sendNotification', async (req: Request, res: Response) => {
  const { userId, message } = req.body;

  try {
    // Buscar la suscripción del usuario
    const subscription = await Suscription.findOne({ userId });
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found for the specified userId.' });
    }

    // Verificar si las claves existen
    if (!subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      return res.status(400).json({ error: 'Invalid subscription keys.' });
    }

    // Formatear la suscripción para cumplir con el tipo PushSubscription
    const pushSubscription = {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime ? subscription.expirationTime.getTime() : null, // Convertir Date a número
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };

    // Enviar notificación push
    await sendPush(pushSubscription, message);
    res.status(200).json({ message: 'Push notification sent successfully.' });
  } catch (error) {
    console.error('Error sending push notification:', error);
    res.status(500).json({ error: 'Failed to send push notification.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
