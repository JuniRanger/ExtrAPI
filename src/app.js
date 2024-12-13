import express from 'express';
import bodyParser from './middlewares/bodyParser.js';
import corsMiddleware from './middlewares/authMiddleware.js';
import morgan from 'morgan';
import mongooseConnect from './config/mongodbConfig.js';
import authRoutes from './routers/Auth.Routes.js';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

export const dotenvConfig = {
    SECRET_KEY: process.env.SECRET_KEY,
    EXPIRES_IN: process.env.EXPIRES_IN,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
};

const app = express();

// Conectar a MongoDB
mongooseConnect();

app.use(express.json());
app.use(bodyParser.jsonParser);
app.use(bodyParser.urlencodedParser);
app.use(morgan('dev'));
app.use(corsMiddleware);

//----rutas----//
app.use('/api', authRoutes);

// Verificar la variable de entorno PORT
const PORT = process.env.PORT;

if (!PORT) {
    console.error('Error: La variable de entorno PORT no está definida');
    process.exit(1);
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
